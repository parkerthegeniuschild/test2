import { ApiHandler, useJsonBody, usePathParams } from 'sst/node/api';
import { response } from '@utils/response';
import { useDb } from 'db/dbClient';
import {
  createJobRequestSchema,
  jobRequests as jobRequestsSchema,
} from 'db/schema/jobRequests';
import { useAuth } from 'clients/auth';
import { ERROR, JobRequestStatus, ROLE } from '@utils/constants';
import { providerLocations as providerLocationsSchema } from 'db/schema/providerLocations';
import { desc, eq } from 'drizzle-orm';
import { jobs as jobsSchema } from 'db/schema/jobs';
import { z } from 'zod';
import { IdScalar, PathIdScalar } from '@utils/schema';

const db = useDb({
  jobs: jobsSchema,
  jobRequests: jobRequestsSchema,
  providerLocations: providerLocationsSchema,
});

const payloadSchema = createJobRequestSchema.pick({
  provider_id: true,
});

const pathSchema = z.object({ id: PathIdScalar });

export const handler = ApiHandler(async () => {
  const { username } = useAuth({ requiredRole: ROLE.AGENT });
  const { id: jobId } = pathSchema.parse(usePathParams());
  const { provider_id: providerId } = payloadSchema.parse(useJsonBody());

  const [location, _job] = await Promise.all([
    getProvidersLastLocation(providerId),
    getJob(jobId),
  ]);
  if (!(location?.latitude && location?.longitude)) {
    return response.error({ code: ERROR.providerNoLocation });
  }
  if (!_job) return response.error({ code: ERROR.noJob });
  const job = validJobSchema.safeParse(_job);
  if (!job.success) {
    return response.error({ code: ERROR.jobNotAvailable });
  }

  const travelData = await calculateTravel();

  const {
    data: { service_area_id, ...locationData },
  } = job;

  const [jobRequest] = await db
    .insert(jobRequestsSchema)
    .values({
      job_id: jobId,
      provider_id: providerId,
      service_area_id,
      ...locationData,
      ...travelData,
      created_by: username,
      status: 'NOTIFYING',
    })
    .returning();
  return response.created(jobRequest);
});

const getProvidersLastLocation = async (providerId: number) => {
  const [location] = await db
    .select({
      latitude: providerLocationsSchema.latitude,
      longitude: providerLocationsSchema.longitude,
    })
    .from(providerLocationsSchema)
    .where(eq(providerLocationsSchema.provider_id, providerId))
    .orderBy(desc(providerLocationsSchema.created_at))
    .limit(1);
  return location as typeof location | undefined;
};

const getJob = async (jobId: number) => {
  const [job] = await db
    .select()
    .from(jobsSchema)
    .where(eq(jobsSchema.id, jobId));
  return job as typeof job | undefined;
};

const validJobSchema = z.object({
  location_address: z.string(),
  location_city: z.string(),
  location_state: z.string(),
  location_details: z.string(),
  location_notes: z.string().nullish(),
  location_latitude: z.number(),
  location_longitude: z.number(),
  service_area_id: IdScalar,
  status_id: z.enum([JobRequestStatus.UNASSIGNED, JobRequestStatus.NOTIFYING]),
});

// TODO implement real calculations here using navigation provider
const calculateTravel = async () => {
  // random mock data
  return { distance: 12345.67, duration: 17.943 };
};

import { eq } from 'drizzle-orm';
import { jobVehicleContactServiceParts as jobVehicleContactServicePartsSchema } from 'db/schema/jobVehicleContactServiceParts';
import { useDb } from 'db/dbClient';
import { TDatabase, TTransaction } from '@utils/dbTransaction';
import { jobVehicleContactServices as jobVehicleContactServicesSchema } from 'db/schema/jobVehicleContactServices';
import { jobVehicleContacts as jobVehicleContactsSchema } from 'db/schema/jobVehicleContacts';

interface IListPartsByJobIdInput {
  jobId: number;
  dbInstance?: TDatabase | TTransaction;
}

export const listPartsByJobId = async ({
  jobId,
  dbInstance = useDb(),
}: IListPartsByJobIdInput) => {
  return await dbInstance
    .select()
    .from(jobVehicleContactServicePartsSchema)
    .innerJoin(
      jobVehicleContactServicesSchema,
      eq(
        jobVehicleContactServicesSchema.id,
        jobVehicleContactServicePartsSchema.job_vehicle_contact_service_id
      )
    )
    .innerJoin(
      jobVehicleContactsSchema,
      eq(
        jobVehicleContactsSchema.id,
        jobVehicleContactServicesSchema.job_vehicle_contact_id
      )
    )
    .where(eq(jobVehicleContactsSchema.job_id, jobId));
};

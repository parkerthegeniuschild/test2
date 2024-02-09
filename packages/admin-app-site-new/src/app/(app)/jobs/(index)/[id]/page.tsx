import { redirect } from 'next/navigation';
import { match, P } from 'ts-pattern';

import { getZoomByLocationType } from '@/app/(app)/jobs/(index)/_components/Map/zoomLevels';

import {
  DEFAULT_VEHICLE_DATA,
  DEFAULT_VEHICLE_SERVICE_DATA,
  useGetJob,
  useGetServiceTypes,
  useGetTimezone,
  usePostVehicle,
  usePostVehicleService,
} from './_api';
import { Container } from './_components';
import { Providers } from './providers';

type JobDetailsPagePayload = {
  params: { id: string };
};

export function generateMetadata({ params }: JobDetailsPagePayload) {
  return { title: `Job #${params.id}` };
}

export default async function JobDetailsPage({
  params,
}: JobDetailsPagePayload) {
  const jobId = Number(params.id);

  if (Number.isNaN(jobId) || !Number.isInteger(jobId)) {
    redirect('/jobs');
  }

  let jobDetails;
  let serviceTypes;
  let timezone;

  try {
    [jobDetails, serviceTypes] = await Promise.all([
      useGetJob.queryFn(String(jobId)),
      useGetServiceTypes.queryFn(),
    ]);

    if (
      typeof jobDetails.location_latitude === 'number' &&
      typeof jobDetails.location_longitude === 'number'
    ) {
      timezone = await useGetTimezone.queryFn({
        lat: jobDetails.location_latitude,
        lng: jobDetails.location_longitude,
      });
    }

    if (!jobDetails.jobVehicles?.length) {
      const newVehicle = await usePostVehicle.mutationFn({
        jobId: jobId.toString(),
        ...DEFAULT_VEHICLE_DATA,
      });
      const newVehicleService = await usePostVehicleService.mutationFn({
        jobId: jobId.toString(),
        vehicleId: newVehicle.id,
        service_id: null,
        ...DEFAULT_VEHICLE_SERVICE_DATA,
      });

      jobDetails.jobVehicles = [
        {
          ...newVehicle,
          jobServices: [{ jobServiceParts: [], ...newVehicleService }],
        },
      ];
    }
  } catch (err) {
    console.error('Error while getting job details', err);
  }

  const isAllStep2FieldsFilled = Boolean(
    jobDetails?.location_address &&
      typeof jobDetails.location_latitude === 'number' &&
      typeof jobDetails.location_longitude === 'number' &&
      jobDetails.location_details
  );

  return (
    <main>
      <Providers>
        <Container
          jobId={String(jobId)}
          initialJobDetails={jobDetails}
          initialServiceTypes={serviceTypes}
          initialTimezone={timezone}
          initialAtomsStates={{
            page: {
              currentStep: match({
                isAllStep2FieldsFilled,
                status: jobDetails?.status_id,
              })
                .with({ status: P.not('DRAFT') }, () => 4)
                .with({ isAllStep2FieldsFilled: true }, () => 3)
                .with({ isAllStep2FieldsFilled: false }, () => 2)
                .otherwise(() => 4),
            },
            step2: {
              address: jobDetails?.location_address ?? null,
              city: jobDetails?.location_city ?? null,
              state: jobDetails?.location_state ?? null,
              street: jobDetails?.location_street ?? null,
              streetNumber: jobDetails?.location_street_number ?? null,
              zip: jobDetails?.location_zip ?? null,
              locationType: jobDetails?.location_type ?? null,
              locationDetails: jobDetails?.location_details ?? null,
              locationNotes: jobDetails?.location_notes ?? null,
            },
            step3: {
              vehicles: jobDetails?.jobVehicles ?? [],
            },
            map: {
              ...(typeof jobDetails?.location_latitude === 'number' &&
              typeof jobDetails?.location_longitude === 'number'
                ? {
                    viewState: {
                      latitude: jobDetails.location_latitude,
                      longitude: jobDetails.location_longitude,
                      zoom: getZoomByLocationType(jobDetails.location_type),
                    },
                    jobMarkerLocation: {
                      latitude: jobDetails.location_latitude,
                      longitude: jobDetails.location_longitude,
                    },
                    showJobMarkerHint: false,
                  }
                : {}),
            },
          }}
        />
      </Providers>
    </main>
  );
}

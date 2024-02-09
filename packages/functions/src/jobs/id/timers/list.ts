import { getOnlyJobById } from '@core/jobs';
import { IGetTimersByJobId, getTimersByJobId } from '@core/serviceTimers';
import { snakeCaseKeys } from '@utils/helpers';
import { useAuth, userIsProvider } from 'clients/auth';
import { jobVehicleContactPostPath } from 'dto/jobVehicleContact/create';
import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupForbiddenError, TruckupNotFoundError } from 'src/errors';
import { usePathParams } from 'sst/node/api';

type ProviderLabors = {
  secondsWorked: number;
  labors: Array<{
    vehicleId?: number | null;
    serviceId?: number | null;
    secondsWorked: number;
    timers: Array<{
      id: number;
      secondsWorked: number;
      startTime: string;
      endTime: string | null;
    }>;
  }>;
};

export const handler = TupApiHandler(async () => {
  const auth = useAuth();

  const { id: jobId } = jobVehicleContactPostPath.parse(usePathParams());

  const job = await getOnlyJobById(jobId);

  if (!job) throw new TruckupNotFoundError();

  if (userIsProvider() && job.provider_id !== auth.providerId)
    throw new TruckupForbiddenError();

  const timers = await getTimersByJobId(jobId, auth.providerId);

  const res = timers.reduce(
    (acc: ProviderLabors, timer: IGetTimersByJobId) => {
      acc.secondsWorked += timer.timer;

      const lastServiceId = acc.labors[acc.labors.length - 1]?.serviceId;

      if (timer.jobVehicleContactServiceId === lastServiceId) {
        acc.labors[acc.labors.length - 1].secondsWorked += timer.timer;
        acc.labors[acc.labors.length - 1].timers.push({
          id: timer.id,
          secondsWorked: timer.timer,
          startTime: timer.startTime.toISOString(),
          endTime: timer.endTime?.toISOString() ?? null,
        });
      } else {
        acc.labors.push({
          vehicleId: timer.jobVehicleContactId,
          serviceId: timer.jobVehicleContactServiceId,
          secondsWorked: timer.timer,
          timers: [
            {
              id: timer.id,
              secondsWorked: timer.timer,
              startTime: timer.startTime.toISOString(),
              endTime: timer.endTime?.toISOString() ?? null,
            },
          ],
        });
      }

      return acc;
    },
    {
      secondsWorked: 0,
      labors: [],
    } as ProviderLabors
  );

  return snakeCaseKeys(res);
});

import { useQuery } from '@tanstack/react-query';

import {
  differenceInMinutes,
  minutesToHours,
  setMilliseconds,
  setSeconds,
} from '@/app/_lib/dateFns';
import { api } from '@/app/_services/api';

import type { Labor } from '../_types';

type GetProviderLaborsAPIResponse = {
  seconds_worked: number;
  labors: Labor[];
};

type GetProviderLaborsParams = {
  jobId: string;
};

function differenceInTruncatedMinutes(dateLeft: Date, dateRight: Date) {
  const dateLeftTruncated = setMilliseconds(setSeconds(dateLeft, 0), 0);
  const dateRightTruncated = setMilliseconds(setSeconds(dateRight, 0), 0);

  return Math.abs(differenceInMinutes(dateLeftTruncated, dateRightTruncated));
}

function minutesToFormattedTime(minutes: number) {
  const hours = minutesToHours(minutes);

  const minutesLeft = minutes % 60;

  return `${hours}h ${minutesLeft}m`;
}

async function getProviderLabors({ jobId }: GetProviderLaborsParams) {
  const response = await api.get<GetProviderLaborsAPIResponse>(
    `/jobs/${jobId}/timers`
  );

  let totalMinutesWorked = 0;
  let isInProgress = false;

  const labors = response.data.labors.map(labor => ({
    ...labor,
    timers: labor.timers.map(timer => {
      const startTime = new Date(timer.start_time);
      const endTime = timer.end_time ? new Date(timer.end_time) : null;

      const minutesWorked = differenceInTruncatedMinutes(
        endTime ?? new Date(),
        startTime
      );

      totalMinutesWorked += minutesWorked;

      if (!endTime) {
        isInProgress = true;
      }

      return {
        ...timer,
        minutesWorked,
        formattedWorkedTime: minutesToFormattedTime(minutesWorked),
      };
    }),
  }));

  return {
    ...response.data,
    labors,
    minutesWorked: totalMinutesWorked,
    formattedWorkedTime: minutesToFormattedTime(totalMinutesWorked),
    isInProgress,
  };
}

type GetProviderLaborsParsedResponse = Awaited<
  ReturnType<typeof getProviderLabors>
>;
export type LaborParsed = GetProviderLaborsParsedResponse['labors'][number];

type UseGetProviderLaborsParams = {
  enabled?: boolean;
};

export function useGetProviderLabors(
  params: GetProviderLaborsParams,
  { enabled }: UseGetProviderLaborsParams = {}
) {
  return useQuery({
    queryKey: ['useGetProviderLabors', params],
    queryFn: () => getProviderLabors(params),
    refetchInterval: 30 * 1000, // 30 seconds
    enabled,
  });
}

import {
  utcToZonedTime as _utcToZonedTime,
  zonedTimeToUtc as _zonedTimeToUtc,
} from 'date-fns-tz';

import {
  isAfter,
  isFuture,
  setMilliseconds,
  setSeconds,
} from '@/app/_lib/dateFns';

export function resetSecondsAndMilliseconds(date: Date) {
  return setMilliseconds(setSeconds(date, 0), 0);
}

export function laborErrorCodeToText(error: string) {
  switch (error) {
    case 'LABOR_ALREADY_IN_PROGRESS':
      return "There's already another labor in progress";

    case 'LABOR_END_TIME_BEFORE_START_TIME':
      return 'End time must be after start time';

    case 'LABOR_HAS_OVERLAP':
      return 'Labor has a time overlap with another labor';

    case 'LABOR_ON_FUTURE':
      return 'Start and end time cannot be in the future';

    default:
      return null;
  }
}

export function getTimesChecks(startTime: Date | null, endTime: Date | null) {
  const isStartTimeAfterEndTime =
    startTime && endTime && isAfter(startTime, endTime);
  const isStartTimeOnFuture = startTime && isFuture(startTime);
  const isEndTimeOnFuture = endTime && isFuture(endTime);

  return { isStartTimeAfterEndTime, isStartTimeOnFuture, isEndTimeOnFuture };
}

export function curriedUtcToZonedTime(timezone: string) {
  return (date: Date | string) => _utcToZonedTime(date, timezone);
}

export function curriedZonedTimeToUtc(timezone: string) {
  return (date: Date) => _zonedTimeToUtc(date, timezone);
}

import { format, utcToZonedTime } from 'date-fns-tz';

import { useGetJob, useGetTimezone } from '@/app/(app)/jobs/(index)/[id]/_api';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { Text } from '@/components';

export function ServiceTimeShowcase() {
  const jobId = useJobId();

  const getJob = useGetJob(jobId);
  const getTimezone = useGetTimezone({
    lat: getJob.data?.location_latitude ?? undefined,
    lng: getJob.data?.location_longitude ?? undefined,
  });

  if (!getJob.data || !getTimezone.data) {
    return null;
  }

  const createdAtDate = utcToZonedTime(
    getJob.data.created_at,
    getTimezone.data.tz
  );
  const currentDate = utcToZonedTime(new Date(), getTimezone.data.tz);
  const isToday =
    format(createdAtDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');

  return (
    <Text fontWeight="medium" color="danger.475">
      {isToday && 'Today, '}
      {format(createdAtDate, 'EEE MMM d, yyyy', {
        timeZone: getTimezone.data.tz,
      })}{' '}
      (ASAP)
    </Text>
  );
}

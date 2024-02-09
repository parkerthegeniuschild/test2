import { useGetJob, useGetTimezone } from '@/app/(app)/jobs/(index)/[id]/_api';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { Text } from '@/components';
import { Center, Flex, styled } from '@/styled-system/jsx';

import { PlayStopIcon } from './PlayStopIcon';

const Entry = styled('div', {
  base: {
    display: 'flex',

    '& + &': {
      '& .labor-entry-info-container': {
        borderTopWidth: '1px',
        borderTopColor: 'gray.200',
      },
    },
  },
});

interface LaborEntryProps {
  timeType: 'start' | 'end';
  timestamp: string;
}

export function LaborEntry({
  children,
  timeType,
  timestamp,
}: React.PropsWithChildren<LaborEntryProps>) {
  const jobId = useJobId();

  const getJob = useGetJob(jobId);
  const getTimezone = useGetTimezone({
    lat: getJob.data?.location_latitude ?? undefined,
    lng: getJob.data?.location_longitude ?? undefined,
  });

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    timeZone: getTimezone.data?.tz,
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp));
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    timeZone: getTimezone.data?.tz,
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(timestamp));

  return (
    <Entry>
      <Center w="2.5rem">
        <PlayStopIcon state={timeType === 'start' ? 'play' : 'stop'} />
      </Center>

      <Flex
        className="labor-entry-info-container"
        justify="space-between"
        align="center"
        pr={3}
        py={3}
        flex={1}
      >
        <Flex align="center" gap={0.75}>
          <Text fontWeight="medium" color="gray.400">
            {formattedDate} -
          </Text>
          <Text fontWeight="medium" color="gray.900">
            {formattedTime}
          </Text>
        </Flex>

        {children}
      </Flex>
    </Entry>
  );
}

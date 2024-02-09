import type { LaborParsed } from '@/app/(app)/jobs/(index)/[id]/_api';
import { DotsFlashing } from '@/app/(app)/jobs/(index)/[id]/_components/DotsFlashing';
import { Icon, Text } from '@/components';
import { css } from '@/styled-system/css';
import { Box, Center, Flex, styled } from '@/styled-system/jsx';

import { LaborBlock } from './LaborBlock';

const Container = styled('div', {
  base: {
    display: 'flex',
    gap: 2.3,

    '& .labor-card-timeline-bar': {
      display: 'none',
    },

    '&:not(:last-of-type)': {
      mb: '0.0625rem',

      '& .labor-card-timeline-bar': {
        display: 'block',
      },

      '& .labor-card-block-container': {
        pb: '0.6875rem',
      },
    },
  },
});

interface LaborCardProps {
  labor: LaborParsed;
  vehicleIndex?: number;
  serviceName: string;
}

export function LaborCard({
  labor,
  serviceName,
  vehicleIndex,
}: LaborCardProps) {
  const isSomeTimerInProgress = labor.timers.some(timer => !timer.end_time);
  const isGhostTimer = !vehicleIndex;

  const cardTitle = isGhostTimer
    ? 'Waiting time'
    : `Vehicle ${vehicleIndex} - ${serviceName}`;

  return (
    <Container>
      <Flex direction="column">
        <Center h={3.5}>
          <Center
            h={6}
            w={6}
            bgColor={
              isSomeTimerInProgress
                ? 'rgba(0, 204, 102, 0.12)'
                : 'rgba(1, 2, 3, 0.12)'
            }
            rounded="full"
            fontSize="lg"
            color="gray.900"
            transitionProperty="background-color"
            transitionTimingFunction="ease-in-out"
            transitionDuration="fast"
          >
            {isSomeTimerInProgress ? (
              <DotsFlashing css={{ transform: 'scale(0.9)' }} />
            ) : (
              <Icon.Check className={css({ transform: 'translateY(0.5px)' })} />
            )}
          </Center>
        </Center>

        <Box h="0.5625rem" flexShrink={0} />

        <Box
          className="labor-card-timeline-bar"
          width={0.5}
          height="100%"
          bgColor={isSomeTimerInProgress ? 'primary' : 'gray.300'}
          mx="auto"
          transitionProperty="background-color"
          transitionTimingFunction="ease-in-out"
          transitionDuration="fast"
        />
      </Flex>

      <Flex
        className="labor-card-block-container"
        direction="column"
        gap={2.3}
        flex={1}
      >
        <Text fontWeight="semibold" color="gray.700">
          {cardTitle}
        </Text>
        <Flex direction="column" gap={1.5}>
          {labor.timers.map(timer => (
            <LaborBlock
              key={timer.id}
              labor={labor}
              timeWorked={timer.formattedWorkedTime}
              timerId={timer.id}
              startTime={timer.start_time}
              endTime={timer.end_time}
              laborTitle={cardTitle}
            />
          ))}
        </Flex>
      </Flex>
    </Container>
  );
}

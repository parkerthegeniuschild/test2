import { useState } from 'react';
import { useStopwatch } from 'react-timer-hook';

import { Spinner, Text, TextButton } from '@/components';
import { Flex } from '@/styled-system/jsx';

interface LaborStopwatchProps {
  offsetTimestamp: Date;
  loading?: boolean;
  autoStart?: boolean;
  onMinutesChange?: () => void;
  onStop?: () => void;
}

export function LaborStopwatch({
  offsetTimestamp,
  autoStart = true,
  loading,
  onMinutesChange,
  onStop,
}: LaborStopwatchProps) {
  const { seconds, minutes, hours, days } = useStopwatch({
    autoStart,
    offsetTimestamp,
  });

  const [deferredMinutes, setDeferredMinutes] = useState(minutes);

  if (minutes !== deferredMinutes) {
    onMinutesChange?.();
    setDeferredMinutes(minutes);
  }

  return (
    <Flex align="center" gap={3}>
      <TextButton colorScheme="danger" disabled={loading} onClick={onStop}>
        {loading ? <Spinner borderColor="currentColor" /> : 'Stop'}
      </TextButton>
      <Text
        fontWeight="medium"
        textAlign="right"
        color="primary"
        w="3.875rem"
        whiteSpace="nowrap"
        className="labor-entry-timer"
      >
        {(hours + days * 24).toString().padStart(2, '0')}:
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}
      </Text>
    </Flex>
  );
}

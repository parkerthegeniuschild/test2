import { useState } from 'react';

import { useShouldBlurSection } from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { Label, Radio } from '@/components';
import { Flex, Stack } from '@/styled-system/jsx';

type ServiceTimeValue = 'asap' | 'later';

export function ServiceTime() {
  const shouldBlurSection = useShouldBlurSection();

  const [serviceTime, setServiceTime] = useState<ServiceTimeValue>('asap');
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <Flex flexDir="column" gap={3} mt={6}>
      <Label as="p" color="gray.600">
        Service time
      </Label>

      <Flex flexDir="column" gap={2}>
        <Radio.Group
          value={serviceTime}
          onChange={s => setServiceTime(s as ServiceTimeValue)}
        >
          <Stack gap={4}>
            <Radio value="asap" tabIndex={shouldBlurSection ? -1 : undefined}>
              Today (ASAP)
            </Radio>
            {/* <Radio value="later" tabIndex={shouldBlurSection ? -1 : undefined}>
              Schedule for later
            </Radio> */}
          </Stack>
        </Radio.Group>

        {/* <Transition.Fade open={serviceTime === 'later'}>
          <Flex
            flexDir="column"
            gap={2}
            // (radio width) + (label gap)
            transform="translateX(calc(1.125rem + 0.5rem))"
            maxW="max"
          >
            <DateTimePicker
              tabIndex={shouldBlurSection ? -1 : undefined}
              value={selectedDate}
              onChange={setSelectedDate}
            />

            <Text lineHeight="md">Timezone: UTC-6 - Chicago</Text>
          </Flex>
        </Transition.Fade> */}
      </Flex>
    </Flex>
  );
}

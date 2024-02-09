import { useState } from 'react';

import { format } from '@/app/_utils';
import { Button, Dropdown, Select } from '@/components';
import { Flex } from '@/styled-system/jsx';

interface MileRadiusFilterProps {
  initialValue: string;
  onApply?: (mileRadius: string) => void;
}

export function MileRadiusFilter({
  initialValue,
  onApply,
}: MileRadiusFilterProps) {
  const [mileRadius, setMileRadius] = useState(initialValue);

  return (
    <>
      <Dropdown.Heading>Provider search radius:</Dropdown.Heading>

      <Flex direction="column" gap={2} py={2} px={4}>
        <Select
          size="sm"
          activeText={`${format.number(Number(mileRadius))} mi`}
          value={mileRadius}
          onChange={v => setMileRadius(v as string)}
        >
          <Select.Item value="100">100 mi</Select.Item>
          <Select.Item value="250">250 mi</Select.Item>
          <Select.Item value="500">500 mi</Select.Item>
          <Select.Item value="1000">1,000 mi</Select.Item>
        </Select>
      </Flex>

      <Flex px={3} py={1}>
        <Button size="sm" full onClick={() => onApply?.(mileRadius)}>
          Apply
        </Button>
      </Flex>
    </>
  );
}

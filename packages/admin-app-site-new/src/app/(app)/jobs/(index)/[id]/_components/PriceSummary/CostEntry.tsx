import { Flex, styled } from '@/styled-system/jsx';
import type { StyledVariantProps } from '@/styled-system/types';

const Text = styled('span', {
  base: {
    fontSize: 'sm',
    lineHeight: 1,
    color: 'gray.700',
    fontWeight: 'medium',
  },
  variants: {
    highlight: {
      true: {
        fontWeight: 'semibold',
        fontSize: 'md',
      },
    },
  },
});

interface CostEntryProps extends StyledVariantProps<typeof Text> {
  label: string;
  value: string;
  description?: React.ReactNode;
}

export function CostEntry({
  label,
  value,
  description,
  highlight,
}: CostEntryProps) {
  return (
    <Flex align="center" gap={4}>
      <Text flex={1} highlight={highlight}>
        {label}
      </Text>

      {description}

      <Text minW={20} textAlign="right" highlight={highlight}>
        {value}
      </Text>
    </Flex>
  );
}

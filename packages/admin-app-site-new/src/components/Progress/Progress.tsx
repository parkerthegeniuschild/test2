import { styled } from '@/styled-system/jsx';

const Container = styled('div', {
  base: {
    overflow: 'hidden',
    height: 1,
    bgColor: 'gray.100',
    rounded: 'full',
  },
});

const Bar = styled('div', {
  base: {
    height: '100%',
    transitionProperty: 'width',
    transitionDuration: 'slow',
    transitionTimingFunction: 'ease-in-out',
    bgColor: 'primary',
    rounded: 'inherit',
  },
});

interface ProgressProps {
  value: number;
}

export function Progress({ value }: ProgressProps) {
  const parsedValue = Math.min(Math.max(value, 0), 100);

  return (
    <Container>
      <Bar
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={parsedValue}
        role="progressbar"
        style={{ width: `${parsedValue}%` }}
      />
    </Container>
  );
}

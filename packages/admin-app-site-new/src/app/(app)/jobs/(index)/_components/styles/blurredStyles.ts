import { cva } from '@/styled-system/css';

export const blurredStyles = cva({
  base: {
    opacity: 0.4,
    pointerEvents: 'none',
    userSelect: 'none',
    transition: 'opacity token(durations.fast) ease-in-out',
  },
});

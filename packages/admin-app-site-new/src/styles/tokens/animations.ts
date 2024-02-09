import type { CssKeyframes } from '@/styled-system/types/system-types';

export const keyframes: CssKeyframes = {
  sweep: {
    '0%': {
      clipPath: 'polygon(0% 0%, 0% 0%, 0% 0%, 50% 50%, 0% 0%, 0% 0%, 0% 0%)',
    },
    '50%': {
      clipPath:
        'polygon(0% 0%, 0% 100%, 0% 100%, 50% 50%, 100% 0%, 100% 0%, 0% 0%)',
    },
    '100%': {
      clipPath:
        'polygon(0% 0%, 0% 100%, 100% 100%, 50% 50%, 100% 100%, 100% 0%, 0% 0%)',
    },
  },

  dotFlashing: {
    '0%': {
      backgroundColor: 'var(--solid-dot-color)',
    },

    '50%, 100%': {
      backgroundColor: 'var(--transparent-dot-color)',
    },
  },
};

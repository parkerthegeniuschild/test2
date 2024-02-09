import { defineTokens } from '@pandacss/dev';

export const durations = defineTokens.durations({
  fast: { value: '150ms' },
  medium: { value: '200ms' },
  slow: { value: '300ms' },
});

export const easings = defineTokens.easings({
  easeInOut: { value: [0.4, 0, 0.2, 1] },
});

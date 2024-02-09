import { defineTokens } from '@pandacss/dev';

export const shadows = defineTokens.shadows({
  inset: { value: '0px -1px 0px 0px rgba(1, 2, 3, 0.12) inset' },
  sm: { value: '0px 1px 2px 0px rgba(1, 2, 3, 0.08)' },
  menu: {
    sm: {
      value:
        '0px 1px 2px 0px rgba(1, 2, 3, 0.08), 0px 4px 16px -8px rgba(1, 2, 3, 0.16)',
    },
    md: {
      value:
        '0px 1px 2px 0px rgba(1, 2, 3, 0.08), 0px 8px 24px -8px rgba(1, 2, 3, 0.24)',
    },
  },
});

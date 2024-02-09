import { defineTokens } from '@pandacss/dev';

export const radii = defineTokens.radii({
  'xs.2xl': { value: '0.1875rem' }, // 3px
  md: { value: '0.3125rem' }, // 5px
  'md.lg': { value: '0.375rem' }, // 6px
  'md.xl': { value: '0.4375rem' }, // 7px
  'lg.xl': { value: '0.625rem' }, // 10px
});

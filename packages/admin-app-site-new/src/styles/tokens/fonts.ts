import { defineTokens } from '@pandacss/dev';

export const fonts = defineTokens.fonts({
  inter: { value: ['var(--font-inter)', 'var(--font-fallback)'] },
  firacode: {
    value: [
      'var(--font-fira-code)',
      'SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace',
    ],
  },
});

export const fontSizes = defineTokens.fontSizes({
  '2xs.xl': { value: '0.75rem' }, // 12px
  xs: { value: '0.8125rem' }, // 13px
  xl: { value: '1.25rem' }, // 20px
  '2xl': { value: '1.625rem' }, // 26px
  '3.5xl': { value: '2rem' }, // 32px
});

export const lineHeights = defineTokens.lineHeights({
  sm: { value: '1.125rem' }, // 18px
  md: { value: '1.25rem' }, // 20px
  lg: { value: '1.375rem' }, // 22px
});

export const fontWeights = defineTokens.fontWeights({
  normal: { value: 400 },
  medium: { value: 500 },
  semibold: { value: 600 },
  bold: { value: 700 },
});

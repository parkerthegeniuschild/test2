import { defineTokens } from '@pandacss/dev';

export const colors = defineTokens.colors({
  gray: {
    25: { value: '#f8f9fb' },
    50: { value: '#f5f7fa' },
    75: { value: '#f0f2f5' },
    100: { value: '#e4e8ed' },
    200: { value: '#dde1e5' },
    300: { value: '#c2c6cc' },
    400: { value: '#828c99' },
    500: { value: '#525b66' },
    600: { value: '#3d444d' },
    700: { value: '#262c33' },
    800: { value: '#172026' },
    900: { value: '#010203' },
  },
  blue: {
    500: { value: '#1c92ff' },
    600: { value: '#1471db' },
    DEFAULT: { value: '{colors.blue.500}' },
  },
  primary: {
    400: { value: '#2ee58a' },
    500: { value: '#00cc66' },
    600: { value: '#00994d' },
    700: { value: '#006633' },
    DEFAULT: { value: '{colors.primary.500}' },
  },
  danger: {
    300: { value: '#fbaf7c' },
    400: { value: '#f78f5a' },
    450: { value: '#ff800a' },
    475: { value: '#ff7d05' },
    500: { value: '#f25d26' },
    600: { value: '#d03f1b' },
    DEFAULT: { value: '{colors.danger.500}' },
  },
  warning: {
    500: { value: '#ffaf0a' },
    600: { value: '#db8e07' },
    DEFAULT: { value: '{colors.warning.500}' },
  },

  outline: {
    value: '{colors.black}',
  },
});

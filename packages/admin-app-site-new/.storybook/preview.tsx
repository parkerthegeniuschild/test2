import type { Preview } from '@storybook/react';

import '@/styles/global.css';

import './font.css';
import { colors } from '@/styles/tokens/colors';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on[A-Z].*' },
    backgrounds: {
      default: 'default',
      values: [
        {
          name: 'default',
          value: colors.gray[50].value,
        },
        {
          name: 'white',
          value: 'white',
        },
        {
          name: 'dark',
          value: colors.gray[800].value,
        },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;

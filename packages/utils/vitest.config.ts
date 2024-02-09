/* eslint-disable @typescript-eslint/naming-convention */
import { defineConfig } from 'vitest/config';
// eslint-disable-next-line import/no-relative-packages
import { NODE_ENV } from './constants';

export default defineConfig({
  plugins: [],
  test: {
    threads: false,
    isolate: false,
    globals: true,
    environment: 'node',
    env: {
      NODE_ENV: NODE_ENV.TEST,
    },
  },
});

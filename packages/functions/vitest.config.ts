/* eslint-disable @typescript-eslint/naming-convention */
import path from 'node:path';
import { defineConfig } from 'vitest/config';
// eslint-disable-next-line import/no-relative-packages
import { NODE_ENV } from '../utils/constants';

const resolve = (_path: string) => path.resolve(__dirname, _path);

export default defineConfig({
  plugins: [],
  test: {
    threads: false,
    isolate: false,
    globals: true,
    setupFiles: [resolve('./tests/setupToken.ts')],
    environment: 'node',
    testTimeout: 15000,
    env: {
      NODE_ENV: NODE_ENV.TEST,
    },
    alias: {
      '@openAPI': resolve('./src/openAPI'),
      '@environment': resolve('./environment'),
      '@utils': resolve('../utils'),
      '@tests': resolve('./tests'),
    },
  },
});

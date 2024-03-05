/* eslint-disable @typescript-eslint/naming-convention */
import path from 'node:path';
import { defineConfig } from 'vitest/config';
// eslint-disable-next-line import/no-relative-packages
import { NODE_ENV } from '../utils/constants';

const resolve = (_path: string) => path.resolve(__dirname, _path);

export default defineConfig({
  plugins: [],
  test: {
    // coverage: {
    //   reportsDirectory: resolve('./tests/coverage'),
    //   clean: true,
    //   enabled: true,
    //   reporter: ['text-summary', 'json-summary'],
    //   include: ['packages/functions/tests'],
    // },
    reporters: [
      [
        'junit',
        {
          suiteName: 'E2E Backend Test',
          outputFile: resolve('./tests/reports/report.xml'),
        },
      ],
      'default',
    ],
    watch: false,
    isolate: false,
    globals: true,
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

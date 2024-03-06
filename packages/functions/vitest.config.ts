/* eslint-disable @typescript-eslint/naming-convention */
import path from 'node:path';
import { defineConfig } from 'vitest/config';

const resolve = (_path: string) => path.resolve(__dirname, _path);

export default defineConfig({
  plugins: [],
  test: {
    reporters: [
      [
        'github-actions',
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
    alias: {
      '@openAPI': resolve('./src/openAPI'),
      '@environment': resolve('./environment'),
      '@utils': resolve('../utils'),
      '@tests': resolve('./tests'),
    },
  },
});

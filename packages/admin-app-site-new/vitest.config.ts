/* eslint-disable import/no-extraneous-dependencies */

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react() as unknown as Plugin],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    alias: {
      '@': '/src',
    },
  },
});

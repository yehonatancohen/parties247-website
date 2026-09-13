import { defineConfig } from 'vitest/config';
import path from 'path';

// Pure-function unit tests for src/lib/* (see CLAUDE.md "Testing conventions").
// No plugin/JSX handling needed yet — everything under test so far is plain
// TS, no React components. Add @vitejs/plugin-react here if/when that changes.
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});

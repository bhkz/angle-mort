import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/angle-mort/',
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});

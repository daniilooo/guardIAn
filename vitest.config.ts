import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['{apps,packages,plugins,scripts,tests}/**/*.test.ts'],
    exclude: ['**/node_modules/**', 'scripts/spike/**'],
  },
});

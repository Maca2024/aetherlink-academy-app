import {tmpdir} from 'node:os';
import path from 'node:path';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  cacheDir: path.join(tmpdir(), 'academy-wave-vitest', 'server'),
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
    testTimeout: 120_000,
    hookTimeout: 180_000,
    fileParallelism: false,
  },
});

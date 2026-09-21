import {tmpdir} from 'node:os';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  cacheDir: path.join(tmpdir(), 'academy-wave-vitest', 'web'),
  test: {
    include: ['test/**/*.test.tsx', 'test/**/*.test.ts'],
    environment: 'node',
  },
});

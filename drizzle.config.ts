import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'drizzle-kit';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  dialect: 'postgresql',
  schema: path.join(root, 'apps/server/src/db/schema.ts'),
  out: path.join(root, 'apps/server/drizzle'),
  casing: 'snake_case',
});

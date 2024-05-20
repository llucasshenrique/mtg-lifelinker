import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'd1',
  schema: './src/schemas/*.schema.ts',
  out: './migrations',
  dbCredentials: {
    wranglerConfigPath: './wrangler.toml',
    dbName: '',
  },
});

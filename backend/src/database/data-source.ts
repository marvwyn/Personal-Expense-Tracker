import 'dotenv/config';
import { DataSource } from 'typeorm';
import { buildDataSourceOptions } from './typeorm.config';

// Standalone DataSource used only by the TypeORM CLI (migration:generate/run/revert).
// Uses the same buildDataSourceOptions() factory as database.module.ts.
export default new DataSource(
  buildDataSourceOptions(process.env.DATABASE_URL as string),
);

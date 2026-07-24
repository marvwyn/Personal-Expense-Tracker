import { DataSourceOptions } from 'typeorm';

// Single source of truth for connection options, consumed by both
// database.module.ts (the running app) and data-source.ts (the migration CLI).
// Keeping one factory means the two can never drift out of sync.
export function buildDataSourceOptions(databaseUrl: string): DataSourceOptions {
  return {
    type: 'postgres',
    url: databaseUrl,
    ssl: { rejectUnauthorized: false },
    synchronize: false,
    entities: [__dirname + '/../modules/**/*.orm-entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
  };
}

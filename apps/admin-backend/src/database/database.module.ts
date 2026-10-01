import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const dbProvider = {
  provide: 'DB',
  useFactory: () => {
    // Connect to the SQLite database
    const sqlite = new Database('./dev.db');
    return drizzle(sqlite, { schema });
  },
};

@Global()
@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}

import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config';

const dbProvider = {
  provide: 'DB',
  useFactory: (configService: ConfigService) => {
    // Connect to the SQLite database
    const dbUrl = configService.get<string>('DATABASE_URL') || './dev.db';
    const sqlite = new Database(dbUrl);
    return drizzle(sqlite, { schema });
  },
  inject: [ConfigService],
};

@Global()
@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}

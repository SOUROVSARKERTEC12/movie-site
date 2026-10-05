import { Module, Global, OnApplicationBootstrap } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config';
import { seedDatabase } from './seed';

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
export class DatabaseModule implements OnApplicationBootstrap {
  constructor(private readonly configService: ConfigService) {}

  async onApplicationBootstrap() {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const dbUrl = this.configService.get<string>('DATABASE_URL') || './dev.db';

    // Auto-seed in non-test mode if not in-memory
    if (nodeEnv !== 'test' && dbUrl !== ':memory:') {
      await seedDatabase(dbUrl);
    }
  }
}

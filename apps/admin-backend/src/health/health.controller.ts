import { Controller, Get, Inject } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator, DiskHealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { sql } from 'drizzle-orm';
import * as schema from '../database/schema';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    @Inject('DB') private db: BetterSQLite3Database<typeof schema>
  ) {}

  // Custom DB Health check for Drizzle
  async checkDatabase(): Promise<HealthIndicatorResult> {
    try {
      await this.db.run(sql`SELECT 1`);
      return { database: { status: 'up' } };
    } catch (error) {
      return { database: { status: 'down', message: (error as Error).message } };
    }
  }

  @Get('liveness')
  @HealthCheck()
  checkLiveness() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB threshold
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }

  @Get('readiness')
  @HealthCheck()
  checkReadiness() {
    return this.health.check([
      () => this.checkDatabase(),
      () => this.disk.checkStorage('storage', { path: process.cwd(), thresholdPercent: 0.95 }),
    ]);
  }
}

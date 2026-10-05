import { Injectable, Inject } from '@nestjs/common';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '../database/schema';

@Injectable()
export class LogsRepository {
  constructor(@Inject('DB') private db: BetterSQLite3Database<typeof schema>) {}

  async findAllAuditLogs() {
    return this.db.select().from(schema.auditLogs).all();
  }

  async resetAuditLogs() {
    return this.db.delete(schema.auditLogs).run();
  }

  async findAllUserActivities() {
    return this.db.select().from(schema.userActivities).all();
  }

  async resetUserActivities() {
    return this.db.delete(schema.userActivities).run();
  }
}

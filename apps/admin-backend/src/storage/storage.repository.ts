import { Injectable, Inject } from '@nestjs/common';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import * as schema from '../database/schema';
import { CreateStoragePathDto, UpdateStoragePathDto } from './dto/storage.dto';

@Injectable()
export class StorageRepository {
  constructor(@Inject('DB') private db: BetterSQLite3Database<typeof schema>) {}

  async create(data: CreateStoragePathDto) {
    const [path] = await this.db.insert(schema.storagePaths).values(data).returning();
    return path;
  }

  async findAll() {
    return this.db.select().from(schema.storagePaths).all();
  }

  async findOne(id: string) {
    return this.db.select().from(schema.storagePaths).where(eq(schema.storagePaths.id, id)).get();
  }

  async update(id: string, data: UpdateStoragePathDto) {
    const [path] = await this.db
      .update(schema.storagePaths)
      .set(data)
      .where(eq(schema.storagePaths.id, id))
      .returning();
    return path;
  }

  async delete(id: string) {
    const [path] = await this.db
      .delete(schema.storagePaths)
      .where(eq(schema.storagePaths.id, id))
      .returning();
    return path;
  }
}

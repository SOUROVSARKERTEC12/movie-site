import { Injectable, Inject } from '@nestjs/common';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import * as schema from '../database/schema';
import { CreateAdminDto, UpdateAdminDto } from './dto/admin.dto';

@Injectable()
export class AdminsRepository {
  constructor(@Inject('DB') private db: BetterSQLite3Database<typeof schema>) {}

  async create(adminData: CreateAdminDto): Promise<schema.Admin> {
    const result = await this.db.insert(schema.admins).values({
      email: adminData.email,
      name: adminData.name,
      passwordHash: adminData.password || '', // mock fallback
    }).returning();
    return result[0];
  }

  async findAll(): Promise<schema.Admin[]> {
    return this.db.select().from(schema.admins);
  }

  async findOneByEmail(email: string): Promise<schema.Admin | undefined> {
    const [admin] = await this.db.select().from(schema.admins).where(eq(schema.admins.email, email)).limit(1);
    return admin;
  }

  async findOne(id: string): Promise<schema.Admin | undefined> {
    const [admin] = await this.db.select().from(schema.admins).where(eq(schema.admins.id, id)).limit(1);
    return admin;
  }

  async update(id: string, updateData: UpdateAdminDto): Promise<schema.Admin | undefined> {
    const result = await this.db.update(schema.admins)
      .set(updateData)
      .where(eq(schema.admins.id, id))
      .returning();
    return result[0];
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.db.delete(schema.admins).where(eq(schema.admins.id, id)).returning();
    return result.length > 0;
  }
}

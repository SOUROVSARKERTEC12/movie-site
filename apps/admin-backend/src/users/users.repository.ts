import { Injectable, Inject } from '@nestjs/common';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import * as schema from '../database/schema';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersRepository {
  constructor(@Inject('DB') private db: BetterSQLite3Database<typeof schema>) {}

  async create(userData: CreateUserDto): Promise<schema.User> {
    const result = await this.db.insert(schema.users).values({
      email: userData.email,
      name: userData.name,
    }).returning();
    return result[0];
  }

  async findAll(): Promise<schema.User[]> {
    return this.db.select().from(schema.users);
  }

  async findOne(id: string): Promise<schema.User | undefined> {
    const [user] = await this.db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return user;
  }

  async update(id: string, updateData: UpdateUserDto): Promise<schema.User | undefined> {
    const result = await this.db.update(schema.users)
      .set(updateData)
      .where(eq(schema.users.id, id))
      .returning();
    return result[0];
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.db.delete(schema.users).where(eq(schema.users.id, id)).returning();
    return result.length > 0;
  }
}

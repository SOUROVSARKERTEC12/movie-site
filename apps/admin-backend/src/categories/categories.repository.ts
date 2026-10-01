import { Injectable, Inject } from '@nestjs/common';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import * as schema from '../database/schema';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesRepository {
  constructor(@Inject('DB') private db: BetterSQLite3Database<typeof schema>) {}

  async create(categoryData: CreateCategoryDto): Promise<schema.Category> {
    const result = await this.db.insert(schema.categories).values({
      name: categoryData.name,
      slug: categoryData.slug,
    }).returning();
    return result[0];
  }

  async findAll(): Promise<schema.Category[]> {
    return this.db.select().from(schema.categories);
  }

  async findOne(id: string): Promise<schema.Category | undefined> {
    const [category] = await this.db.select().from(schema.categories).where(eq(schema.categories.id, id)).limit(1);
    return category;
  }

  async update(id: string, updateData: UpdateCategoryDto): Promise<schema.Category | undefined> {
    const result = await this.db.update(schema.categories)
      .set(updateData)
      .where(eq(schema.categories.id, id))
      .returning();
    return result[0];
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.db.delete(schema.categories).where(eq(schema.categories.id, id)).returning();
    return result.length > 0;
  }
}

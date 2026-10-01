import { Injectable, Inject } from '@nestjs/common';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import * as schema from '../database/schema';
import { CreateMovieDto, UpdateMovieDto } from './dto/movie.dto';

@Injectable()
export class MoviesRepository {
  constructor(@Inject('DB') private db: BetterSQLite3Database<typeof schema>) {}

  async create(data: CreateMovieDto) {
    const [movie] = await this.db.insert(schema.movies).values(data).returning();
    return movie;
  }

  async findAll() {
    return this.db.select().from(schema.movies).all();
  }

  async findOne(id: string) {
    return this.db.select().from(schema.movies).where(eq(schema.movies.id, id)).get();
  }

  async update(id: string, data: UpdateMovieDto) {
    const [movie] = await this.db
      .update(schema.movies)
      .set(data)
      .where(eq(schema.movies.id, id))
      .returning();
    return movie;
  }

  async delete(id: string) {
    const [movie] = await this.db
      .delete(schema.movies)
      .where(eq(schema.movies.id, id))
      .returning();
    return movie;
  }
}

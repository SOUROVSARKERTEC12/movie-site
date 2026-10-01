import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createMovieSchema = z.object({
  title: z.string().min(1),
  originalTitle: z.string().optional(),
  description: z.string().min(1),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  releaseYear: z.number().int().min(1800),
  rating: z.number().min(0).max(10),
  duration: z.string().min(1),
  language: z.string().min(1),
  quality: z.string().min(1),
  poster: z.string().optional(),
  backdrop: z.string().optional(),
  videoUrl: z.string().optional(),
  trailerUrl: z.string().optional(),
  trailerYoutubeId: z.string().optional(),
  director: z.string().min(1),
  status: z.enum(['Published', 'Draft', 'Featured', 'Archived']).optional(),
});

export class CreateMovieDto extends createZodDto(createMovieSchema) {}

export const updateMovieSchema = createMovieSchema.partial();
export class UpdateMovieDto extends createZodDto(updateMovieSchema) {}

export const movieResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  originalTitle: z.string().nullable().optional(),
  description: z.string(),
  category: z.string(),
  subcategory: z.string().nullable().optional(),
  releaseYear: z.number(),
  rating: z.number(),
  duration: z.string(),
  language: z.string(),
  quality: z.string(),
  poster: z.string().nullable().optional(),
  backdrop: z.string().nullable().optional(),
  videoUrl: z.string().nullable().optional(),
  trailerUrl: z.string().nullable().optional(),
  trailerYoutubeId: z.string().nullable().optional(),
  director: z.string(),
  status: z.string().nullable().optional(),
  createdAt: z.date().nullable().optional(),
});

export type MovieResponseDto = z.infer<typeof movieResponseSchema>;

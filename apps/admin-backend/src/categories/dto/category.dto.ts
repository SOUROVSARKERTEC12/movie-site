import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
});

export class CreateCategoryDto extends createZodDto(createCategorySchema) {}

export const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  isCustom: z.boolean().optional(),
});
export class UpdateCategoryDto extends createZodDto(updateCategorySchema) {}

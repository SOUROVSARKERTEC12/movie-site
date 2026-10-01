import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createStoragePathSchema = z.object({
  name: z.string().min(1),
  path: z.string().min(1),
  maxLimitGb: z.number().positive(),
});

export class CreateStoragePathDto extends createZodDto(createStoragePathSchema) {}

export const updateStoragePathSchema = createStoragePathSchema.partial();
export class UpdateStoragePathDto extends createZodDto(updateStoragePathSchema) {}

export const storagePathResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  path: z.string(),
  maxLimitGb: z.number(),
  usedGb: z.number().nullable().optional(),
});

export type StoragePathResponseDto = z.infer<typeof storagePathResponseSchema>;

export const storageMetricsResponseSchema = z.object({
  totalMaxLimitGb: z.number(),
  totalUsedGb: z.number(),
  totalFreeGb: z.number(),
});

export type StorageMetricsResponseDto = z.infer<typeof storageMetricsResponseSchema>;

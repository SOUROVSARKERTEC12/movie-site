import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createAdminSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6).optional(),
});

export class CreateAdminDto extends createZodDto(createAdminSchema) {}

export const updateAdminSchema = createAdminSchema.partial();
export class UpdateAdminDto extends createZodDto(updateAdminSchema) {}

export const adminResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date().nullable().optional(),
});

export type AdminResponseDto = z.infer<typeof adminResponseSchema>;

import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export class CreateUserDto extends createZodDto(createUserSchema) {}

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  role: z.string().optional(),
  status: z.string().optional(),
});
export class UpdateUserDto extends createZodDto(updateUserSchema) {}

export const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
  status: z.string(),
  totalWatchTimeHours: z.number().nullable().optional(),
  moviesWatchedCount: z.number().nullable().optional(),
  createdAt: z.date().nullable().optional(),
});

export type UserResponseDto = z.infer<typeof userResponseSchema>;

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

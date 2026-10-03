import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  SWAGGER_SERVER_URLS: z.string().default('http://localhost:3000').transform((val) => val.split(',').map((url) => url.trim())),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(10), // Ensure secret is reasonably long
  JWT_EXPIRES_IN: z.coerce.number().default(3600),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);
  
  if (!result.success) {
    console.error('❌ Invalid environment configuration:', result.error.format());
    throw new Error('Invalid environment variables');
  }

  return result.data;
}

import { z } from 'zod';

export const auditLogResponseSchema = z.object({
  id: z.string(),
  actor: z.string(),
  actorRole: z.string(),
  action: z.string(),
  resource: z.string(),
  ipAddress: z.string(),
  result: z.string(),
  details: z.string(),
  createdAt: z.date().nullable().optional(),
});

export type AuditLogResponseDto = z.infer<typeof auditLogResponseSchema>;

export const userActivityResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userName: z.string(),
  eventType: z.string(),
  contentTitle: z.string().nullable().optional(),
  contentId: z.string().nullable().optional(),
  device: z.string().nullable().optional(),
  browser: z.string().nullable().optional(),
  os: z.string().nullable().optional(),
  ipAddress: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  sessionId: z.string().nullable().optional(),
  createdAt: z.date().nullable().optional(),
});

export type UserActivityResponseDto = z.infer<typeof userActivityResponseSchema>;

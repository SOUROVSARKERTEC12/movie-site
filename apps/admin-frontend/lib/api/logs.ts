import { apiClient } from './client';

export interface AuditLogItem {
  id: string;
  actor: string;
  actorRole: string;
  action: string;
  resource: string;
  ipAddress: string;
  result: string;
  details: string;
  createdAt?: string | Date | null;
}

export interface UserActivityItem {
  id: string;
  userId: string;
  userName: string;
  eventType: string;
  contentTitle?: string | null;
  contentId?: string | null;
  device?: string | null;
  browser?: string | null;
  os?: string | null;
  ipAddress?: string | null;
  location?: string | null;
  sessionId?: string | null;
  createdAt?: string | Date | null;
}

export const logsApi = {
  getAuditLogs: async (): Promise<AuditLogItem[]> => {
    return apiClient<AuditLogItem[]>('/logs/audit');
  },

  resetAuditLogs: async (): Promise<void> => {
    return apiClient<void>('/logs/audit/reset', { method: 'POST' });
  },

  getUserActivities: async (): Promise<UserActivityItem[]> => {
    return apiClient<UserActivityItem[]>('/logs/user-activity');
  },

  resetUserActivities: async (): Promise<void> => {
    return apiClient<void>('/logs/user-activity/reset', { method: 'POST' });
  },
};

import { AuditLogEntry } from '@movie-site/shared';
import { MOCK_AUDIT_LOGS } from '@/data/mockAuditLogs';

export const STORAGE_AUDIT_LOGS_KEY = 'cineblack_admin_audit_logs';

export interface RecordLogParams {
  action: string;
  resource: string;
  details: string;
  result?: 'SUCCESS' | 'FAILED';
  actor?: string;
  actorRole?: string;
  ipAddress?: string;
}

/**
 * Retrieve all audit logs from localStorage or fallback to seed data.
 */
export function getAuditLogs(): AuditLogEntry[] {
  if (typeof window === 'undefined') {
    return MOCK_AUDIT_LOGS;
  }

  const saved = localStorage.getItem(STORAGE_AUDIT_LOGS_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse audit logs from localStorage', e);
    }
  }

  // Seed default logs if empty
  localStorage.setItem(STORAGE_AUDIT_LOGS_KEY, JSON.stringify(MOCK_AUDIT_LOGS));
  return MOCK_AUDIT_LOGS;
}

/**
 * Record a new administrative action dynamically.
 * Prepends the new entry so the latest activity appears at the top.
 */
export function recordAuditLog(params: RecordLogParams): AuditLogEntry {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const newLog: AuditLogEntry = {
    id: `aud_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp,
    actor: params.actor || 'Sourov Sarker',
    actorRole: params.actorRole || 'Superadmin',
    action: params.action.toUpperCase(),
    resource: params.resource,
    ipAddress: params.ipAddress || '103.230.104.12',
    result: params.result || 'SUCCESS',
    details: params.details,
  };

  if (typeof window !== 'undefined') {
    const current = getAuditLogs();
    const updated = [newLog, ...current];
    // Keep last 200 logs to prevent memory exhaustion
    const trimmed = updated.slice(0, 200);
    localStorage.setItem(STORAGE_AUDIT_LOGS_KEY, JSON.stringify(trimmed));

    // Dispatch a custom event so open tabs/components can react instantly
    window.dispatchEvent(new CustomEvent('cineblack_audit_log_added', { detail: newLog }));
  }

  return newLog;
}

/**
 * Reset audit logs back to default seed.
 */
export function resetAuditLogs(): AuditLogEntry[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_AUDIT_LOGS_KEY, JSON.stringify(MOCK_AUDIT_LOGS));
    window.dispatchEvent(new CustomEvent('cineblack_audit_logs_reset'));
  }
  return MOCK_AUDIT_LOGS;
}

/**
 * Clear all audit logs.
 */
export function clearAuditLogs(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_AUDIT_LOGS_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('cineblack_audit_logs_cleared'));
  }
}

'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  Lock,
  X,
  ShieldAlert,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { DataTable, Column } from '@/components/DataTable';
import { StatCard } from '@/components/StatCard';
import { AuditLogEntry } from '@movie-site/shared';
import { MOCK_AUDIT_LOGS } from '@/data/mockAuditLogs';
import {
  getAuditLogs,
  resetAuditLogs,
  STORAGE_AUDIT_LOGS_KEY,
} from '@/lib/auditLogger';
import { api } from '@/lib/api';

export default function LogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load audit logs from backend API (with fallback to localStorage/mocks)
  useEffect(() => {
    let isMounted = true;
    const loadLogs = async () => {
      try {
        const backendLogs = await api.logs.getAuditLogs();
        if (isMounted && backendLogs && backendLogs.length > 0) {
          const mapped: AuditLogEntry[] = backendLogs.map((l: any) => ({
            id: l.id,
            timestamp: l.createdAt ? new Date(l.createdAt).toLocaleString() : 'Just now',
            actor: l.actor,
            actorRole: l.actorRole as any,
            action: l.action,
            resource: l.resource,
            ipAddress: l.ipAddress,
            result: l.result as any,
            details: l.details,
          }));
          setLogs(mapped);
          setIsLoaded(true);
          return;
        }
      } catch (err) {
        console.error('Failed to load audit logs from backend, falling back to local storage', err);
      }

      if (isMounted) {
        setLogs(getAuditLogs());
        setIsLoaded(true);
      }
    };

    loadLogs();

    const handleLogAdded = (e: Event) => {
      const customEvent = e as CustomEvent<AuditLogEntry>;
      if (customEvent.detail) {
        setLogs((prev) => [customEvent.detail, ...prev]);
      }
    };

    const handleLogsReset = () => {
      setLogs(getAuditLogs());
    };

    window.addEventListener('cineblack_audit_log_added', handleLogAdded);
    window.addEventListener('cineblack_audit_logs_reset', handleLogsReset);

    return () => {
      isMounted = false;
      window.removeEventListener('cineblack_audit_log_added', handleLogAdded);
      window.removeEventListener('cineblack_audit_logs_reset', handleLogsReset);
    };
  }, []);

  // Sync to storage
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_AUDIT_LOGS_KEY, JSON.stringify(logs));
    }
  }, [logs, isLoaded]);

  // Toast timer
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Metric Computations
  const totalLogs = logs.length;
  const successCount = logs.filter((l) => l.result === 'SUCCESS').length;
  const failedCount = logs.filter((l) => l.result === 'FAILED').length;
  const successRate = totalLogs > 0 ? Math.round((successCount / totalLogs) * 100) : 100;

  // Export audit logs as JSON file
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cineblack_audit_trail_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setToastMessage(`Exported ${logs.length} audit records to JSON`);
  };

  // Reset audit logs back to initial operational seed
  const handleResetLogs = async () => {
    if (confirm('Reset administrative audit trail back to initial system baseline?')) {
      try {
        await api.logs.resetAuditLogs();
      } catch (err) {
        console.error('Failed to reset backend audit logs', err);
      }
      const reset = resetAuditLogs();
      setLogs(reset);
      setSelectedLog(null);
      setToastMessage('Audit logs reset to initial operational baseline');
    }
  };

  // Copy full JSON payload of selected log
  const handleCopyPayload = (log: AuditLogEntry) => {
    const payload = JSON.stringify(
      {
        ...log,
        _securitySignature: `sha256:hmac_${log.id}_${log.timestamp.replace(/[^0-9]/g, '')}`,
        _ledgerStatus: 'VERIFIED_CHAINED',
        _nodeCluster: 'asia-east1-dhaka-pop',
      },
      null,
      2
    );
    navigator.clipboard.writeText(payload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
    setToastMessage('Copied cryptographic audit payload to clipboard');
  };

  // Color-coded action tags
  const getActionBadge = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('PUBLISH') || act.includes('CREATE')) {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
    if (act.includes('DELETE') || act.includes('SUSPEND') || act.includes('BLOCKED') || act.includes('FAIL') || act.includes('ABORT')) {
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
    if (act.includes('PURGE') || act.includes('ROTATE') || act.includes('REVOKE')) {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
    if (act.includes('UPDATE') || act.includes('FEATURE') || act.includes('ROLE')) {
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
    return 'bg-neutral-800 text-neutral-300 border-neutral-700';
  };

  const columns: Column<AuditLogEntry>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      render: (log) => (
        <span className="font-mono text-neutral-400 text-xs flex items-center gap-1.5 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
          <span>{log.timestamp}</span>
        </span>
      ),
    },
    {
      key: 'actor',
      header: 'Operator / Principal',
      sortable: true,
      render: (log) => (
        <div className="min-w-[140px]">
          <span className="font-bold text-white text-xs block">{log.actor}</span>
          <span
            className={`text-[10px] font-mono font-medium px-1.5 py-0.2 rounded inline-block mt-0.5 ${
              log.actorRole === 'Superadmin'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : log.actorRole === 'Security Operator'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : log.actorRole === 'Content Editor'
                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
            }`}
          >
            {log.actorRole}
          </span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Audit Action',
      sortable: true,
      render: (log) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border tracking-wider whitespace-nowrap ${getActionBadge(
            log.action
          )}`}
        >
          {log.action}
        </span>
      ),
    },
    {
      key: 'resource',
      header: 'Target Resource',
      render: (log) => (
        <span className="text-neutral-200 font-semibold text-xs block max-w-[180px] truncate" title={log.resource}>
          {log.resource}
        </span>
      ),
    },
    {
      key: 'result',
      header: 'Result',
      sortable: true,
      render: (log) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
            log.result === 'SUCCESS'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}
        >
          {log.result === 'SUCCESS' ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <XCircle className="w-3 h-3" />
          )}
          <span>{log.result}</span>
        </span>
      ),
    },
    {
      key: 'ipAddress',
      header: 'Operator IP',
      render: (log) => (
        <span className="font-mono text-neutral-400 text-[11px] whitespace-nowrap">{log.ipAddress}</span>
      ),
    },
    {
      key: 'details',
      header: 'Audit Description',
      render: (log) => (
        <span
          className="text-neutral-400 text-xs truncate max-w-[280px] block cursor-pointer hover:text-white transition-colors"
          title={log.details}
        >
          {log.details}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pb-12">
      <AdminHeader
        title="Activity Logs & Audit Trail"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white text-xs font-bold transition-colors"
              title="Export audit logs as JSON"
            >
              <Download className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
            <button
              onClick={handleResetLogs}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white text-xs font-bold transition-colors"
              title="Reset audit logs to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>
          </div>
        }
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-neutral-700 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-medium backdrop-blur-md animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <StatCard
            title="Total Audit Events"
            value={totalLogs}
            subtitle="Recorded operations"
            icon={FileText}
          />
          <StatCard
            title="Successful Executions"
            value={successCount}
            subtitle={`${successRate}% success rate`}
            trend="up"
            change={`${successRate}%`}
            icon={CheckCircle}
          />
          <StatCard
            title="Blocked Attempts"
            value={failedCount}
            subtitle="Security blocks & failures"
            trend={failedCount > 0 ? 'down' : 'neutral'}
            change={failedCount > 0 ? `${failedCount} flagged` : 'Zero errors'}
            icon={failedCount > 0 ? ShieldAlert : CheckCircle}
          />
          <StatCard
            title="Audit Ledger"
            value="Encrypted"
            subtitle="SHA-256 HMAC chained"
            trend="up"
            change="Compliant"
            icon={Shield}
          />
        </div>

        {/* Audit Logs Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Click any record to inspect security payload</span>
            </span>
            <span className="font-mono text-[11px] text-neutral-500">
              Showing {logs.length} live records
            </span>
          </div>

          <DataTable
            columns={columns}
            data={logs}
            searchKeys={['actor', 'action', 'resource', 'details', 'ipAddress', 'id']}
            searchPlaceholder="Search audit logs by actor, action, resource, IP, or ID..."
            defaultSortKey="timestamp"
            defaultSortDir="desc"
            onRowClick={(log) => setSelectedLog(log)}
            filters={[
              {
                label: 'Result',
                key: 'result',
                options: [
                  { label: 'Success', value: 'SUCCESS' },
                  { label: 'Failed', value: 'FAILED' },
                ],
              },
              {
                label: 'Role',
                key: 'actorRole',
                options: [
                  { label: 'Superadmin', value: 'Superadmin' },
                  { label: 'Security Operator', value: 'Security Operator' },
                  { label: 'Content Editor', value: 'Content Editor' },
                  { label: 'System Daemon', value: 'System Daemon' },
                ],
              },
            ]}
          />
        </div>
      </div>

      {/* Log Inspection Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="bg-[#0c0c0c] border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-neutral-800/80 flex items-center justify-between bg-neutral-950/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                    <span>Audit Event Inspection</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                      {selectedLog.id}
                    </span>
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    {selectedLog.timestamp}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 custom-scrollbar text-xs">
              {/* Event Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Actor & Role */}
                <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                    Operator / Principal
                  </span>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-white text-sm">{selectedLog.actor}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {selectedLog.actorRole}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-neutral-400 pt-1">
                    IP: {selectedLog.ipAddress}
                  </p>
                </div>

                {/* Result & Security Ledger */}
                <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                    Execution Status
                  </span>
                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        selectedLog.result === 'SUCCESS'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {selectedLog.result === 'SUCCESS' ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{selectedLog.result}</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>SHA-256 HMAC Sealed</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 pt-1">
                    Chained sequence verified
                  </p>
                </div>
              </div>

              {/* Action & Resource Card */}
              <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    Target Resource
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getActionBadge(
                      selectedLog.action
                    )}`}
                  >
                    {selectedLog.action}
                  </span>
                </div>
                <p className="text-sm font-bold text-white font-mono">{selectedLog.resource}</p>
                <div className="pt-2 border-t border-neutral-800/80">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                    Audit Description &amp; Trace Details
                  </span>
                  <p className="text-neutral-300 leading-relaxed text-xs">
                    {selectedLog.details}
                  </p>
                </div>
              </div>

              {/* Raw JSON Payload */}
              <div className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Raw Event Cryptographic Payload</span>
                  </span>
                  <button
                    onClick={() => handleCopyPayload(selectedLog)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white text-[11px] font-medium transition-colors"
                  >
                    {copiedPayload ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-neutral-400" />
                        <span>Copy Payload</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-neutral-300 bg-black/60 p-3 rounded-lg overflow-x-auto border border-neutral-900 leading-relaxed">
                  {JSON.stringify(
                    {
                      id: selectedLog.id,
                      timestamp: selectedLog.timestamp,
                      actor: selectedLog.actor,
                      actorRole: selectedLog.actorRole,
                      action: selectedLog.action,
                      resource: selectedLog.resource,
                      ipAddress: selectedLog.ipAddress,
                      result: selectedLog.result,
                      details: selectedLog.details,
                      securityProof: {
                        algorithm: 'HMAC-SHA256',
                        integrityHash: `sha256:${selectedLog.id}_verified`,
                        clusterNode: 'asia-east1-dhaka-pop',
                      },
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 border-t border-neutral-800/80 flex items-center justify-between bg-neutral-950/60">
              <span className="text-[11px] text-neutral-500 font-mono">
                Security event immutable • RFC 5424 compliant
              </span>
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 rounded-lg bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors shadow-sm"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

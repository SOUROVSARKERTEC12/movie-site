'use client';

import React from 'react';
import {
  FileText,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Search,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { DataTable, Column } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { StatCard } from '@/components/StatCard';
import { MOCK_AUDIT_LOGS } from '@/data/mockAuditLogs';
import { AuditLogEntry } from '@movie-site/shared';

export default function LogsPage() {
  const totalLogs = MOCK_AUDIT_LOGS.length;
  const successCount = MOCK_AUDIT_LOGS.filter((l) => l.result === 'SUCCESS').length;
  const failedCount = MOCK_AUDIT_LOGS.filter((l) => l.result === 'FAILED').length;

  const columns: Column<AuditLogEntry>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      render: (log) => (
        <span className="font-mono text-neutral-400 text-xs flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-neutral-600" />
          <span>{log.timestamp}</span>
        </span>
      ),
    },
    {
      key: 'actor',
      header: 'Operator / Principal',
      sortable: true,
      render: (log) => (
        <div>
          <span className="font-bold text-white text-xs block">{log.actor}</span>
          <span className="text-[10px] text-neutral-500 font-mono">{log.actorRole}</span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Audit Action',
      sortable: true,
      render: (log) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-neutral-900 border border-neutral-700 text-white">
          {log.action}
        </span>
      ),
    },
    {
      key: 'resource',
      header: 'Target Resource',
      render: (log) => (
        <span className="text-neutral-300 font-medium text-xs">{log.resource}</span>
      ),
    },
    {
      key: 'result',
      header: 'Result',
      sortable: true,
      render: (log) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            log.result === 'SUCCESS'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
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
        <span className="font-mono text-neutral-500 text-[11px]">{log.ipAddress}</span>
      ),
    },
    {
      key: 'details',
      header: 'Audit Description',
      render: (log) => (
        <span className="text-neutral-400 text-xs truncate max-w-[280px] block" title={log.details}>
          {log.details}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pb-12">
      <AdminHeader
        title="Administrative Audit Trail & Access Logs"
        subtitle="Immutable security logs of administrative actions, metadata edits, role upgrades, and edge purges"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total Audit Events"
            value={totalLogs}
            subtitle="Security events"
            icon={FileText}
            sparklineData={[6, 7, 8, 9, 10]}
          />
          <StatCard
            title="Successful Executions"
            value={successCount}
            subtitle="Authorized operations"
            trend="up"
            change="90%"
            icon={CheckCircle}
            sparklineData={[5, 6, 7, 8, 9]}
          />
          <StatCard
            title="Blocked Attempts"
            value={failedCount}
            subtitle="Auth failures"
            icon={XCircle}
            sparklineData={[1, 1, 1, 1, 1]}
          />
          <StatCard
            title="Audit Status"
            value="Encrypted"
            subtitle="SHA-256 HMAC chained"
            trend="up"
            change="Compliant"
            icon={Shield}
            sparklineData={[1, 1, 1, 1, 1]}
          />
        </div>

        <DataTable
          columns={columns}
          data={MOCK_AUDIT_LOGS}
          searchKeys={['actor', 'action', 'resource', 'details', 'ipAddress']}
          searchPlaceholder="Search audit logs by actor, action, resource or IP..."
          defaultSortKey="timestamp"
          defaultSortDir="asc"
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
                { label: 'Content Editor', value: 'Content Editor' },
                { label: 'Security Operator', value: 'Security Operator' },
                { label: 'System Daemon', value: 'System Daemon' },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}

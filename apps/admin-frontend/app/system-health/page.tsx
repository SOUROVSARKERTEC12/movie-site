'use client';

import React from 'react';
import {
  Server,
  Cpu,
  Database,
  HardDrive,
  Activity,
  Radio,
  AlertTriangle,
  CheckCircle,
  Wifi,
  Layers,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { GaugeChart } from '@/components/charts/GaugeChart';
import { MOCK_SYSTEM_HEALTH, MOCK_SYSTEM_LOGS } from '@/data/mockSystem';

export default function SystemHealthPage() {
  const sys = MOCK_SYSTEM_HEALTH;

  return (
    <div className="min-h-screen bg-[#050505] pb-12">
      <AdminHeader
        title="System Telemetry & Infrastructure Health"
        subtitle="Real-time operational status across streaming gateways, database clusters, Redis caches, and background transcoders"
        actions={
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400">All Clusters Operational (99.98%)</span>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Row 1: Key Latency & Resource Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="API Latency (P50)"
            value={`${sys.apiLatencyP50Ms} ms`}
            subtitle={`P95: ${sys.apiLatencyP95Ms}ms • P99: ${sys.apiLatencyP99Ms}ms`}
            trend="up"
            change="Sub-20ms"
            icon={Clock}
            sparklineData={[22, 20, 19, 18, 18]}
          />
          <StatCard
            title="Requests (24h)"
            value={`${(sys.apiRequestCount24h / 1000000).toFixed(1)}M`}
            subtitle="Edge & origin ingress"
            icon={Activity}
            sparklineData={[11, 12, 13, 13.8, 14.2]}
          />
          <StatCard
            title="Error Rate"
            value={`${sys.errorRatePct}%`}
            subtitle="HTTP 5xx rate"
            trend="up"
            change="Zero critical"
            icon={CheckCircle}
            sparklineData={[0.04, 0.03, 0.02, 0.02, 0.018]}
          />
          <StatCard
            title="WebSockets Live"
            value={sys.activeWebsocketConnections.toLocaleString()}
            subtitle="Real-time telemetry peers"
            trend="up"
            change="Connected"
            icon={Radio}
            sparklineData={[3800, 3950, 4020, 4080, 4120]}
          />
        </div>

        {/* Row 2: Infrastructure Components Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>PostgreSQL Primary</span>
                </span>
                <StatusBadge status={sys.dbStatus} />
              </div>
              <p className="text-[11px] text-neutral-400 mt-2">Active connections: 34/100</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-black text-white font-mono">{sys.dbResponseTimeMs}</span>
                <span className="text-xs text-neutral-500 font-bold">ms ping</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-neutral-900 text-[10px] text-neutral-500">
              Replica lag: 0.0ms • SSL Enabled
            </div>
          </div>

          <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span>Redis Cache Cluster</span>
                </span>
                <StatusBadge status={sys.cacheStatus} />
              </div>
              <p className="text-[11px] text-neutral-400 mt-2">RAM: {sys.redisMemoryUsedMb}MB / {sys.redisMemoryTotalMb}MB</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-black text-emerald-400 font-mono">{sys.redisHitRatePct}%</span>
                <span className="text-xs text-neutral-500 font-bold">hit ratio</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-neutral-900 text-[10px] text-neutral-500">
              Keys: 142,890 • Evictions: 0
            </div>
          </div>

          <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-emerald-400" />
                  <span>Object Storage (Media)</span>
                </span>
                <StatusBadge status="Healthy" />
              </div>
              <p className="text-[11px] text-neutral-400 mt-2">HLS manifests &amp; video chunks</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-black text-white font-mono">{sys.storageUsedTb}</span>
                <span className="text-xs text-neutral-500 font-bold">/ {sys.storageTotalTb} TB</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-neutral-900 text-[10px] text-neutral-500">
              29.6% utilized • S3 compliant
            </div>
          </div>

          <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>Video Transcoder Queue</span>
                </span>
                <StatusBadge status="Processing" variant="info" />
              </div>
              <p className="text-[11px] text-neutral-400 mt-2">Active ffmpeg worker jobs</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-black text-white font-mono">{sys.activeBackgroundTranscodeJobs}</span>
                <span className="text-xs text-neutral-500 font-bold">jobs encoding</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-neutral-900 text-[10px] text-neutral-500">
              0 failed in queue • AV1/HEVC
            </div>
          </div>
        </div>

        {/* Row 3: Gauges (CPU & Memory) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-around gap-6 select-none">
            <GaugeChart
              value={Math.round(sys.serverCpuPct)}
              title="Kubernetes Worker CPU"
              subtitle="16 Cores Total • 6 Nodes"
              unit="%"
              color="#10b981"
            />
            <div className="space-y-2 text-xs">
              <h5 className="font-bold text-white text-sm">Cluster Compute Status</h5>
              <p className="text-neutral-400 text-xs">Load is evenly distributed across cluster pods with zero thermal throttling or node pressure.</p>
              <div className="pt-2 flex items-center gap-2">
                <StatusBadge status="Normal Load" variant="healthy" />
                <span className="text-neutral-500 font-mono text-[11px]">Load avg: 0.42, 0.38, 0.35</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-around gap-6 select-none">
            <GaugeChart
              value={Math.round(sys.serverMemoryPct)}
              title="RAM Allocation"
              subtitle="64 GB Pooled Memory"
              unit="%"
              color="#10b981"
            />
            <div className="space-y-2 text-xs">
              <h5 className="font-bold text-white text-sm">Memory &amp; Buffer Pool</h5>
              <p className="text-neutral-400 text-xs">High-speed resident media cache buffers frequently requested HLS video fragments in RAM for instantaneous delivery.</p>
              <div className="pt-2 flex items-center gap-2">
                <StatusBadge status="Optimal Cache" variant="healthy" />
                <span className="text-neutral-500 font-mono text-[11px]">39.5 GB Active Resident</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Recent Infrastructure Events Log */}
        <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 sm:p-5 select-none">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Recent Infrastructure Alerts &amp; Events</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Automated telemetry events from edge proxies, transcoders, and databases</p>
            </div>
            <span className="text-xs text-neutral-500 font-mono">Last updated: Just now</span>
          </div>

          <div className="divide-y divide-neutral-900">
            {MOCK_SYSTEM_LOGS.map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-start gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      log.severity === 'ERROR'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : log.severity === 'WARNING'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {log.severity}
                  </span>
                  <div>
                    <span className="font-bold text-white mr-2">{log.component}:</span>
                    <span className="text-neutral-300">{log.message}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:flex-shrink-0 text-neutral-500 font-mono text-[11px]">
                  <span>{log.timestamp}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Auto-Resolved</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

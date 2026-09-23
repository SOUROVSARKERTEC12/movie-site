'use client';

import React from 'react';
import {
  Cpu,
  Wifi,
  Activity,
  AlertTriangle,
  CheckCircle,
  Zap,
  Radio,
  Clock,
  Server,
  Globe,
  Gauge,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { AreaChart } from '@/components/charts/AreaChart';
import { GaugeChart } from '@/components/charts/GaugeChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { MOCK_TELEMETRY_SUMMARY, HOURLY_TELEMETRY_SERIES } from '@/data/mockTelemetry';

export default function TelemetryPage() {
  const telemetry = MOCK_TELEMETRY_SUMMARY;

  // Chart data: bitrate vs rebuffering rate
  const bitrateTrend = HOURLY_TELEMETRY_SERIES.map((pt) => ({
    label: pt.time,
    value: Math.round(pt.avgBitrateMbps * 10),
    secondaryValue: Math.round(pt.startupTimeMs / 10),
  }));

  const qualityData = telemetry.qualityBreakdown.map((q, i) => ({
    label: q.quality.split(' ')[0],
    value: q.percentage,
    color: ['#ffffff', '#3b82f6', '#10b981', '#f59e0b'][i % 4],
  }));

  return (
    <div className="min-h-screen bg-[#050505] pb-12">
      <AdminHeader
        title="Streaming Telemetry & Video Infrastructure"
        subtitle="Real-time player telemetry, HLS adaptive bitrates, buffer health, CDN edge metrics, and error rates"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Row 1: KPI Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Active Sessions"
            value={telemetry.activeStreamingSessions.toLocaleString()}
            subtitle={`Peak: ${telemetry.concurrentViewersPeak.toLocaleString()}`}
            trend="up"
            change="Normal load"
            icon={Radio}
            sparklineData={[3400, 3550, 3700, 3810, 3842]}
          />
          <StatCard
            title="Avg Startup Time"
            value={`${telemetry.avgStartupTimeMs} ms`}
            subtitle="Time-to-first-frame"
            trend="up"
            change="Fast TTFB"
            icon={Clock}
            sparklineData={[440, 430, 425, 418, 412]}
          />
          <StatCard
            title="Rebuffering Rate"
            value={`${telemetry.rebufferingRatePct}%`}
            subtitle="Target: <0.5%"
            trend="up"
            change="Optimal"
            icon={Activity}
            sparklineData={[0.35, 0.32, 0.30, 0.29, 0.28]}
          />
          <StatCard
            title="Playback Failures"
            value={`${telemetry.playbackFailuresToday} / ${(telemetry.playbackStartsToday / 1000).toFixed(0)}k`}
            subtitle="0.14% error rate"
            trend="up"
            change="Healthy"
            icon={CheckCircle}
            sparklineData={[120, 110, 105, 98, 94]}
          />
        </div>

        {/* Row 2: Visual Gauges & Bitrate / TTFB Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <AreaChart
              data={bitrateTrend}
              title="Adaptive Bitrate (x10) vs TTFB (x10) (24h Trend)"
              subtitle="Solid white: Average Bitrate (Mbps × 10) • Dashed blue: Startup latency (ms ÷ 10)"
              valuePrefix=""
              valueSuffix=""
              color="#ffffff"
              secondaryColor="#3b82f6"
              height={260}
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            <GaugeChart
              value={96}
              title="Global Cache Hit Ratio"
              subtitle="CDN Edge Offload (Target: >90%)"
              unit="%"
              color="#10b981"
            />
            <GaugeChart
              value={82}
              title="Buffer Health Index"
              subtitle="24.2s ahead of playhead"
              unit="pts"
              color="#10b981"
            />
          </div>
        </div>

        {/* Row 3: CDN POP Regions Performance Matrix */}
        <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 sm:p-5 select-none">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Global CDN Edge POP Performance</span>
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">Origin shield cache hit ratio, round-trip latency, and active stream distribution</p>
            </div>
            <StatusBadge status="All POPs Healthy" variant="healthy" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase font-semibold text-[11px] bg-neutral-900/40">
                  <th className="py-3 px-4">CDN Edge Region</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Cache Hit Ratio</th>
                  <th className="py-3 px-4">Latency (p50)</th>
                  <th className="py-3 px-4">Active Streams</th>
                  <th className="py-3 px-4">Bandwidth Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {telemetry.cdnRegions.map((cdn, idx) => (
                  <tr key={idx} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <Server className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{cdn.region}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={cdn.status} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${cdn.cacheHitRatioPct}%` }} />
                        </div>
                        <span className="font-mono text-emerald-400 font-bold">{cdn.cacheHitRatioPct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">{cdn.latencyMs} ms</td>
                    <td className="py-3 px-4 font-mono text-neutral-300">{cdn.activeSessions.toLocaleString()} sessions</td>
                    <td className="py-3 px-4 font-mono text-neutral-400">
                      {Math.round((cdn.activeSessions / telemetry.activeStreamingSessions) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  Eye,
  Clock,
  Film,
  Radio,
  Server,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Layers,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { AreaChart } from '@/components/charts/AreaChart';
import { BarChart } from '@/components/charts/BarChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { MOCK_MOVIES } from '@/data/mockMovies';
import { MOCK_ACTIVITIES } from '@/data/mockActivities';
import { MOCK_TELEMETRY_SUMMARY, HOURLY_TELEMETRY_SERIES } from '@/data/mockTelemetry';

export default function DashboardPage() {
  const topMovies = [...MOCK_MOVIES].sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0)).slice(0, 5);
  const recentActivities = MOCK_ACTIVITIES.slice(0, 7);

  // Hourly viewer trend for AreaChart
  const streamTrend = HOURLY_TELEMETRY_SERIES.map((pt) => ({
    label: pt.time,
    value: pt.concurrentViewers,
    secondaryValue: Math.round(pt.concurrentViewers * 0.45),
  }));

  // Daily watch sessions for BarChart
  const weeklySessions = [
    { label: 'Mon', value: 168000 },
    { label: 'Tue', value: 154000 },
    { label: 'Wed', value: 172000 },
    { label: 'Thu', value: 189000 },
    { label: 'Fri', value: 245000 },
    { label: 'Sat', value: 298000 },
    { label: 'Sun', value: 274000 },
  ];

  // Device usage DonutChart
  const deviceData = [
    { label: 'Desktop', value: 46, color: '#ffffff' },
    { label: 'Mobile App', value: 34, color: '#3b82f6' },
    { label: 'Smart TV', value: 14, color: '#10b981' },
    { label: 'Tablet', value: 6, color: '#f59e0b' },
  ];

  // Quality distribution DonutChart
  const qualityData = MOCK_TELEMETRY_SUMMARY.qualityBreakdown.map((q, i) => ({
    label: q.quality.split(' ')[0],
    value: q.percentage,
    color: ['#ffffff', '#3b82f6', '#10b981', '#6b7280'][i % 4],
  }));

  return (
    <div className="min-h-screen bg-[#050505] pb-12">
      <AdminHeader
        title="Streaming Operations Dashboard"
        subtitle="Live telemetry, active viewers, infrastructure health, and content engagement"
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/live-sessions"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-lg shadow-red-950/40"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>3,842 Live Sessions</span>
            </Link>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Row 1: Primary Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total Users"
            value="148,290"
            change="+12.4%"
            trend="up"
            subtitle="vs last month"
            icon={Users}
            sparklineData={[120, 126, 131, 134, 140, 144, 148]}
          />
          <StatCard
            title="Active Viewers"
            value="42,810"
            change="+8.1%"
            trend="up"
            subtitle="Today's unique"
            icon={Eye}
            sparklineData={[32, 35, 34, 38, 40, 39, 42]}
          />
          <StatCard
            title="Total Watch Time"
            value="482.9k hrs"
            change="+15.3%"
            trend="up"
            subtitle="Avg 48.2m / user"
            icon={Clock}
            sparklineData={[380, 400, 425, 440, 460, 475, 482]}
          />
          <StatCard
            title="Catalog Movies"
            value="54"
            change="4 rails"
            trend="neutral"
            subtitle="100% 4K/1080p"
            icon={Film}
            sparklineData={[48, 50, 52, 54, 54, 54, 54]}
          />
        </div>

        {/* Row 2: Secondary Telemetry Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 bg-[#0a0a0a] border border-neutral-800/80 rounded-xl">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Live Bitrate Avg</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black text-white font-mono">9.4</span>
              <span className="text-xs text-neutral-400 font-bold">Mbps</span>
            </div>
            <p className="text-[11px] text-emerald-400 font-medium mt-1">Optimal AV1/H.265</p>
          </div>

          <div className="p-4 bg-[#0a0a0a] border border-neutral-800/80 rounded-xl">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Avg Buffer Ahead</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">24.2</span>
              <span className="text-xs text-neutral-400 font-bold">sec</span>
            </div>
            <p className="text-[11px] text-neutral-500 font-medium mt-1">Threshold: &gt;12s</p>
          </div>

          <div className="p-4 bg-[#0a0a0a] border border-neutral-800/80 rounded-xl">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Startup Latency (TTFB)</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black text-white font-mono">412</span>
              <span className="text-xs text-neutral-400 font-bold">ms</span>
            </div>
            <p className="text-[11px] text-emerald-400 font-medium mt-1">Edge Cache: 96.8%</p>
          </div>

          <div className="p-4 bg-[#0a0a0a] border border-neutral-800/80 rounded-xl">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Playback Errors</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black text-white font-mono">0.14%</span>
              <span className="text-xs text-neutral-400 font-bold">(94/68k)</span>
            </div>
            <p className="text-[11px] text-emerald-400 font-medium mt-1">Within SLA (&lt;0.5%)</p>
          </div>
        </div>

        {/* Row 3: Main Visual Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AreaChart
            data={streamTrend}
            title="Concurrent Viewers (24h Trend)"
            subtitle="Solid line: Total active streams • Dashed line: 4K UHD viewers"
            valuePrefix=""
            valueSuffix=" viewers"
            color="#ffffff"
            secondaryColor="#3b82f6"
            height={260}
          />
          <BarChart
            data={weeklySessions}
            title="Weekly Watch Sessions"
            subtitle="Total stream starts per day across all client platforms"
            valueSuffix=" sessions"
            defaultColor="#ffffff"
            height={260}
          />
        </div>

        {/* Row 4: Donut Distributions & Geographic Snippet */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DonutChart
            data={deviceData}
            title="Device Form Factors"
            subtitle="Share of total streaming hours"
            centerLabel="Devices"
            centerValue="100%"
          />
          <DonutChart
            data={qualityData}
            title="Video Quality Distribution"
            subtitle="Current playback resolution tier"
            centerLabel="Active"
            centerValue="3,842"
          />

          {/* Quick Category Summary */}
          <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 sm:p-5 flex flex-col justify-between select-none">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white tracking-wide">Category Performance</h4>
                <Link href="/categories" className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 font-medium">
                  <span>View All</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">Views &amp; completion breakdown</p>

              <div className="mt-4 space-y-3">
                {[
                  { name: 'Hindi Dubbed', views: '1.54M', completion: '93.5%', color: 'bg-red-500' },
                  { name: 'English (Hollywood)', views: '1.45M', completion: '95.8%', color: 'bg-blue-500' },
                  { name: 'Bangla Cinema', views: '1.14M', completion: '89.9%', color: 'bg-emerald-500' },
                  { name: 'Hindi Originals', views: '994k', completion: '91.8%', color: 'bg-amber-500' },
                ].map((cat, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-neutral-900 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                      <span className="font-semibold text-white">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-neutral-400">
                      <span>{cat.views} views</span>
                      <span className="text-white font-mono font-bold">{cat.completion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-400">
              <span>Overall completion rate:</span>
              <span className="font-bold text-emerald-400 font-mono">88.4%</span>
            </div>
          </div>
        </div>

        {/* Row 5: Top Movies & Real-Time Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Top 5 Movies Table */}
          <div className="lg:col-span-2 bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Most Watched Content Today</span>
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">Top performing movie titles by stream sessions and completion</p>
              </div>
              <Link href="/movies" className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 font-medium">
                <span>All Movies</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-neutral-900 overflow-x-auto">
              {topMovies.map((movie, rank) => (
                <div key={movie.id} className="py-2.5 flex items-center justify-between gap-3 min-w-[480px]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-neutral-600 w-4 text-center">
                      #{rank + 1}
                    </span>
                    <div className="relative w-10 h-14 rounded overflow-hidden bg-neutral-900 flex-shrink-0 border border-neutral-800">
                      <Image
                        src={movie.poster}
                        alt={movie.title}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-xs hover:underline cursor-pointer">
                        {movie.title}
                      </h5>
                      <p className="text-[11px] text-neutral-400">
                        {movie.category} • {movie.releaseYear} • {movie.quality}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <p className="font-bold text-white font-mono">
                        {(movie.totalViews || 0).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-neutral-500 uppercase">Views</p>
                    </div>
                    <div className="text-right w-20">
                      <p className="font-bold text-emerald-400 font-mono">
                        {movie.completionRate}%
                      </p>
                      <p className="text-[10px] text-neutral-500 uppercase">Completion</p>
                    </div>
                    <StatusBadge status={movie.status || 'Published'} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-Time User Activity Ticker */}
          <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Platform Activity</span>
                </h4>
                <Link href="/user-activity" className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 font-medium">
                  <span>Full Stream</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3 mt-3">
                {recentActivities.map((act) => (
                  <div key={act.id} className="flex items-start gap-2.5 text-xs py-1 border-b border-neutral-900 last:border-0">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-neutral-800">
                      <Image
                        src={act.userAvatar}
                        alt={act.userName}
                        fill
                        sizes="24px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-neutral-200 leading-tight truncate">
                        <span className="font-bold text-white">{act.userName}</span>{' '}
                        <span className="text-neutral-400 text-[11px] font-mono lowercase">({act.eventType.replace('_', ' ')})</span>
                      </p>
                      {act.contentTitle && (
                        <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                          🎬 {act.contentTitle}
                        </p>
                      )}
                      <p className="text-[10px] text-neutral-600 mt-0.5">
                        {act.location} • {act.device.split(' ')[0]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-500">
              <span>Streaming server pulse</span>
              <span className="text-emerald-400 font-mono text-[11px]">Heartbeat active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

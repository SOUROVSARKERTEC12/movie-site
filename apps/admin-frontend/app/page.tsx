'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  Eye,
  Clock,
  Film,
  Star,
  ArrowUpRight,
  Activity,
  Server,
  Database,
  HardDrive,
  Cpu,
  Folder,
  Settings,
  AlertTriangle,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { MOCK_MOVIES } from '@/data/mockMovies';
import { MOCK_ACTIVITIES } from '@/data/mockActivities';
import { MOCK_USERS } from '@/data/mockUsers';
import { MOCK_SYSTEM_HEALTH } from '@/data/mockSystem';
import {
  getDiskStoragePaths,
  formatStorageSize,
  getStorageAggregateMetrics,
} from '@/data/mockStorage';
import { DiskStoragePath } from '@movie-site/shared';

export default function DashboardPage() {
  const topMovies = [...MOCK_MOVIES].slice(0, 5);
  const recentActivities = MOCK_ACTIVITIES.slice(0, 7);
  const sys = MOCK_SYSTEM_HEALTH;

  const [totalUserCount, setTotalUserCount] = useState<number>(MOCK_USERS.length);
  const [activeUserCount, setActiveUserCount] = useState<number>(
    MOCK_USERS.filter((u) => u.status === 'Active' || u.status === 'VIP').length
  );
  const [diskPaths, setDiskPaths] = useState<DiskStoragePath[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleStorageUpdate = () => {
        setDiskPaths(getDiskStoragePaths());
      };

      window.addEventListener('cineblack_storage_updated', handleStorageUpdate);
      window.addEventListener('storage', handleStorageUpdate);

      const timer = setTimeout(() => {
        setDiskPaths(getDiskStoragePaths());

        const saved = localStorage.getItem('cineblack_admin_users');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              setTotalUserCount(parsed.length);
              setActiveUserCount(
                parsed.filter((u: { status?: string }) => u.status === 'Active' || u.status === 'VIP').length
              );
            }
          } catch {
            // ignore parse failure
          }
        }
      }, 0);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('cineblack_storage_updated', handleStorageUpdate);
        window.removeEventListener('storage', handleStorageUpdate);
      };
    }
  }, []);

  const storageMetrics = useMemo(() => {
    return getStorageAggregateMetrics(diskPaths);
  }, [diskPaths]);

  return (
    <div className="min-h-screen bg-[#050505] pb-12">
      <AdminHeader
        title="Streaming Operations Dashboard"
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/movies"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white font-bold text-xs transition-colors"
            >
              <Film className="w-3.5 h-3.5 text-neutral-400" />
              <span>{MOCK_MOVIES.length} Catalog Movies</span>
            </Link>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Row 1: Primary Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total Users"
            value={totalUserCount.toLocaleString()}
            subtitle="Registered accounts"
            icon={Users}
          />
          <StatCard
            title="Active Users"
            value={activeUserCount.toString()}
            subtitle="Logged-in sessions"
            icon={Eye}
          />
          <StatCard
            title="Total Watch Time"
            value="0 hrs"
            subtitle="Across all assets"
            icon={Clock}
          />
          <StatCard
            title="Catalog Movies"
            value={MOCK_MOVIES.length.toString()}
            subtitle="4 curated rails"
            icon={Film}
          />
        </div>

        {/* Row 2: System Health & Infrastructure Telemetry */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>System Infrastructure &amp; Telemetry Health</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Real-time operational status across primary database, cache cluster, media storage, and transcoding queue
              </p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-400">All Clusters Operational (99.9%)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Database */}
            <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>PostgreSQL Primary</span>
                  </span>
                  <StatusBadge status={sys.dbStatus} />
                </div>
                <p className="text-[11px] text-neutral-400 mt-2">Active connections: 24/100</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-white font-mono">
                    {sys.dbResponseTimeMs > 0 ? sys.dbResponseTimeMs : '< 1.0'}
                  </span>
                  <span className="text-xs text-neutral-500 font-bold">ms ping</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-neutral-900 text-[10px] text-neutral-500 flex items-center justify-between">
                <span>Replica lag: 0.0ms</span>
                <span className="text-emerald-400">SSL Active</span>
              </div>
            </div>

            {/* Redis Cache */}
            <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-emerald-400" />
                    <span>Redis Cache Cluster</span>
                  </span>
                  <StatusBadge status={sys.cacheStatus} />
                </div>
                <p className="text-[11px] text-neutral-400 mt-2">
                  RAM: {sys.redisMemoryUsedMb}MB / {sys.redisMemoryTotalMb}MB
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                    {sys.redisHitRatePct}%
                  </span>
                  <span className="text-xs text-neutral-500 font-bold">hit ratio</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-neutral-900 text-[10px] text-neutral-500 flex items-center justify-between">
                <span>In-memory storage</span>
                <span>0 Evictions</span>
              </div>
            </div>

            {/* Disk Storage Pool */}
            <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                    <span>Disk Storage Pool</span>
                  </span>
                  <StatusBadge
                    status={storageMetrics.warningCount > 0 ? 'Warning' : 'Healthy'}
                    variant={storageMetrics.warningCount > 0 ? 'warning' : 'healthy'}
                  />
                </div>
                <p className="text-[11px] text-neutral-400 mt-2">
                  {storageMetrics.pathCount} mounts • {formatStorageSize(storageMetrics.totalRemainGb)} free
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-white font-mono">
                    {formatStorageSize(storageMetrics.totalUsedGb)}
                  </span>
                  <span className="text-xs text-neutral-500 font-bold">
                    / {formatStorageSize(storageMetrics.totalLimitGb)}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-neutral-900 text-[10px] text-neutral-500 flex items-center justify-between">
                <span>{storageMetrics.percentFull}% capacity used</span>
                <span className="text-emerald-400">{storageMetrics.percentRemain}% remain</span>
              </div>
            </div>

            {/* Video Transcoder Queue */}
            <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    <span>Transcoder Queue</span>
                  </span>
                  <StatusBadge
                    status={sys.activeBackgroundTranscodeJobs > 0 ? 'Processing' : 'Standby'}
                    variant={sys.activeBackgroundTranscodeJobs > 0 ? 'info' : 'healthy'}
                  />
                </div>
                <p className="text-[11px] text-neutral-400 mt-2">FFmpeg encoding workers</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-white font-mono">
                    {sys.activeBackgroundTranscodeJobs}
                  </span>
                  <span className="text-xs text-neutral-500 font-bold">active jobs</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-neutral-900 text-[10px] text-neutral-500 flex items-center justify-between">
                <span>AV1 / HEVC profile</span>
                <span className="text-emerald-400">0 queued errors</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2.5: Local Disk Paths & Quotas Telemetry (Full & Remain) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <span>Local Disk Paths &amp; Quota Telemetry</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Real-time storage breakdown showing how much size is <strong className="text-blue-400">Full</strong> and <strong className="text-emerald-400">Remaining</strong> across all configured disk directories.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-[11px] font-mono">
                <span className="text-neutral-400">
                  Total Quota: <strong className="text-white">{formatStorageSize(storageMetrics.totalLimitGb)}</strong>
                </span>
                <span className="text-neutral-600">•</span>
                <span className="text-blue-400">
                  Full: <strong>{formatStorageSize(storageMetrics.totalUsedGb)}</strong> ({storageMetrics.percentFull}%)
                </span>
                <span className="text-neutral-600">•</span>
                <span className="text-emerald-400">
                  Remain: <strong>{formatStorageSize(storageMetrics.totalRemainGb)}</strong> ({storageMetrics.percentRemain}%)
                </span>
              </div>

              <Link
                href="/settings?tab=storage"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black font-extrabold text-xs hover:bg-neutral-200 transition-colors shadow-md"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Manage Paths</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Disk Paths Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {diskPaths.map((item) => {
              const usedPct = item.maxLimitGb > 0 ? (item.usedGb / item.maxLimitGb) * 100 : 0;
              const remainGb = Math.max(0, item.maxLimitGb - item.usedGb);
              const remainPct = Math.max(0, 100 - usedPct);

              const isHigh = usedPct >= 85;
              const isCrit = usedPct >= 95;
              const barColor = isCrit ? 'bg-rose-500' : isHigh ? 'bg-amber-500' : 'bg-emerald-500';

              return (
                <div
                  key={item.id}
                  className="bg-[#0c0c0c] border border-neutral-800/80 hover:border-neutral-700 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-colors"
                >
                  <div className="space-y-2">
                    {/* Header: Title + Category + Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Folder className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <h4 className="font-extrabold text-xs text-white truncate" title={item.name}>
                            {item.name}
                          </h4>
                          {item.isDefault && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-white text-black">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-neutral-400 font-mono mt-0.5 truncate" title={item.path}>
                          {item.path}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>

                    {/* Full vs Remain Breakdown Box */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-neutral-950/80 border border-neutral-900 text-xs">
                      <div>
                        <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                          <span className={`w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-amber-400' : 'bg-blue-400'}`} />
                          <span>Full (Used)</span>
                        </div>
                        <p className="text-sm font-black text-white font-mono mt-0.5">
                          {formatStorageSize(item.usedGb)}
                        </p>
                        <span className="text-[10px] font-mono text-neutral-500">
                          {usedPct.toFixed(1)}% of limit
                        </span>
                      </div>

                      <div className="border-l border-neutral-900 pl-2">
                        <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>Remain (Free)</span>
                        </div>
                        <p className="text-sm font-black text-emerald-400 font-mono mt-0.5">
                          {formatStorageSize(remainGb)}
                        </p>
                        <span className="text-[10px] font-mono text-emerald-500/80">
                          {remainPct.toFixed(1)}% remaining
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Max Quota */}
                    <div className="space-y-1">
                      <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden flex border border-neutral-800">
                        <div
                          className={`h-full ${barColor} transition-all duration-500`}
                          style={{ width: `${Math.min(100, usedPct)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                        <span>Max Limit: {formatStorageSize(item.maxLimitGb)}</span>
                        <span className={isHigh ? 'text-amber-400 font-bold' : ''}>
                          {usedPct.toFixed(0)}% full
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Warning banner if high usage */}
                  {isHigh && (
                    <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <span>Approaching max quota ({usedPct.toFixed(1)}%)</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 3: Top Movies & Real-Time Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Featured Catalog Movies */}
          <div className="lg:col-span-2 bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-white" />
                  <span>Featured Catalog Titles</span>
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">Core streaming assets and technical specifications</p>
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
                        {movie.category} • {movie.releaseYear} • {movie.duration}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1 font-bold text-white text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{movie.rating.toFixed(1)}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-900 border border-neutral-800 text-neutral-300">
                      {movie.quality}
                    </span>
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

              {recentActivities.length === 0 ? (
                <div className="py-12 text-center text-neutral-500">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-neutral-600 opacity-60" />
                  <p className="text-sm font-semibold text-neutral-400">No recent activity</p>
                  <p className="text-xs text-neutral-600 mt-1 max-w-[200px] mx-auto">
                    Viewer playback, auth, and system events will stream here live.
                  </p>
                </div>
              ) : (
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
              )}
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

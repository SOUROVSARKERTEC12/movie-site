'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Users, Eye, Clock, Film, HardDrive, Folder, Settings, ArrowUpRight } from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { StatCard } from '@/components/StatCard';
import { MOCK_MOVIES } from '@/data/mockMovies';
import { MOCK_USERS } from '@/data/mockUsers';
import {
  getDiskStoragePaths,
  formatStorageSize,
  getStorageAggregateMetrics,
} from '@/data/mockStorage';
import { DiskStoragePath } from '@movie-site/shared';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const [totalUserCount, setTotalUserCount] = useState<number>(MOCK_USERS.length);
  const [activeUserCount, setActiveUserCount] = useState<number>(
    MOCK_USERS.filter((u) => u.status === 'Active' || u.status === 'VIP').length
  );
  const [totalWatchTimeHours, setTotalWatchTimeHours] = useState<number>(0);
  const [movieCount, setMovieCount] = useState<number>(MOCK_MOVIES.length);
  const [diskPaths, setDiskPaths] = useState<DiskStoragePath[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadDashboardData = async () => {
      setIsClient(true);

      // 1. Fetch live movies count
      try {
        const movies = await api.movies.findAll();
        if (mounted && Array.isArray(movies)) {
          setMovieCount(movies.length);
        }
      } catch (err) {
        console.warn('Could not fetch movies count from backend API:', err);
      }

      // 2. Fetch live users count & stats
      try {
        const users = await api.users.findAll();
        if (mounted && Array.isArray(users) && users.length > 0) {
          setTotalUserCount(users.length);
          setActiveUserCount(
            users.filter((u) => u.status === 'Active' || u.status === 'VIP').length
          );
          const watchTime = users.reduce((acc, u) => acc + (u.totalWatchTimeHours || 0), 0);
          setTotalWatchTimeHours(watchTime);
        }
      } catch (err) {
        console.warn('Could not fetch users from backend API, using fallback:', err);
        const saved = typeof window !== 'undefined' ? localStorage.getItem('cineblack_admin_users') : null;
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && mounted) {
              setTotalUserCount(parsed.length);
              setActiveUserCount(
                parsed.filter((u: { status?: string }) => u.status === 'Active' || u.status === 'VIP').length
              );
            }
          } catch {
            // ignore parse failure
          }
        }
      }

      // 3. Fetch storage paths
      try {
        const paths = await api.storage.getPaths();
        if (mounted && Array.isArray(paths) && paths.length > 0) {
          setDiskPaths(
            paths.map((p) => ({
              id: p.id,
              name: p.name,
              path: p.path,
              maxLimitGb: p.maxLimitGb,
              usedGb: p.usedGb ?? 0,
            }))
          );
          return;
        }
      } catch (err) {
        console.warn('Could not fetch storage paths from backend API, using local storage:', err);
      }

      if (mounted) {
        setDiskPaths(getDiskStoragePaths());
      }
    };

    loadDashboardData();

    const handleStorageUpdate = async () => {
      try {
        const paths = await api.storage.getPaths();
        if (mounted && Array.isArray(paths) && paths.length > 0) {
          setDiskPaths(
            paths.map((p) => ({
              id: p.id,
              name: p.name,
              path: p.path,
              maxLimitGb: p.maxLimitGb,
              usedGb: p.usedGb ?? 0,
            }))
          );
          return;
        }
      } catch {
        // fallback
      }
      if (mounted) {
        setDiskPaths(getDiskStoragePaths());
      }
    };

    window.addEventListener('cineblack_storage_updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      mounted = false;
      window.removeEventListener('cineblack_storage_updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const storageMetrics = useMemo(() => {
    return getStorageAggregateMetrics(diskPaths);
  }, [diskPaths]);

  if (!isClient) return null;

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
              <span>{movieCount} Catalog Movies</span>
            </Link>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Core Metrics Grid */}
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
            value={`${totalWatchTimeHours} hrs`}
            subtitle="Across all assets"
            icon={Clock}
          />
          <StatCard
            title="Catalog Movies"
            value={movieCount.toString()}
            subtitle="4 curated rails"
            icon={Film}
          />
        </div>

        {/* Local Disk Paths & Quotas Telemetry (Full & Remain) */}
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

              return (
                <div
                  key={item.id}
                  className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Folder className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <h4 className="font-extrabold text-xs text-white truncate" title={item.name}>
                            {item.name}
                          </h4>
                        </div>
                        <p className="text-[10px] text-neutral-400 font-mono mt-0.5 truncate" title={item.path}>
                          {item.path}
                        </p>
                      </div>
                    </div>

                    {/* Full vs Remain Breakdown Box */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-neutral-950/80 border border-neutral-900 text-xs">
                      <div>
                        <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
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
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, usedPct)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                        <span>Max Limit: {formatStorageSize(item.maxLimitGb)}</span>
                        <span>{usedPct.toFixed(0)}% full</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

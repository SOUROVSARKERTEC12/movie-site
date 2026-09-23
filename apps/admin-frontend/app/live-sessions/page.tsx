'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Radio,
  Wifi,
  Activity,
  Zap,
  Film,
  ShieldAlert,
  Clock,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { DataTable, Column } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { StatCard } from '@/components/StatCard';
import { INITIAL_LIVE_SESSIONS } from '@/data/mockSessions';
import { LiveSession } from '@movie-site/shared';

export default function LiveSessionsPage() {
  const [sessions, setSessions] = useState<LiveSession[]>(INITIAL_LIVE_SESSIONS);
  const [liveCounter, setLiveCounter] = useState(3842);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');

  // Real-time heartbeat simulation effect: simulates live stream activity every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSessions((prev) =>
        prev.map((s, idx) => {
          // Increment position by 3s
          const newPos = (s.currentPositionSeconds + 3) % s.totalDurationSeconds;
          // Random slight bitrate fluctuation (+- 0.2 Mbps)
          const delta = ((idx % 3) - 1) * 0.1;
          const newBitrate = Math.max(3.0, Math.min(22.0, Math.round((s.bitrateMbps + delta) * 10) / 10));
          // Modulate buffer slightly
          const bufDelta = ((idx % 5) - 2) * 0.2;
          const newBuffer = Math.max(4.0, Math.min(38.0, Math.round((s.bufferHealthSeconds + bufDelta) * 10) / 10));

          return {
            ...s,
            currentPositionSeconds: newPos,
            bitrateMbps: newBitrate,
            bufferHealthSeconds: newBuffer,
            lastHeartbeat: `${(idx % 4) + 1}s ago`,
          };
        })
      );

      // Fluctuate global live viewer count slightly (+- 5)
      setLiveCounter((c) => c + Math.floor(Math.random() * 7) - 3);
      setLastUpdated(new Date().toLocaleTimeString());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatSeconds = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  const columns: Column<LiveSession>[] = [
    {
      key: 'userName',
      header: 'Active Viewer',
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 flex-shrink-0">
            <Image src={s.userAvatar} alt={s.userName} fill sizes="32px" className="object-cover" />
          </div>
          <div>
            <span className="font-bold text-white text-xs block">{s.userName}</span>
            <span className="text-[10px] text-neutral-500 font-mono">{s.userId}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'movieTitle',
      header: 'Stream Asset',
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-2.5 min-w-[200px]">
          <div className="relative w-8 h-11 rounded overflow-hidden bg-neutral-900 border border-neutral-800 flex-shrink-0">
            <Image src={s.moviePoster} alt={s.movieTitle} fill sizes="32px" className="object-cover" />
          </div>
          <div>
            <span className="font-bold text-white text-xs block line-clamp-1">{s.movieTitle}</span>
            <span className="text-[10px] text-neutral-400 font-mono">
              {formatSeconds(s.currentPositionSeconds)} / {formatSeconds(s.totalDurationSeconds)}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'currentQuality',
      header: 'Quality & Bitrate',
      sortable: true,
      render: (s) => (
        <div>
          <span className="font-extrabold text-white text-[11px] block">{s.currentQuality}</span>
          <span className="text-[10px] font-mono text-emerald-400">
            {s.bitrateMbps} Mbps • {s.resolution}
          </span>
        </div>
      ),
    },
    {
      key: 'bufferHealthSeconds',
      header: 'Buffer Health',
      sortable: true,
      render: (s) => (
        <div className="min-w-[120px]">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
            <span className="font-bold text-white">{s.bufferHealthSeconds}s ahead</span>
            <span className={`text-[10px] font-semibold ${s.bufferHealthSeconds > 15 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {s.bufferStatus}
            </span>
          </div>
          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                s.bufferHealthSeconds > 18
                  ? 'bg-emerald-400'
                  : s.bufferHealthSeconds > 8
                  ? 'bg-amber-400'
                  : 'bg-rose-500 animate-pulse'
              }`}
              style={{ width: `${Math.min(100, (s.bufferHealthSeconds / 30) * 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'connectionStatus',
      header: 'Status',
      sortable: true,
      render: (s) => <StatusBadge status={s.connectionStatus} pulse={s.connectionStatus === 'Stable'} />,
    },
    {
      key: 'device',
      header: 'Device & Client',
      render: (s) => (
        <div className="text-[11px] text-neutral-300">
          <span className="font-medium block truncate max-w-[130px]">{s.device}</span>
          <span className="text-[10px] text-neutral-500">{s.browser} • {s.os}</span>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (s) => <span className="text-neutral-300 text-xs">{s.location}</span>,
    },
    {
      key: 'lastHeartbeat',
      header: 'Heartbeat',
      render: (s) => (
        <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{s.lastHeartbeat}</span>
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pb-12">
      <AdminHeader
        title="Live Playback Sessions Monitor"
        subtitle={`Real-time telemetry pulse of active video sessions across the CDN • Updated: ${lastUpdated}`}
        actions={
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400">Live Pulse Active (3s loop)</span>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Live Concurrent"
            value={liveCounter.toLocaleString()}
            subtitle="Simulated active streams"
            trend="up"
            change="Peak 5.9k"
            icon={Radio}
            sparklineData={[3600, 3720, 3800, 3840, 3855]}
          />
          <StatCard
            title="Avg Buffer Ahead"
            value="24.2 sec"
            subtitle="Ahead of playhead"
            trend="up"
            change="Optimal"
            icon={Activity}
            sparklineData={[22, 23, 24, 24.5, 24.2]}
          />
          <StatCard
            title="Avg Bitrate"
            value="9.4 Mbps"
            subtitle="H.265 / AV1 adaptive"
            icon={Zap}
            sparklineData={[9.1, 9.2, 9.5, 9.4, 9.4]}
          />
          <StatCard
            title="Buffering Incidents"
            value="0"
            subtitle="100% smooth playback"
            trend="up"
            change="Clean"
            icon={CheckCircle}
            sparklineData={[0, 0, 0, 0, 0]}
          />
        </div>

        <DataTable
          columns={columns}
          data={sessions}
          searchKeys={['userName', 'userId', 'movieTitle', 'device', 'location', 'currentQuality']}
          searchPlaceholder="Search active session by user, movie asset, device, or city..."
          defaultSortKey="bufferHealthSeconds"
          defaultSortDir="desc"
          filters={[
            {
              label: 'Quality',
              key: 'currentQuality',
              options: [
                { label: '4K UHD', value: '4K UHD' },
                { label: '1080p FHD', value: '1080p FHD' },
                { label: '720p HD', value: '720p HD' },
              ],
            },
            {
              label: 'Buffer Health',
              key: 'bufferStatus',
              options: [
                { label: 'Optimal (>18s)', value: 'Optimal' },
                { label: 'Adequate (8-18s)', value: 'Adequate' },
                { label: 'Critical (<8s)', value: 'Critical' },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}

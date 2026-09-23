'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Activity,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  Search,
  Plus,
  Trash2,
  Tv,
  Film,
  Zap,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { DataTable, Column } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { StatCard } from '@/components/StatCard';
import { MOCK_ACTIVITIES } from '@/data/mockActivities';
import { UserActivityEvent, ActivityEventType } from '@movie-site/shared';

export default function UserActivityPage() {
  const [selectedEvent, setSelectedEvent] = useState<UserActivityEvent | null>(null);

  const totalEvents = MOCK_ACTIVITIES.length;
  const playbackStarts = MOCK_ACTIVITIES.filter((a) => a.eventType === 'MOVIE_STARTED').length;
  const completions = MOCK_ACTIVITIES.filter((a) => a.eventType === 'MOVIE_COMPLETED').length;
  const searches = MOCK_ACTIVITIES.filter((a) => a.eventType === 'SEARCH_PERFORMED').length;

  const getEventBadge = (type: ActivityEventType) => {
    switch (type) {
      case 'MOVIE_STARTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-max"><Play className="w-2.5 h-2.5 fill-current" /> Stream Start</span>;
      case 'MOVIE_COMPLETED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1 w-max"><CheckCircle2 className="w-2.5 h-2.5" /> Completed</span>;
      case 'MOVIE_PAUSED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-max"><Pause className="w-2.5 h-2.5" /> Paused</span>;
      case 'MOVIE_ABANDONED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-max"><AlertCircle className="w-2.5 h-2.5" /> Drop-Off</span>;
      case 'WATCHLIST_ADD':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-300 border border-purple-500/30 flex items-center gap-1 w-max"><Plus className="w-2.5 h-2.5" /> Watchlist +</span>;
      case 'SEARCH_PERFORMED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-neutral-800 text-neutral-300 border border-neutral-700 flex items-center gap-1 w-max"><Search className="w-2.5 h-2.5" /> Search</span>;
      case 'QUALITY_CHANGED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1 w-max"><Zap className="w-2.5 h-2.5" /> Quality Switch</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800">{type}</span>;
    }
  };

  const columns: Column<UserActivityEvent>[] = [
    {
      key: 'timestamp',
      header: 'Time',
      sortable: true,
      render: (act) => {
        const d = new Date(act.timestamp);
        return (
          <div className="font-mono text-[11px] text-neutral-400 leading-tight">
            <span>{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            <span className="block text-[10px] text-neutral-600">{d.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
          </div>
        );
      },
    },
    {
      key: 'userName',
      header: 'User',
      sortable: true,
      render: (act) => (
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 rounded-full overflow-hidden bg-neutral-800 flex-shrink-0">
            <Image src={act.userAvatar} alt={act.userName} fill sizes="24px" className="object-cover" />
          </div>
          <div>
            <span className="font-bold text-white text-xs block">{act.userName}</span>
            <span className="text-[10px] text-neutral-500 font-mono">{act.userId}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'eventType',
      header: 'Event',
      sortable: true,
      render: (act) => getEventBadge(act.eventType),
    },
    {
      key: 'contentTitle',
      header: 'Content / Asset',
      render: (act) => (
        act.contentTitle ? (
          <span className="font-semibold text-neutral-200 text-xs flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-neutral-500" />
            <span>{act.contentTitle}</span>
          </span>
        ) : (
          <span className="text-neutral-600 text-[11px] font-mono">—</span>
        )
      ),
    },
    {
      key: 'device',
      header: 'Client / OS',
      render: (act) => (
        <div className="text-[11px] text-neutral-400 truncate max-w-[140px]">
          <span>{act.device}</span>
          <span className="block text-[10px] text-neutral-600">{act.os} • {act.browser}</span>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location & IP',
      render: (act) => (
        <div className="text-[11px]">
          <span className="text-neutral-300 font-medium">{act.location}</span>
          <span className="block text-[10px] font-mono text-neutral-500">{act.ipAddress}</span>
        </div>
      ),
    },
    {
      key: 'metadata',
      header: 'Metadata',
      render: (act) => (
        act.metadata ? (
          <span className="font-mono text-[10px] text-neutral-400 bg-neutral-900/90 px-2 py-0.5 rounded border border-neutral-800 truncate block max-w-[180px]" title={JSON.stringify(act.metadata)}>
            {JSON.stringify(act.metadata).replace(/[{"}]/g, '').replace(/:/g, ': ')}
          </span>
        ) : (
          <span className="text-neutral-600 text-[10px] font-mono">none</span>
        )
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pb-12">
      <AdminHeader
        title="Live User Activity & Telemetry Audit"
        subtitle="Real-time stream of player actions, playback events, quality switches, and authentication logs"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total Events"
            value={totalEvents}
            subtitle="Past 48 hours"
            icon={Activity}
            sparklineData={[140, 160, 180, 200, 220]}
          />
          <StatCard
            title="Stream Starts"
            value={playbackStarts}
            subtitle="Engaged sessions"
            trend="up"
            change="+18%"
            icon={Play}
            sparklineData={[30, 42, 50, 60, 72]}
          />
          <StatCard
            title="Completions"
            value={completions}
            subtitle="Full credits watched"
            trend="up"
            change="78% rate"
            icon={CheckCircle2}
            sparklineData={[20, 28, 35, 45, 54]}
          />
          <StatCard
            title="Searches Run"
            value={searches}
            subtitle="Catalog queries"
            icon={Search}
            sparklineData={[15, 20, 24, 28, 33]}
          />
        </div>

        <DataTable
          columns={columns}
          data={MOCK_ACTIVITIES}
          searchKeys={['userName', 'userId', 'contentTitle', 'device', 'ipAddress', 'location']}
          searchPlaceholder="Filter activity by user, content title, device, IP or location..."
          defaultSortKey="timestamp"
          defaultSortDir="desc"
          filters={[
            {
              label: 'Event Type',
              key: 'eventType',
              options: [
                { label: 'Stream Started', value: 'MOVIE_STARTED' },
                { label: 'Stream Completed', value: 'MOVIE_COMPLETED' },
                { label: 'Stream Paused', value: 'MOVIE_PAUSED' },
                { label: 'Stream Abandoned', value: 'MOVIE_ABANDONED' },
                { label: 'Watchlist Add', value: 'WATCHLIST_ADD' },
                { label: 'Search Run', value: 'SEARCH_PERFORMED' },
                { label: 'Quality Switch', value: 'QUALITY_CHANGED' },
                { label: 'Login', value: 'LOGIN' },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}

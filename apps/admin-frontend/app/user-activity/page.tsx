'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Activity,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  Search,
  Plus,
  Minus,
  Film,
  Zap,
  Eye,
  X,
  RotateCcw,
  Download,
  Radio,
  LogIn,
  LogOut,
  FastForward,
  Subtitles,
  Copy,
  Check,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { DataTable, Column } from '@/components/DataTable';
import { StatCard } from '@/components/StatCard';
import { MOCK_ACTIVITIES } from '@/data/mockActivities';
import { UserActivityEvent, ActivityEventType } from '@movie-site/shared';

const STORAGE_KEY = 'cineblack_admin_activities';

export default function UserActivityPage() {
  const [activities, setActivities] = useState<UserActivityEvent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<UserActivityEvent | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [liveStreamActive, setLiveStreamActive] = useState(true);

  // Load activities from localStorage or fallback to MOCK_ACTIVITIES
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setActivities(parsed);
              setIsLoaded(true);
              return;
            }
          } catch (e) {
            console.error('Failed to parse saved activities from localStorage', e);
          }
        }
        setActivities(MOCK_ACTIVITIES);
        setIsLoaded(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save activities to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    }
  }, [activities, isLoaded]);

  // Reset to default seed activities
  const handleResetToDefault = () => {
    if (confirm('Reset telemetry event directory to initial system defaults?')) {
      setActivities(MOCK_ACTIVITIES);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ACTIVITIES));
      }
    }
  };

  // Export activities as JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activities, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `user_activity_telemetry_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Copy JSON metadata payload
  const handleCopyPayload = (obj: unknown) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Dynamic Metrics
  const totalEvents = activities.length;
  const playbackStarts = activities.filter((a) => a.eventType === 'MOVIE_STARTED').length;
  const completions = activities.filter((a) => a.eventType === 'MOVIE_COMPLETED').length;
  const completionRate = playbackStarts > 0 ? Math.round((completions / playbackStarts) * 100) : 0;
  const searches = activities.filter((a) => a.eventType === 'SEARCH_PERFORMED').length;

  const getEventBadge = (type: ActivityEventType) => {
    switch (type) {
      case 'MOVIE_STARTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-max">
            <Play className="w-2.5 h-2.5 fill-current" /> Stream Start
          </span>
        );
      case 'MOVIE_COMPLETED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1 w-max">
            <CheckCircle2 className="w-2.5 h-2.5" /> Completed
          </span>
        );
      case 'MOVIE_PAUSED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-max">
            <Pause className="w-2.5 h-2.5" /> Paused
          </span>
        );
      case 'MOVIE_ABANDONED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-max">
            <AlertCircle className="w-2.5 h-2.5" /> Drop-Off
          </span>
        );
      case 'WATCHLIST_ADD':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-300 border border-purple-500/30 flex items-center gap-1 w-max">
            <Plus className="w-2.5 h-2.5" /> Watchlist +
          </span>
        );
      case 'WATCHLIST_REMOVE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-1 w-max">
            <Minus className="w-2.5 h-2.5" /> Watchlist -
          </span>
        );
      case 'SEARCH_PERFORMED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-neutral-800 text-neutral-300 border border-neutral-700 flex items-center gap-1 w-max">
            <Search className="w-2.5 h-2.5" /> Search
          </span>
        );
      case 'QUALITY_CHANGED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1 w-max">
            <Zap className="w-2.5 h-2.5" /> Quality Switch
          </span>
        );
      case 'SPEED_CHANGED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center gap-1 w-max">
            <FastForward className="w-2.5 h-2.5" /> Speed Change
          </span>
        );
      case 'SUBTITLE_TOGGLED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 w-max">
            <Subtitles className="w-2.5 h-2.5" /> Subtitles
          </span>
        );
      case 'LOGIN':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center gap-1 w-max">
            <LogIn className="w-2.5 h-2.5" /> User Login
          </span>
        );
      case 'LOGOUT':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-neutral-800 text-neutral-400 border border-neutral-700 flex items-center gap-1 w-max">
            <LogOut className="w-2.5 h-2.5" /> Log Out
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800">
            {type}
          </span>
        );
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
            <span className="block text-[10px] text-neutral-600">
              {d.toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </span>
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
      render: (act) =>
        act.contentTitle ? (
          <span className="font-semibold text-neutral-200 text-xs flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-neutral-500" />
            <span>{act.contentTitle}</span>
          </span>
        ) : (
          <span className="text-neutral-600 text-[11px] font-mono">—</span>
        ),
    },
    {
      key: 'device',
      header: 'Client / OS',
      render: (act) => (
        <div className="text-[11px] text-neutral-400 truncate max-w-[140px]">
          <span>{act.device}</span>
          <span className="block text-[10px] text-neutral-600">
            {act.os} • {act.browser}
          </span>
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
      render: (act) =>
        act.metadata ? (
          <span
            className="font-mono text-[10px] text-neutral-400 bg-neutral-900/90 px-2 py-0.5 rounded border border-neutral-800 truncate block max-w-[160px] cursor-pointer hover:border-neutral-700"
            title={JSON.stringify(act.metadata)}
            onClick={() => setSelectedEvent(act)}
          >
            {JSON.stringify(act.metadata).replace(/[{"}]/g, '').replace(/:/g, ': ')}
          </span>
        ) : (
          <span className="text-neutral-600 text-[10px] font-mono">none</span>
        ),
    },
    {
      key: 'id',
      header: 'Action',
      render: (act) => (
        <button
          onClick={() => setSelectedEvent(act)}
          title="Inspect telemetry event"
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-white/30 text-neutral-300 hover:text-white transition-colors text-xs font-semibold"
        >
          <Eye className="w-3.5 h-3.5 text-neutral-400" />
          <span>Inspect</span>
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pb-12">
      <AdminHeader
        title="Live User Activity & Telemetry Audit"
        subtitle="Real-time stream of player actions, playback events, quality switches, and authentication logs"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiveStreamActive(!liveStreamActive)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                liveStreamActive
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${liveStreamActive ? 'animate-pulse text-emerald-400' : 'text-neutral-500'}`} />
              <span>{liveStreamActive ? 'Live Telemetry Active' : 'Feed Paused'}</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white font-semibold text-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handleResetToDefault}
              className="p-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="Reset telemetry events to default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total Events"
            value={totalEvents}
            subtitle="Captured events"
            icon={Activity}
          />
          <StatCard
            title="Stream Starts"
            value={playbackStarts}
            subtitle="Engaged playback sessions"
            trend={playbackStarts > 0 ? 'up' : undefined}
            change={playbackStarts > 0 ? `${playbackStarts} sessions` : undefined}
            icon={Play}
          />
          <StatCard
            title="Completions"
            value={completions}
            subtitle={playbackStarts > 0 ? `${completionRate}% completion rate` : 'Full credits watched'}
            trend={completionRate > 50 ? 'up' : undefined}
            change={playbackStarts > 0 ? `${completionRate}%` : undefined}
            icon={CheckCircle2}
          />
          <StatCard
            title="Searches Run"
            value={searches}
            subtitle="Catalog discover queries"
            icon={Search}
          />
        </div>

        <DataTable
          columns={columns}
          data={activities}
          searchKeys={['userName', 'userId', 'contentTitle', 'device', 'ipAddress', 'location', 'sessionId']}
          searchPlaceholder="Filter activity by user, title, session ID, IP, or location..."
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
                { label: 'Watchlist Remove', value: 'WATCHLIST_REMOVE' },
                { label: 'Quality Switch', value: 'QUALITY_CHANGED' },
                { label: 'Speed Change', value: 'SPEED_CHANGED' },
                { label: 'Subtitles', value: 'SUBTITLE_TOGGLED' },
                { label: 'Search Run', value: 'SEARCH_PERFORMED' },
                { label: 'User Login', value: 'LOGIN' },
                { label: 'Log Out', value: 'LOGOUT' },
              ],
            },
          ]}
        />
      </div>

      {/* EVENT INSPECTION MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedEvent(null)}
          />

          <div className="relative bg-[#0c0c0c] border border-neutral-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl z-10 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Telemetry Event Inspector</h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/80">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 flex-shrink-0">
                  <Image src={selectedEvent.userAvatar} alt={selectedEvent.userName} fill sizes="40px" className="object-cover" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">{selectedEvent.userName}</h4>
                  <span className="font-mono text-xs text-neutral-400">{selectedEvent.userId}</span>
                </div>
              </div>
              <div>{getEventBadge(selectedEvent.eventType)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-neutral-900/40 rounded-xl border border-neutral-800">
                <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Event Timestamp</span>
                <span className="text-neutral-200 font-mono mt-1 block">
                  {new Date(selectedEvent.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-neutral-900/40 rounded-xl border border-neutral-800">
                <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Session ID</span>
                <span className="text-emerald-400 font-mono mt-1 block truncate" title={selectedEvent.sessionId}>
                  {selectedEvent.sessionId}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-neutral-900/40 p-3 rounded-xl border border-neutral-800">
              {selectedEvent.contentTitle && (
                <div className="flex items-center justify-between py-1 border-b border-neutral-800/60">
                  <span className="text-neutral-400">Content Title:</span>
                  <span className="text-white font-semibold flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{selectedEvent.contentTitle} ({selectedEvent.contentId})</span>
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">Device & OS:</span>
                <span className="text-white font-medium">{selectedEvent.device} ({selectedEvent.os})</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">Browser / Client:</span>
                <span className="text-neutral-300 font-medium">{selectedEvent.browser}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">Location:</span>
                <span className="text-neutral-300 font-medium">{selectedEvent.location}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-neutral-400">IP Address:</span>
                <span className="font-mono text-neutral-300">{selectedEvent.ipAddress}</span>
              </div>
            </div>

            {selectedEvent.metadata && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                    Technical Metadata Payload
                  </span>
                  <button
                    onClick={() => handleCopyPayload(selectedEvent.metadata)}
                    className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition-colors"
                  >
                    {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId ? 'Copied' : 'Copy Payload'}</span>
                  </button>
                </div>
                <div className="bg-black border border-neutral-800 rounded-xl p-3 font-mono text-[11px] text-neutral-300 overflow-x-auto max-h-36">
                  <pre>{JSON.stringify(selectedEvent.metadata, null, 2)}</pre>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-neutral-800 flex items-center justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-neutral-200 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Sliders,
  Server,
  Cpu,
  Wifi,
  Save,
  Check,
  RefreshCw,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  // Form states
  const [maxBitrate4K, setMaxBitrate4K] = useState(16.5);
  const [maxBitrate1080p, setMaxBitrate1080p] = useState(8.0);
  const [transcodingCodec, setTranscodingCodec] = useState('AV1_HEVC_H264');
  const [edgeCacheTtl, setEdgeCacheTtl] = useState(86400);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [telemetryPollInterval, setTelemetryPollInterval] = useState(3);
  const [autoPurgeCacheOnPublish, setAutoPurgeCacheOnPublish] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#050505] pb-12">
      <AdminHeader
        title="Platform Configuration & Transcoding Policies"
        subtitle="Manage global streaming bitrates, edge cache TTLs, encoding codecs, and maintenance mode"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Video Bitrate & Adaptive Streaming */}
          <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-900">
              <Cpu className="w-5 h-5 text-white" />
              <div>
                <h3 className="font-bold text-sm text-white">Adaptive Bitrate &amp; Resolution Caps</h3>
                <p className="text-xs text-neutral-400">Define maximum allowable bitrates for client video players</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  4K UHD Peak Bitrate Cap (Mbps)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="10"
                    max="25"
                    step="0.5"
                    value={maxBitrate4K}
                    onChange={(e) => setMaxBitrate4K(parseFloat(e.target.value))}
                    className="flex-1 accent-white"
                  />
                  <span className="w-16 font-mono text-sm font-bold text-white text-right">
                    {maxBitrate4K} Mbps
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">Recommended: 14.0 - 18.0 Mbps for 4K HDR</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  1080p FHD Bitrate Cap (Mbps)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="4"
                    max="12"
                    step="0.5"
                    value={maxBitrate1080p}
                    onChange={(e) => setMaxBitrate1080p(parseFloat(e.target.value))}
                    className="flex-1 accent-white"
                  />
                  <span className="w-16 font-mono text-sm font-bold text-white text-right">
                    {maxBitrate1080p} Mbps
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">Recommended: 6.0 - 8.5 Mbps</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Transcoding Output Multi-Codec Ladder
              </label>
              <select
                value={transcodingCodec}
                onChange={(e) => setTranscodingCodec(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
              >
                <option value="AV1_HEVC_H264">AV1 Primary + HEVC/H.265 Fallback + H.264 Universal (Highest Efficiency)</option>
                <option value="HEVC_H264">HEVC/H.265 4K + H.264 Universal</option>
                <option value="H264_ONLY">H.264 Baseline Only (Legacy Compatibility)</option>
              </select>
            </div>
          </div>

          {/* Section 2: CDN Edge & Caching Policies */}
          <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-900">
              <Server className="w-5 h-5 text-white" />
              <div>
                <h3 className="font-bold text-sm text-white">CDN Edge Caching &amp; Manifest TTL</h3>
                <p className="text-xs text-neutral-400">Configure Cloudflare &amp; Fastly edge cache lifetimes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Media Chunk Cache TTL (Seconds)
                </label>
                <select
                  value={edgeCacheTtl}
                  onChange={(e) => setEdgeCacheTtl(parseInt(e.target.value, 10))}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                >
                  <option value={3600}>1 Hour (3,600s)</option>
                  <option value={86400}>24 Hours (86,400s) — Recommended</option>
                  <option value={604800}>7 Days (604,800s)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Live Telemetry Pulse Interval
                </label>
                <select
                  value={telemetryPollInterval}
                  onChange={(e) => setTelemetryPollInterval(parseInt(e.target.value, 10))}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                >
                  <option value={1}>1 Second (Intense Telemetry)</option>
                  <option value={3}>3 Seconds (Optimal Balanced)</option>
                  <option value={5}>5 Seconds (Low Overhead)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-xs font-semibold text-white">Auto-Purge CDN on Asset Update</p>
                <p className="text-[11px] text-neutral-400">Automatically broadcast edge cache invalidations when movie metadata or posters change</p>
              </div>
              <input
                type="checkbox"
                checked={autoPurgeCacheOnPublish}
                onChange={(e) => setAutoPurgeCacheOnPublish(e.target.checked)}
                className="w-4 h-4 accent-white rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Section 3: Operational Guardrails & Maintenance */}
          <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-900">
              <Shield className="w-5 h-5 text-white" />
              <div>
                <h3 className="font-bold text-sm text-white">Emergency Guardrails &amp; Maintenance Mode</h3>
                <p className="text-xs text-neutral-400">Global site availability toggle and security overrides</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/50 border border-neutral-800">
              <div>
                <span className="text-xs font-bold text-white block">Platform Maintenance Mode</span>
                <span className="text-[11px] text-neutral-400">When enabled, customer movie streaming displays a scheduled maintenance landing banner</span>
              </div>
              <button
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  maintenanceMode
                    ? 'bg-rose-600 text-white'
                    : 'bg-neutral-800 text-neutral-300 hover:text-white'
                }`}
              >
                {maintenanceMode ? 'ENABLED (Live Offline)' : 'Disabled (Operational)'}
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {saved && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>Configuration synchronized successfully!</span>
              </span>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-neutral-200 transition-all active:scale-95 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>Save Policy Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

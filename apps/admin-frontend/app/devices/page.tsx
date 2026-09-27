'use client';

import React, { useState, useMemo } from 'react';
import {
  Laptop,
  Smartphone,
  Tablet,
  Search,
  CheckCircle2,
  Maximize2,
  Monitor,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { DonutChart } from '@/components/charts/DonutChart';
import { BarChart } from '@/components/charts/BarChart';

interface ClientDevice {
  id: string;
  model: string;
  category: 'Desktop' | 'Mobile' | 'Tablet';
  os: string;
  client: string;
  mediaTier: string;
  share: string;
  sharePercent: number;
  status: 'Optimal' | 'Certified' | 'Supported';
}

const CLIENT_DEVICES_FLEET: ClientDevice[] = [
  {
    id: 'dev_01',
    model: 'Apple MacBook Pro 16"',
    category: 'Desktop',
    os: 'macOS Sonoma (14.6)',
    client: 'Chrome 128 / Safari 17',
    mediaTier: '4K HDR • Dolby Atmos',
    share: '30%',
    sharePercent: 30,
    status: 'Optimal',
  },
  {
    id: 'dev_02',
    model: 'Apple iPhone 15 Pro',
    category: 'Mobile',
    os: 'iOS 17.6',
    client: 'CineBlack iOS / Safari',
    mediaTier: 'Super Retina • HDR10',
    share: '26%',
    sharePercent: 26,
    status: 'Optimal',
  },
  {
    id: 'dev_03',
    model: 'Dell XPS 15 (OLED)',
    category: 'Desktop',
    os: 'Windows 11 Pro',
    client: 'Chrome 128 / Edge',
    mediaTier: '4K UHD • Stereo PCM',
    share: '18%',
    sharePercent: 18,
    status: 'Optimal',
  },
  {
    id: 'dev_04',
    model: 'Apple iPad Pro 12.9"',
    category: 'Tablet',
    os: 'iPadOS 17.5',
    client: 'Safari 17 / CineBlack iPad',
    mediaTier: 'Liquid Retina XDR • HDR',
    share: '10%',
    sharePercent: 10,
    status: 'Optimal',
  },
  {
    id: 'dev_05',
    model: 'Google Pixel 8 Pro',
    category: 'Mobile',
    os: 'Android 14',
    client: 'Chrome Mobile 128',
    mediaTier: '1080p FHD • HDR10',
    share: '7%',
    sharePercent: 7,
    status: 'Supported',
  },
  {
    id: 'dev_06',
    model: 'Samsung Galaxy Tab S9',
    category: 'Tablet',
    os: 'Android 14 (OneUI 6)',
    client: 'Chrome / CineBlack App',
    mediaTier: '2K Dynamic AMOLED',
    share: '5%',
    sharePercent: 5,
    status: 'Supported',
  },
  {
    id: 'dev_07',
    model: 'Custom Workstation PC',
    category: 'Desktop',
    os: 'Ubuntu Linux 24.04',
    client: 'Firefox 129',
    mediaTier: '1080p FHD • Stereo',
    share: '4%',
    sharePercent: 4,
    status: 'Supported',
  },
];

export default function DevicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Hardware Form Factor breakdown (Desktop, Mobile, Tablets)
  const formFactorData = [
    { label: 'Desktop & Laptop', value: 56, color: '#ffffff' },
    { label: 'Mobile (iOS & Android)', value: 36, color: '#3b82f6' },
    { label: 'Tablets', value: 8, color: '#f59e0b' },
  ];

  // 2. Client Operating Systems
  const osData = [
    { label: 'Windows 11 / 10', shortLabel: 'Windows', value: 42, color: '#3b82f6' },
    { label: 'macOS Sonoma / Ventura', shortLabel: 'macOS', value: 30, color: '#ffffff' },
    { label: 'iOS 17 / 18', shortLabel: 'iOS', value: 18, color: '#a855f7' },
    { label: 'Android 14', shortLabel: 'Android', value: 10, color: '#10b981' },
  ];

  // 3. Web & Player Engines
  const browserData = [
    { label: 'Google Chrome', value: 58, color: '#ffffff' },
    { label: 'Apple Safari', value: 24, color: '#3b82f6' },
    { label: 'CineBlack Native App', value: 9, color: '#10b981' },
    { label: 'Microsoft Edge', value: 6, color: '#f59e0b' },
    { label: 'Firefox & Others', value: 3, color: '#64748b' },
  ];

  // 4. Viewport & Screen Resolutions (focused, necessary data only)
  const resolutionData = [
    {
      resolution: '1920 × 1080',
      name: '1080p FHD',
      aspectRatio: '16:9',
      share: '48%',
      sharePercent: 48,
      targetDevice: 'Desktop & Laptop Displays',
      mediaTier: 'Full HD 60fps',
    },
    {
      resolution: '3840 × 2160',
      name: '4K UHD',
      aspectRatio: '16:9',
      share: '32%',
      sharePercent: 32,
      targetDevice: '4K Ultra-Wide & Pro Displays',
      mediaTier: '4K HDR • Dolby Vision',
    },
    {
      resolution: '2560 × 1440',
      name: '2K QHD',
      aspectRatio: '16:9',
      share: '11%',
      sharePercent: 11,
      targetDevice: 'Desktop Monitors / Pro Tablets',
      mediaTier: '2K QHD 60fps',
    },
    {
      resolution: '390 × 844',
      name: 'Mobile Retina',
      aspectRatio: '19.5:9',
      share: '6%',
      sharePercent: 6,
      targetDevice: 'OLED Smartphones',
      mediaTier: 'Super Retina HDR',
    },
    {
      resolution: '1280 × 720',
      name: '720p HD',
      aspectRatio: '16:9',
      share: '3%',
      sharePercent: 3,
      targetDevice: 'Mobile Data Saver',
      mediaTier: 'Standard HD',
    },
  ];

  // Filtered devices list
  const filteredDevices = useMemo(() => {
    return CLIENT_DEVICES_FLEET.filter((device) => {
      const matchesCategory =
        selectedCategory === 'ALL' || device.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        device.model.toLowerCase().includes(query) ||
        device.os.toLowerCase().includes(query) ||
        device.client.toLowerCase().includes(query) ||
        device.mediaTier.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const categories = ['ALL', 'Desktop', 'Mobile', 'Tablet'] as const;

  const getDeviceIcon = (category: string) => {
    switch (category) {
      case 'Desktop':
        return <Laptop className="w-4 h-4 text-neutral-400" />;
      case 'Mobile':
        return <Smartphone className="w-4 h-4 text-blue-400" />;
      case 'Tablet':
        return <Tablet className="w-4 h-4 text-amber-400" />;
      default:
        return <Monitor className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pb-12">
      <AdminHeader
        title="Devices & Platforms"
        actions={
          <div className="hidden sm:flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 px-3 py-1.5 rounded-full text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-300 font-medium">Live Fleet</span>
            <span className="w-1 h-1 rounded-full bg-neutral-600" />
            <span className="text-white font-mono font-bold">2,713 Devices</span>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6">
        {/* Row 1: KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <StatCard
            title="Desktop & Laptop"
            value="56%"
            subtitle="1,519 active devices"
            icon={Laptop}
            change="Primary fleet"
            trend="neutral"
          />
          <StatCard
            title="Mobile (iOS & Android)"
            value="36%"
            subtitle="976 active devices"
            icon={Smartphone}
            trend="up"
            change="+4% this mo"
          />
          <StatCard
            title="Tablets"
            value="8%"
            subtitle="218 active devices"
            icon={Tablet}
            trend="neutral"
            change="Stable share"
          />
          <StatCard
            title="Active Fleet"
            value="2,713"
            subtitle="Verified clients"
            icon={Monitor}
            trend="up"
            change="100% verified"
          />
        </div>

        {/* Row 2: Charts Section - Form Factor, OS, and Browsers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <DonutChart
            data={formFactorData}
            title="Hardware Form Factor"
            subtitle="Device category fleet share"
            centerLabel="Fleet"
            centerValue="100%"
          />
          <BarChart
            data={osData}
            title="Operating System Share"
            subtitle="Subscriber OS distribution"
            valueSuffix="%"
            defaultColor="#ffffff"
            height={210}
          />
          <DonutChart
            data={browserData}
            title="Browsers & Engines"
            subtitle="Web and native player share"
            centerLabel="Top Engine"
            centerValue="Chrome #1"
          />
        </div>

        {/* Row 3: Screen & Display Resolutions (Necessary Display Telemetry) */}
        <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 sm:p-5 select-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-blue-400" />
                <span>Screen &amp; Viewport Resolutions</span>
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Display formats requested by subscriber video viewports
              </p>
            </div>
            <div className="text-xs text-neutral-400 font-mono hidden sm:block">
              5 Profiles Active
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {resolutionData.map((res, i) => (
              <div
                key={i}
                className="bg-neutral-900/60 border border-neutral-800/80 rounded-lg p-3 flex flex-col justify-between hover:border-neutral-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                      {res.aspectRatio}
                    </span>
                    <span className="text-sm font-extrabold text-white font-mono">
                      {res.share}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white tracking-tight">{res.resolution}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{res.name}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-neutral-800/80 space-y-1.5">
                  <div className="w-full bg-neutral-950 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${res.sharePercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400">
                    <span className="truncate">{res.targetDevice}</span>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 truncate">
                    {res.mediaTier}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 4: Certified Client Devices & Active Platforms Fleet */}
        <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 sm:p-5 select-none">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 mb-4">
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Certified Client Devices &amp; Platform Fleet</span>
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Active hardware models verified for high-fidelity cinema playback
              </p>
            </div>

            {/* Filter Pills & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 bg-neutral-900/90 p-1 rounded-lg border border-neutral-800 overflow-x-auto custom-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-white text-black font-bold shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Filter device or OS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Responsive Table / Fleet List */}
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-left text-xs min-w-[640px] sm:min-w-0">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-semibold tracking-wider">
                  <th className="py-2.5 px-3">Device Model</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">OS Platform</th>
                  <th className="py-2.5 px-3">Client Player</th>
                  <th className="py-2.5 px-3">Playback Tier</th>
                  <th className="py-2.5 px-3">Fleet Share</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {filteredDevices.length > 0 ? (
                  filteredDevices.map((dev) => (
                    <tr
                      key={dev.id}
                      className="hover:bg-neutral-900/50 transition-colors group"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 group-hover:border-neutral-700 transition-colors">
                            {getDeviceIcon(dev.category)}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs leading-tight">
                              {dev.model}
                            </div>
                            <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                              {dev.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-900 border border-neutral-800 text-neutral-300">
                          {dev.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-300 font-medium">
                        {dev.os}
                      </td>
                      <td className="py-3 px-3 text-neutral-400 font-mono text-[11px]">
                        {dev.client}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 font-medium">
                          {dev.mediaTier}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-xs">
                            {dev.share}
                          </span>
                          <div className="w-12 bg-neutral-900 h-1.5 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className="bg-neutral-300 h-full rounded-full"
                              style={{ width: `${dev.sharePercent * 2.5}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <StatusBadge status={dev.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-neutral-500 text-xs"
                    >
                      No devices match &ldquo;{searchQuery}&rdquo; in category &ldquo;
                      {selectedCategory}&rdquo;.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

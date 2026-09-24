'use client';

import React from 'react';
import {
  MonitorSmartphone,
  Laptop,
  Smartphone,
  Tv,
  Tablet,
  Globe,
  Wifi,
  Layers,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { StatCard } from '@/components/StatCard';
import { DonutChart } from '@/components/charts/DonutChart';
import { BarChart } from '@/components/charts/BarChart';

export default function DevicesPage() {
  const formFactorData = [
    { label: 'Desktop / Laptop', value: 46, color: '#ffffff' },
    { label: 'Mobile (iOS & Android)', value: 34, color: '#3b82f6' },
    { label: 'Smart TV (Apple TV, LG, Fire)', value: 14, color: '#10b981' },
    { label: 'Tablet (iPad & Galaxy Tab)', value: 6, color: '#f59e0b' },
  ];

  const osData = [
    { label: 'Windows 11/10', value: 38 },
    { label: 'macOS Sonoma/Ventura', value: 24 },
    { label: 'iOS 17/18', value: 18 },
    { label: 'Android 14', value: 12 },
    { label: 'tvOS / webOS / FireOS', value: 8 },
  ];

  const browserData = [
    { label: 'Google Chrome', value: 58, color: '#ffffff' },
    { label: 'Apple Safari', value: 24, color: '#3b82f6' },
    { label: 'Microsoft Edge', value: 9, color: '#10b981' },
    { label: 'Mozilla Firefox', value: 6, color: '#f59e0b' },
    { label: 'Brave / Others', value: 3, color: '#6b7280' },
  ];

  const resolutionData = [
    { resolution: '3840 × 2160 (4K UHD)', share: '32%', streams: '0', trend: 'Standby' },
    { resolution: '1920 × 1080 (1080p FHD)', share: '48%', streams: '0', trend: 'Standby' },
    { resolution: '2560 × 1440 (2K QHD)', share: '11%', streams: '0', trend: 'Standby' },
    { resolution: '390 × 844 (Mobile Retina)', share: '6%', streams: '0', trend: 'Standby' },
    { resolution: '1280 × 720 (720p HD)', share: '3%', streams: '0', trend: 'Standby' },
  ];

  const connectionData = [
    { type: 'Fiber Broadband (100M+)', share: '54%', avgBitrate: '14.2 Mbps', bufferHealth: '28.4s' },
    { type: '5G Ultra-Wideband', share: '24%', avgBitrate: '11.8 Mbps', bufferHealth: '22.1s' },
    { type: '4G LTE Mobile', share: '16%', avgBitrate: '5.4 Mbps', bufferHealth: '14.8s' },
    { type: 'DSL / Fixed Wireless', share: '6%', avgBitrate: '3.8 Mbps', bufferHealth: '10.2s' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pb-12">
      <AdminHeader
        title="Client Devices & Platform Ecosystem"
        subtitle="Distribution of subscriber hardware, operating systems, web browsers, screen resolutions, and connection types"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Desktop Share"
            value="46%"
            subtitle="Largest viewing tier"
            icon={Laptop}
          />
          <StatCard
            title="Mobile Share"
            value="34%"
            subtitle="Smartphones & apps"
            trend="up"
            change="+4%"
            icon={Smartphone}
          />
          <StatCard
            title="Living Room (TV)"
            value="14%"
            subtitle="Apple TV, Fire TV, LG"
            trend="up"
            change="Fastest growing"
            icon={Tv}
          />
          <StatCard
            title="4K Capable Displays"
            value="43%"
            subtitle="HDR & Wide Gamut"
            trend="up"
            change="High Res"
            icon={Layers}
          />
        </div>

        {/* Donut & Bar Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DonutChart
            data={formFactorData}
            title="Hardware Form Factor"
            subtitle="Device category breakdown"
            centerLabel="Clients"
            centerValue="100%"
          />
          <DonutChart
            data={browserData}
            title="Browser Distribution"
            subtitle="Web streaming engine share"
            centerLabel="Browsers"
            centerValue="Chrome #1"
          />
          <BarChart
            data={osData}
            title="Operating System Share (%)"
            subtitle="Client OS environment distribution"
            valueSuffix="%"
            defaultColor="#ffffff"
            height={220}
          />
        </div>

        {/* Resolution and Connection Profiles Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Resolutions */}
          <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 sm:p-5 select-none">
            <h4 className="text-sm font-bold text-white tracking-wide mb-1">Screen Resolutions Distribution</h4>
            <p className="text-xs text-neutral-400 mb-4">Display formats requested by client video viewports</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[11px] font-semibold">
                    <th className="py-2.5 px-3">Resolution Profile</th>
                    <th className="py-2.5 px-3">Share</th>
                    <th className="py-2.5 px-3">Active Streams</th>
                    <th className="py-2.5 px-3">30d Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {resolutionData.map((r, i) => (
                    <tr key={i} className="hover:bg-neutral-900/40">
                      <td className="py-2.5 px-3 font-semibold text-white">{r.resolution}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{r.share}</td>
                      <td className="py-2.5 px-3 font-mono text-neutral-300">{r.streams}</td>
                      <td className="py-2.5 px-3 font-mono text-neutral-400">{r.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Connection Profiles */}
          <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 sm:p-5 select-none">
            <h4 className="text-sm font-bold text-white tracking-wide mb-1">Network Connection Profiles</h4>
            <p className="text-xs text-neutral-400 mb-4">Subscriber ISP link performance and average buffer depth</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[11px] font-semibold">
                    <th className="py-2.5 px-3">Connection Type</th>
                    <th className="py-2.5 px-3">Share</th>
                    <th className="py-2.5 px-3">Avg Bitrate</th>
                    <th className="py-2.5 px-3">Avg Buffer Ahead</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {connectionData.map((c, i) => (
                    <tr key={i} className="hover:bg-neutral-900/40">
                      <td className="py-2.5 px-3 font-semibold text-white flex items-center gap-2">
                        <Wifi className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{c.type}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-white">{c.share}</td>
                      <td className="py-2.5 px-3 font-mono text-emerald-400">{c.avgBitrate}</td>
                      <td className="py-2.5 px-3 font-mono text-neutral-300">{c.bufferHealth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

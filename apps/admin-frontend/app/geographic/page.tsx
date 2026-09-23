'use client';

import React from 'react';
import { Globe, MapPin, Users, Eye, Clock, Radio } from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { StatCard } from '@/components/StatCard';
import { BarChart } from '@/components/charts/BarChart';

interface CountryGeoData {
  country: string;
  flag: string;
  users: number;
  activeViewers: number;
  totalViews: string;
  totalWatchHours: string;
  topCity: string;
  bandwidthShare: string;
}

const COUNTRY_DATA: CountryGeoData[] = [
  { country: 'Bangladesh', flag: '🇧🇩', users: 48200, activeViewers: 1420, totalViews: '1.42M', totalWatchHours: '162,000', topCity: 'Dhaka', bandwidthShare: '31%' },
  { country: 'India', flag: '🇮🇳', users: 42100, activeViewers: 1190, totalViews: '1.28M', totalWatchHours: '148,000', topCity: 'Mumbai', bandwidthShare: '28%' },
  { country: 'United States', flag: '🇺🇸', users: 24800, activeViewers: 580, totalViews: '940k', totalWatchHours: '98,000', topCity: 'New York', bandwidthShare: '18%' },
  { country: 'United Kingdom', flag: '🇬🇧', users: 14200, activeViewers: 310, totalViews: '490k', totalWatchHours: '42,000', topCity: 'London', bandwidthShare: '9%' },
  { country: 'Canada', flag: '🇨🇦', users: 9800, activeViewers: 190, totalViews: '380k', totalWatchHours: '31,000', topCity: 'Toronto', bandwidthShare: '6%' },
  { country: 'United Arab Emirates', flag: '🇦🇪', users: 5400, activeViewers: 95, totalViews: '190k', totalWatchHours: '18,000', topCity: 'Dubai', bandwidthShare: '4%' },
  { country: 'Australia', flag: '🇦🇺', users: 3790, activeViewers: 57, totalViews: '140k', totalWatchHours: '12,000', topCity: 'Sydney', bandwidthShare: '4%' },
];

export default function GeographicPage() {
  const chartData = COUNTRY_DATA.map((c) => ({
    label: c.country,
    value: Math.round(c.users / 1000),
  }));

  return (
    <div className="min-h-screen bg-[#050505] pb-12">
      <AdminHeader
        title="Geographic Telemetry & Global Audience"
        subtitle="Viewer intensity, regional streaming consumption, and active concurrent connections by country and city"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Global Countries"
            value="18 Nations"
            subtitle="Active streaming coverage"
            icon={Globe}
            sparklineData={[14, 15, 16, 17, 18]}
          />
          <StatCard
            title="Top Region"
            value="South Asia"
            subtitle="59% total traffic"
            trend="up"
            change="BD + IN"
            icon={Users}
            sparklineData={[52, 54, 56, 58, 59]}
          />
          <StatCard
            title="Diaspora Streams"
            value="37% Share"
            subtitle="US, UK, CA, UAE, AU"
            trend="up"
            change="+21%"
            icon={Eye}
            sparklineData={[30, 32, 34, 35, 37]}
          />
          <StatCard
            title="Active Global Nodes"
            value="8 CDN POPs"
            subtitle="Zero packet loss"
            icon={Radio}
            sparklineData={[8, 8, 8, 8, 8]}
          />
        </div>

        {/* Bar Chart: Users by Country */}
        <BarChart
          data={chartData}
          title="Subscriber Base by Country (Thousands of Registered Users)"
          subtitle="Fictional mock subscriber distribution across international territories"
          valueSuffix="k users"
          defaultColor="#ffffff"
          height={240}
        />

        {/* Detailed Country Table */}
        <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 sm:p-5 select-none">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Regional Viewer Matrix</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Audience volume, peak city hub, and bandwidth offload by territory</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[11px] font-semibold bg-neutral-900/40">
                  <th className="py-3 px-4">Country &amp; Flag</th>
                  <th className="py-3 px-4">Total Subscribers</th>
                  <th className="py-3 px-4">Currently Live</th>
                  <th className="py-3 px-4">Stream Views</th>
                  <th className="py-3 px-4">Watch Time</th>
                  <th className="py-3 px-4">Top Hub City</th>
                  <th className="py-3 px-4">Bandwidth Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {COUNTRY_DATA.map((geo, idx) => (
                  <tr key={idx} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <span className="text-base">{geo.flag}</span>
                      <span>{geo.country}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">{geo.users.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{geo.activeViewers} live</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-300">{geo.totalViews}</td>
                    <td className="py-3 px-4 font-mono text-neutral-300">{geo.totalWatchHours} hrs</td>
                    <td className="py-3 px-4 text-neutral-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-500" />
                      <span>{geo.topCity}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full" style={{ width: geo.bandwidthShare }} />
                        </div>
                        <span className="font-mono font-bold text-neutral-300">{geo.bandwidthShare}</span>
                      </div>
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

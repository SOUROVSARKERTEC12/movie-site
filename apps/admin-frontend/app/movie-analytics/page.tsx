'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Eye,
  CheckCircle,
  Plus,
  Flame,
  Filter,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { StatCard } from '@/components/StatCard';
import { AreaChart } from '@/components/charts/AreaChart';
import { BarChart } from '@/components/charts/BarChart';
import { MOCK_MOVIES } from '@/data/mockMovies';

export default function MovieAnalyticsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Filter movies by category if selected
  const filteredMovies =
    selectedCategory === 'ALL'
      ? MOCK_MOVIES
      : MOCK_MOVIES.filter((m) => m.category === selectedCategory);

  const topMovies = [...filteredMovies]
    .sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0))
    .slice(0, 10);

  // Audience Retention Curve (Drop-off curve across typical playback runtime)
  const retentionData = [
    { label: '0% (Intro)', value: 100 },
    { label: '10m', value: 94 },
    { label: '30m', value: 89 },
    { label: '60m (Mid)', value: 85 },
    { label: '90m', value: 82 },
    { label: '120m (Climax)', value: 80 },
    { label: 'Credits (End)', value: 76 },
  ];

  // Category comparison data
  const categoryComparison = [
    { label: 'Hindi Dubbed', value: 1540 },
    { label: 'English', value: 1450 },
    { label: 'Bangla', value: 1140 },
    { label: 'Hindi Original', value: 994 },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pb-12">
      <AdminHeader
        title="Movie Analytics & Audience Retention"
        subtitle="Viewer drop-off points, completion rates, category metrics, and streaming engagement"
        actions={
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL" className="bg-neutral-950 text-neutral-400">All Categories</option>
              <option value="Hindi" className="bg-neutral-950 text-white">Hindi</option>
              <option value="English" className="bg-neutral-950 text-white">English</option>
              <option value="Bangla" className="bg-neutral-950 text-white">Bangla</option>
              <option value="Hindi Dubbed" className="bg-neutral-950 text-white">Hindi Dubbed</option>
            </select>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total Stream Views"
            value="4.82M"
            subtitle="Catalog-wide"
            trend="up"
            change="+18.4%"
            icon={Eye}
            sparklineData={[3.4, 3.8, 4.1, 4.5, 4.82]}
          />
          <StatCard
            title="Avg Completion Rate"
            value="86.8%"
            subtitle="Benchmark: &gt;75%"
            trend="up"
            change="High engagement"
            icon={CheckCircle}
            sparklineData={[80, 82, 84, 85.5, 86.8]}
          />
          <StatCard
            title="Avg Watch Duration"
            value="1h 48m"
            subtitle="Per playback session"
            icon={Clock}
            sparklineData={[95, 98, 102, 105, 108]}
          />
          <StatCard
            title="Watchlist Saves"
            value="284,100"
            subtitle="Total bookmarks"
            trend="up"
            change="+22.1%"
            icon={Plus}
            sparklineData={[210, 230, 250, 270, 284]}
          />
        </div>

        {/* Charts: Retention Curve & Category Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AreaChart
            data={retentionData}
            title="Audience Retention & Drop-Off Curve"
            subtitle="Percentage of viewers remaining from 0% (Intro) through to 100% (End Credits)"
            valuePrefix=""
            valueSuffix="%"
            color="#10b981"
            height={260}
          />
          <BarChart
            data={categoryComparison}
            title="Category Stream Volume (Thousands of Views)"
            subtitle="Cumulative stream starts across the four core catalog languages"
            valuePrefix=""
            valueSuffix="k views"
            defaultColor="#ffffff"
            height={260}
          />
        </div>

        {/* Top Titles Analytics Matrix */}
        <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 sm:p-5 select-none">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Performance Ranking: {selectedCategory === 'ALL' ? 'All Catalog' : selectedCategory}</span>
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">Top titles ranked by total views, completion percentage, and IMDb score</p>
            </div>
            <span className="text-xs font-mono text-neutral-400">Showing top 10 titles</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase font-semibold text-[11px] bg-neutral-900/40">
                  <th className="py-3 px-4">Rank &amp; Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Quality</th>
                  <th className="py-3 px-4">IMDb</th>
                  <th className="py-3 px-4">Total Views</th>
                  <th className="py-3 px-4">Completion %</th>
                  <th className="py-3 px-4">Retention Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {topMovies.map((movie, idx) => (
                  <tr key={movie.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-neutral-500 w-5">#{idx + 1}</span>
                        <div className="relative w-8 h-11 rounded overflow-hidden bg-neutral-800 flex-shrink-0 border border-neutral-700">
                          <Image src={movie.poster} alt={movie.title} fill sizes="32px" className="object-cover" />
                        </div>
                        <div>
                          <span className="font-bold text-white block">{movie.title}</span>
                          <span className="text-[11px] text-neutral-500">{movie.releaseYear} • {movie.duration}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-300 font-medium">{movie.category}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-900 border border-neutral-700 text-white">
                        {movie.quality}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-400 font-mono">{movie.rating.toFixed(1)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-white">{(movie.totalViews || 0).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${movie.completionRate}%` }} />
                        </div>
                        <span className="font-mono font-bold text-emerald-400">{movie.completionRate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {(movie.completionRate || 0) > 90 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Exceptional</span>
                      ) : (movie.completionRate || 0) > 80 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">High</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">Average</span>
                      )}
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

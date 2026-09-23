'use client';

import React from 'react';
import {
  Search,
  TrendingUp,
  AlertCircle,
  Film,
  Zap,
  CheckCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { StatCard } from '@/components/StatCard';
import { AreaChart } from '@/components/charts/AreaChart';
import {
  TOP_SEARCH_QUERIES,
  ZERO_RESULT_QUERIES,
  SEARCH_DAILY_TREND,
} from '@/data/mockSearch';

export default function SearchAnalyticsPage() {
  const dailyTrendData = SEARCH_DAILY_TREND.map((d) => ({
    label: d.day,
    value: Math.round(d.totalSearches / 1000),
    secondaryValue: Math.round(d.convertedToStream / 1000),
  }));

  return (
    <div className="min-h-screen bg-[#050505] pb-12">
      <AdminHeader
        title="Search Intelligence & Discovery Analytics"
        subtitle="Catalog search volume, keyword click-through rates, zero-result demands, and search-to-watch conversions"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total Searches Today"
            value="89,420"
            subtitle="Catalog queries"
            trend="up"
            change="+14.2%"
            icon={Search}
            sparklineData={[62, 58, 64, 71, 89]}
          />
          <StatCard
            title="Search to Watch %"
            value="76.5%"
            subtitle="Immediate stream starts"
            trend="up"
            change="High intent"
            icon={Zap}
            sparklineData={[71, 73, 74, 75, 76.5]}
          />
          <StatCard
            title="Avg Click-Through (CTR)"
            value="83.2%"
            subtitle="Result clicks"
            icon={CheckCircle}
            sparklineData={[80, 81, 82, 82.5, 83.2]}
          />
          <StatCard
            title="Zero-Result Searches"
            value="4.1%"
            subtitle="Unmet content demand"
            trend="down"
            change="Low churn"
            icon={AlertCircle}
            sparklineData={[5.8, 5.2, 4.8, 4.4, 4.1]}
          />
        </div>

        {/* Daily Search Funnel AreaChart */}
        <AreaChart
          data={dailyTrendData}
          title="Daily Search-to-Watch Conversion Funnel (Thousands)"
          subtitle="Solid white line: Total queries executed • Dashed blue line: Queries converted to active movie playback (>10 min)"
          valueSuffix="k searches"
          color="#ffffff"
          secondaryColor="#3b82f6"
          height={250}
        />

        {/* Tables Grid: Top Queries & Zero-Result Queries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Searched Keywords */}
          <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 sm:p-5 select-none">
            <h4 className="text-sm font-bold text-white tracking-wide mb-1 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-emerald-400" />
              <span>Top Searched Titles &amp; Queries</span>
            </h4>
            <p className="text-xs text-neutral-400 mb-4">Volume, match count, and direct watch conversion rate</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[11px] font-semibold">
                    <th className="py-2.5 px-3">Search Query</th>
                    <th className="py-2.5 px-3">Volume</th>
                    <th className="py-2.5 px-3">Results</th>
                    <th className="py-2.5 px-3">Watch Conversion</th>
                    <th className="py-2.5 px-3">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {TOP_SEARCH_QUERIES.map((q, i) => (
                    <tr key={i} className="hover:bg-neutral-900/40">
                      <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                        <span className="font-mono text-neutral-500 text-[11px]">#{i + 1}</span>
                        <span>{q.query}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-neutral-300">{q.searchesCount.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono text-neutral-400">{q.resultsCount} hits</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{q.watchConversionRatePct}%</td>
                      <td className="py-2.5 px-3 font-mono text-[10px]">
                        <span className={`px-1.5 py-0.5 rounded font-bold ${q.trend === 'UP' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-800 text-neutral-400'}`}>
                          {q.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Zero-Result Searches (Content Acquisition Insights) */}
          <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 sm:p-5 select-none flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Zero-Result Queries (Unmet Demand)</span>
                </h4>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  Licensing Insights
                </span>
              </div>
              <p className="text-xs text-neutral-400 mb-4">Titles frequently searched by subscribers that are currently missing from the catalog</p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[11px] font-semibold">
                      <th className="py-2.5 px-3">Requested Query</th>
                      <th className="py-2.5 px-3">Searches</th>
                      <th className="py-2.5 px-3">Inferred Category</th>
                      <th className="py-2.5 px-3">Last Query</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    {ZERO_RESULT_QUERIES.map((z, i) => (
                      <tr key={i} className="hover:bg-neutral-900/40">
                        <td className="py-2.5 px-3 font-bold text-rose-300">{z.query}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-white">{z.searchesCount.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-neutral-400">{z.categoryInferred}</td>
                        <td className="py-2.5 px-3 font-mono text-neutral-500 text-[11px]">{z.lastSearched}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-900 text-xs text-neutral-400 flex items-center justify-between">
              <span>Recommendation: Prioritize acquiring South Indian and Hollywood classic licenses.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

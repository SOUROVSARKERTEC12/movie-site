'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Layers,
  Film,
  Eye,
  Clock,
  CheckCircle,
  Users,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { StatCard } from '@/components/StatCard';
import { MOCK_MOVIES } from '@/data/mockMovies';
import { MovieCategory } from '@movie-site/shared';

interface CategoryStats {
  name: MovieCategory;
  description: string;
  totalMovies: number;
  totalViews: string;
  totalWatchHours: string;
  uniqueViewers: string;
  avgDuration: string;
  completionRate: string;
  color: string;
  borderAccent: string;
}

const CATEGORY_STATS: CategoryStats[] = [
  {
    name: 'Hindi Dubbed',
    description: 'South Indian & World Blockbusters professionally dubbed in Hindi',
    totalMovies: 13,
    totalViews: '1.54M',
    totalWatchHours: '164,200',
    uniqueViewers: '38,900',
    avgDuration: '2h 52m',
    completionRate: '93.5%',
    color: 'from-red-950/40 via-red-900/10 to-transparent',
    borderAccent: 'border-red-900/60',
  },
  {
    name: 'English',
    description: 'Hollywood Masterpieces, Sci-Fi Classics, and Academy Award Winners',
    totalMovies: 14,
    totalViews: '1.45M',
    totalWatchHours: '152,800',
    uniqueViewers: '34,200',
    avgDuration: '2h 38m',
    completionRate: '95.8%',
    color: 'from-blue-950/40 via-blue-900/10 to-transparent',
    borderAccent: 'border-blue-900/60',
  },
  {
    name: 'Bangla',
    description: 'Satyajit Ray heritage masterpieces, contemporary thrillers, and Dhaka cinema',
    totalMovies: 13,
    totalViews: '1.14M',
    totalWatchHours: '124,500',
    uniqueViewers: '29,400',
    avgDuration: '2h 18m',
    completionRate: '89.9%',
    color: 'from-emerald-950/40 via-emerald-900/10 to-transparent',
    borderAccent: 'border-emerald-900/60',
  },
  {
    name: 'Hindi',
    description: 'Bollywood cinema, inspirational biographies, and timeless classics',
    totalMovies: 14,
    totalViews: '994k',
    totalWatchHours: '112,000',
    uniqueViewers: '26,100',
    avgDuration: '2h 34m',
    completionRate: '91.8%',
    color: 'from-amber-950/40 via-amber-900/10 to-transparent',
    borderAccent: 'border-amber-900/60',
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[#050505] pb-12">
      <AdminHeader
        title="Category Intelligence & Catalog Performance"
        subtitle="In-depth analytics for Hindi, English, Bangla, and Hindi Dubbed streaming rails"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Global Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Active Categories"
            value="4 Rails"
            subtitle="Curated languages"
            icon={Layers}
            sparklineData={[4, 4, 4, 4, 4]}
          />
          <StatCard
            title="Top Streaming Rail"
            value="Hindi Dubbed"
            subtitle="1.54M views"
            trend="up"
            change="Rank #1"
            icon={Flame}
            sparklineData={[1.1, 1.25, 1.38, 1.48, 1.54]}
          />
          <StatCard
            title="Highest Retention"
            value="English (95.8%)"
            subtitle="Hollywood films"
            trend="up"
            change="Benchmark"
            icon={CheckCircle}
            sparklineData={[92, 93, 94, 95.2, 95.8]}
          />
          <StatCard
            title="Fastest Growing"
            value="Bangla (+24%)"
            subtitle="Driven by Toofan & Hawa"
            trend="up"
            change="High Velocity"
            icon={Film}
            sparklineData={[0.7, 0.82, 0.94, 1.05, 1.14]}
          />
        </div>

        {/* Detailed Category Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORY_STATS.map((cat) => {
            const categoryMovies = MOCK_MOVIES.filter((m) => m.category === cat.name)
              .sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0))
              .slice(0, 3);

            return (
              <div
                key={cat.name}
                className={`bg-[#0c0c0c] border ${cat.borderAccent} rounded-2xl p-5 sm:p-6 flex flex-col justify-between select-none relative overflow-hidden`}
              >
                {/* Background ambient gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} pointer-events-none`} />

                <div className="relative z-10 space-y-4">
                  {/* Category Title & Badge */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white">{cat.name}</h3>
                      <p className="text-xs text-neutral-400 mt-0.5">{cat.description}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-neutral-900 border border-neutral-700 text-white">
                      {cat.totalMovies} titles
                    </span>
                  </div>

                  {/* 4-Stat Metric Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                    <div className="p-2.5 bg-black/60 rounded-xl border border-neutral-800/80">
                      <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Total Views</span>
                      <span className="text-sm font-bold text-white font-mono mt-0.5 block">{cat.totalViews}</span>
                    </div>
                    <div className="p-2.5 bg-black/60 rounded-xl border border-neutral-800/80">
                      <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Watch Hours</span>
                      <span className="text-sm font-bold text-white font-mono mt-0.5 block">{cat.totalWatchHours}</span>
                    </div>
                    <div className="p-2.5 bg-black/60 rounded-xl border border-neutral-800/80">
                      <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Unique Viewers</span>
                      <span className="text-sm font-bold text-white font-mono mt-0.5 block">{cat.uniqueViewers}</span>
                    </div>
                    <div className="p-2.5 bg-black/60 rounded-xl border border-neutral-800/80">
                      <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Completion</span>
                      <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5 block">{cat.completionRate}</span>
                    </div>
                  </div>

                  {/* Top 3 Popular Movies in Category */}
                  <div className="pt-2">
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>Top 3 Popular Titles</span>
                    </p>

                    <div className="space-y-2">
                      {categoryMovies.map((movie, rank) => (
                        <div
                          key={movie.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-neutral-800/60"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-neutral-500 font-bold text-xs w-4">#{rank + 1}</span>
                            <div className="relative w-7 h-10 rounded overflow-hidden bg-neutral-800 border border-neutral-700 flex-shrink-0">
                              <Image src={movie.poster} alt={movie.title} fill sizes="28px" className="object-cover" />
                            </div>
                            <div>
                              <span className="font-bold text-white text-xs block">{movie.title}</span>
                              <span className="text-[10px] text-neutral-500">{movie.releaseYear} • {movie.quality}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-white text-xs block">{(movie.totalViews || 0).toLocaleString()}</span>
                            <span className="text-[10px] text-emerald-400 font-mono">{movie.completionRate}% finished</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Average runtime: {cat.avgDuration}</span>
                  <Link
                    href={`/movies?category=${cat.name}`}
                    className="text-xs text-neutral-300 hover:text-white flex items-center gap-1 font-semibold group"
                  >
                    <span>Manage {cat.name} Films</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

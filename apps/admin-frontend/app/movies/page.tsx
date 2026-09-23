'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Film,
  Star,
  Eye,
  CheckCircle,
  Plus,
  Play,
  Layers,
  X,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { DataTable, Column } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { StatCard } from '@/components/StatCard';
import { MOCK_MOVIES } from '@/data/mockMovies';
import { Movie } from '@movie-site/shared';

export default function MoviesPage() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const totalMovies = MOCK_MOVIES.length;
  const fourKCount = MOCK_MOVIES.filter((m) => m.quality === '4K UHD').length;
  const featuredCount = MOCK_MOVIES.filter((m) => m.status === 'Featured').length;
  const totalCatalogViews = MOCK_MOVIES.reduce((acc, m) => acc + (m.totalViews || 0), 0);

  const columns: Column<Movie>[] = [
    {
      key: 'title',
      header: 'Movie Title & Poster',
      sortable: true,
      render: (m) => (
        <div className="flex items-center gap-3 min-w-[220px]">
          <div className="relative w-10 h-14 rounded overflow-hidden bg-neutral-900 border border-neutral-800 flex-shrink-0">
            <Image
              src={m.poster}
              alt={m.title}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-xs hover:underline cursor-pointer">
                {m.title}
              </span>
              {m.status === 'Featured' && <Flame className="w-3 h-3 text-amber-400" />}
            </div>
            <p className="text-[11px] text-neutral-400">
              {m.releaseYear} • {m.duration} • Dir. {m.director}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (m) => (
        <span className="font-semibold text-neutral-200 text-xs">{m.category}</span>
      ),
    },
    {
      key: 'genre',
      header: 'Genre',
      render: (m) => (
        <div className="flex flex-wrap gap-1 max-w-[160px]">
          {m.genre.map((g) => (
            <span key={g} className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-400">
              {g}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'quality',
      header: 'Quality',
      sortable: true,
      render: (m) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold font-mono bg-neutral-900 border border-neutral-700 text-white">
          {m.quality}
        </span>
      ),
    },
    {
      key: 'rating',
      header: 'IMDb',
      sortable: true,
      render: (m) => (
        <div className="flex items-center gap-1 font-bold text-white text-xs">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{m.rating.toFixed(1)}</span>
        </div>
      ),
    },
    {
      key: 'totalViews',
      header: 'Total Views',
      sortable: true,
      render: (m) => (
        <span className="font-mono font-bold text-white text-xs">
          {(m.totalViews || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'completionRate',
      header: 'Completion',
      sortable: true,
      render: (m) => (
        <div className="flex items-center gap-2">
          <div className="w-14 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full"
              style={{ width: `${m.completionRate || 80}%` }}
            />
          </div>
          <span className="font-mono text-emerald-400 text-[11px] font-bold">
            {m.completionRate}%
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (m) => <StatusBadge status={m.status || 'Published'} />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pb-12">
      <AdminHeader
        title="Content Catalog & Movie Assets"
        subtitle="Manage 54 multi-language films, 4K UHD masters, completion metrics, and featured carousel pins"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total Catalog"
            value={totalMovies}
            subtitle="Curated full features"
            icon={Film}
            sparklineData={[42, 46, 50, 52, 54]}
          />
          <StatCard
            title="4K UHD Masters"
            value={fourKCount}
            subtitle={`${Math.round((fourKCount / totalMovies) * 100)}% of catalog`}
            trend="up"
            change="High Res"
            icon={CheckCircle}
            sparklineData={[30, 34, 38, 41, 45]}
          />
          <StatCard
            title="Featured Pins"
            value={featuredCount}
            subtitle="Hero carousel tier"
            icon={Flame}
            sparklineData={[6, 8, 9, 10, 10]}
          />
          <StatCard
            title="Catalog Views"
            value={`${(totalCatalogViews / 1000000).toFixed(1)}M`}
            subtitle="Cumulative streams"
            trend="up"
            change="+16.2%"
            icon={Eye}
            sparklineData={[28, 32, 36, 40, 44]}
          />
        </div>

        <DataTable
          columns={columns}
          data={MOCK_MOVIES}
          searchKeys={['title', 'director', 'language', 'category']}
          searchPlaceholder="Search movie by title, director, category or genre..."
          defaultSortKey="totalViews"
          defaultSortDir="desc"
          onRowClick={(movie) => setSelectedMovie(movie)}
          filters={[
            {
              label: 'Category',
              key: 'category',
              options: [
                { label: 'Hindi', value: 'Hindi' },
                { label: 'English', value: 'English' },
                { label: 'Bangla', value: 'Bangla' },
                { label: 'Hindi Dubbed', value: 'Hindi Dubbed' },
              ],
            },
            {
              label: 'Quality',
              key: 'quality',
              options: [
                { label: '4K UHD', value: '4K UHD' },
                { label: '1080p FHD', value: '1080p FHD' },
              ],
            },
            {
              label: 'Status',
              key: 'status',
              options: [
                { label: 'Featured', value: 'Featured' },
                { label: 'Published', value: 'Published' },
              ],
            },
          ]}
        />
      </div>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedMovie(null)}
          />
          <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl z-10 space-y-4">
            {/* Backdrop Header */}
            <div className="relative h-48 w-full bg-neutral-900">
              <Image
                src={selectedMovie.backdrop || selectedMovie.poster}
                alt={selectedMovie.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
              <button
                onClick={() => setSelectedMovie(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/70 border border-neutral-700 text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white drop-shadow-md">
                    {selectedMovie.title}
                  </h3>
                  <p className="text-xs text-neutral-300 font-medium mt-0.5">
                    {selectedMovie.category} • {selectedMovie.releaseYear} • {selectedMovie.duration} • {selectedMovie.quality}
                  </p>
                </div>
                <StatusBadge status={selectedMovie.status || 'Published'} />
              </div>
            </div>

            <div className="p-6 pt-0 space-y-4 text-xs">
              <p className="text-neutral-300 leading-relaxed font-medium">
                {selectedMovie.description}
              </p>

              <div className="grid grid-cols-3 gap-3 py-3 border-y border-neutral-900">
                <div className="p-3 bg-neutral-900/60 rounded-xl">
                  <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Total Streams</span>
                  <span className="text-base font-black text-white font-mono mt-0.5 block">
                    {(selectedMovie.totalViews || 0).toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-neutral-900/60 rounded-xl">
                  <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Completion Rate</span>
                  <span className="text-base font-black text-emerald-400 font-mono mt-0.5 block">
                    {selectedMovie.completionRate}%
                  </span>
                </div>
                <div className="p-3 bg-neutral-900/60 rounded-xl">
                  <span className="text-neutral-500 block text-[10px] uppercase font-semibold">IMDb Score</span>
                  <span className="text-base font-black text-amber-400 font-mono mt-0.5 block">
                    {selectedMovie.rating.toFixed(1)} / 10
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-neutral-400">
                  <strong className="text-white font-semibold">Director:</strong> {selectedMovie.director}
                </p>
                <p className="text-neutral-400">
                  <strong className="text-white font-semibold">Starring:</strong> {selectedMovie.cast.join(', ')}
                </p>
                <p className="text-neutral-400">
                  <strong className="text-white font-semibold">Video Stream:</strong>{' '}
                  <span className="font-mono text-[11px] text-neutral-300">{selectedMovie.videoUrl}</span>
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <a
                  href={`http://localhost:3000/watch/${selectedMovie.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-white text-white font-bold transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Preview in Player</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400 ml-1" />
                </a>

                <button
                  onClick={() => setSelectedMovie(null)}
                  className="px-4 py-2 rounded-xl bg-white text-black font-extrabold hover:bg-neutral-200 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

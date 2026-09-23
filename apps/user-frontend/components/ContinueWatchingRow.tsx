'use client';

import React from 'react';
import { useMovieContext } from '@/context/MovieContext';
import { getMovieById } from '@/data/movies';
import { ContinueWatchingCard } from './ContinueWatchingCard';

export const ContinueWatchingRow: React.FC = () => {
  const { continueWatching, isLoaded } = useMovieContext();

  if (!isLoaded) return null;

  const entries = Object.values(continueWatching)
    .filter((p) => p.percent > 0 && p.percent < 98)
    .sort((a, b) => b.updatedAt - a.updatedAt);

  if (entries.length === 0) return null;

  return (
    <section className="py-6 sm:py-8 border-b border-neutral-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Continue Watching
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
              Pick up where you left off
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-full border border-neutral-800">
            {entries.length} in progress
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {entries.map((progress) => {
            const movie = getMovieById(progress.movieId);
            if (!movie) return null;
            return (
              <ContinueWatchingCard
                key={progress.movieId}
                movie={movie}
                progress={progress}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

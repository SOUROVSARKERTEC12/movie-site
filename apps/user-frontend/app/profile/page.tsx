'use client';

import React from 'react';
import Link from 'next/link';
import {
  User,
  ShieldCheck,
  Bookmark,
  Play,
  RotateCcw,
  Clock,
  Sparkles,
  LogOut,
  Film,
  Trash2,
} from 'lucide-react';
import { useMovieContext } from '@/context/MovieContext';
import { getMovieById } from '@/data/movies';
import { ContinueWatchingCard } from '@/components/ContinueWatchingCard';
import { MovieCard } from '@/components/MovieCard';

export default function ProfilePage() {
  const {
    watchlist,
    continueWatching,
    history,
    clearContinueWatching,
    clearHistory,
    isLoaded,
  } = useMovieContext();

  const activeContinue = isLoaded
    ? Object.values(continueWatching)
        .filter((p) => p.percent > 0 && p.percent < 98)
        .sort((a, b) => b.updatedAt - a.updatedAt)
    : [];

  const historyMovies = isLoaded
    ? history
        .map((id) => getMovieById(id))
        .filter((m): m is NonNullable<typeof m> => !!m)
    : [];

  const watchlistMovies = isLoaded
    ? watchlist
        .slice(0, 4)
        .map((id) => getMovieById(id))
        .filter((m): m is NonNullable<typeof m> => !!m)
    : [];

  const handleResetData = () => {
    if (confirm('Reset demo user watch history and continue watching data?')) {
      clearContinueWatching();
      clearHistory();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-neutral-950 border border-neutral-900 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-600 border-2 border-white flex items-center justify-center text-white shadow-xl">
                <User className="w-10 h-10" />
              </div>
              <div className="absolute bottom-0 right-0 p-1 rounded-full bg-white text-black" title="Verified Member">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-white">Sourov Sarker</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-black uppercase">
                  VIP Cinema Pass
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">sourov@cineblack.stream</p>
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-neutral-400">
                <span>Member since Oct 2024</span>
                <span>•</span>
                <span className="text-white font-medium">Ultra HD 4K Tier</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
            <button
              onClick={() => alert('Demo session logged out.')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-neutral-900">
          <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            <span className="text-[11px] text-neutral-400 block uppercase font-medium">In Progress</span>
            <span className="text-xl sm:text-2xl font-bold text-white mt-1 block">
              {activeContinue.length}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            <span className="text-[11px] text-neutral-400 block uppercase font-medium">Watchlist</span>
            <span className="text-xl sm:text-2xl font-bold text-white mt-1 block">
              {watchlist.length}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            <span className="text-[11px] text-neutral-400 block uppercase font-medium">Titles Watched</span>
            <span className="text-xl sm:text-2xl font-bold text-white mt-1 block">
              {history.length}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            <span className="text-[11px] text-neutral-400 block uppercase font-medium">Streaming Quality</span>
            <span className="text-xl sm:text-2xl font-bold text-white mt-1 block font-mono">
              4K UHD
            </span>
          </div>
        </div>
      </div>

      {/* Continue Watching Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Continue Watching</h2>
            <p className="text-xs text-neutral-400">Resume paused movie sessions</p>
          </div>
          {activeContinue.length > 0 && (
            <button
              onClick={clearContinueWatching}
              className="text-xs text-neutral-500 hover:text-white transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {activeContinue.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeContinue.map((progress) => {
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
        ) : (
          <div className="p-8 rounded-xl bg-neutral-950 border border-neutral-900 text-center text-xs text-neutral-400">
            No active movies in progress. Start streaming any movie to resume later.
          </div>
        )}
      </div>

      {/* Watch History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Watch History</h2>
            <p className="text-xs text-neutral-400">Recently streamed cinema</p>
          </div>
          {historyMovies.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs text-neutral-500 hover:text-white transition-colors"
            >
              Clear History
            </button>
          )}
        </div>

        {historyMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {historyMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-neutral-950 border border-neutral-900 text-center text-xs text-neutral-400">
            No watch history recorded yet.
          </div>
        )}
      </div>

      {/* Watchlist Quick Peek */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Watchlist Preview</h2>
            <p className="text-xs text-neutral-400">Saved favorites</p>
          </div>
          <Link
            href="/watchlist"
            className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            View All ({watchlist.length}) →
          </Link>
        </div>

        {watchlistMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {watchlistMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-neutral-950 border border-neutral-900 text-center text-xs text-neutral-400">
            Your watchlist is currently empty.
          </div>
        )}
      </div>
    </div>
  );
}

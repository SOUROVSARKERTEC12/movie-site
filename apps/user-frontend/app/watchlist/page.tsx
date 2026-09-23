'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, Play, Trash2, ArrowRight, Film } from 'lucide-react';
import { useMovieContext } from '@/context/MovieContext';
import { getMovieById } from '@/data/movies';
import { ImageWithFallback } from '@/components/ImageWithFallback';

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist, isLoaded } = useMovieContext();

  const savedMovies = isLoaded
    ? watchlist
        .map((id) => getMovieById(id))
        .filter((m): m is NonNullable<typeof m> => !!m)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-900">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-400 mb-1">
            <Bookmark className="w-3.5 h-3.5 text-white" />
            <span>Personal Collection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            My Watchlist
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Movies you have saved to stream later across devices.
          </p>
        </div>

        <div className="text-xs font-mono text-neutral-400 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800 self-start sm:self-auto">
          {savedMovies.length} {savedMovies.length === 1 ? 'title' : 'titles'} saved
        </div>
      </div>

      {/* Grid or Empty State */}
      {savedMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {savedMovies.map((movie) => (
            <div
              key={movie.id}
              className="group relative rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800/80 hover:border-neutral-500 transition-all flex flex-col justify-between"
            >
              {/* Poster Container */}
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-900">
                <ImageWithFallback
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Quality Badge */}
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/80 text-white uppercase border border-white/20">
                  {movie.quality}
                </span>

                {/* Hover Play Button */}
                <Link
                  href={`/watch/${movie.id}`}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10"
                >
                  <div className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center pl-0.5 shadow-xl hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-black" />
                  </div>
                </Link>
              </div>

              {/* Card Meta & Remove Action */}
              <div className="p-3 bg-neutral-950 flex flex-col justify-between flex-grow">
                <div>
                  <Link
                    href={`/movie/${movie.id}`}
                    className="font-bold text-xs text-white hover:text-neutral-300 line-clamp-1"
                  >
                    {movie.title}
                  </Link>
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mt-0.5">
                    <span>{movie.releaseYear}</span>
                    <span>•</span>
                    <span>{movie.language}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-neutral-900">
                  <Link
                    href={`/watch/${movie.id}`}
                    className="text-[11px] font-bold text-white hover:underline flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Watch</span>
                  </Link>

                  <button
                    onClick={() => removeFromWatchlist(movie.id)}
                    className="p-1 rounded text-neutral-500 hover:text-white transition-colors"
                    title="Remove from Watchlist"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty Watchlist State */
        <div className="py-24 text-center rounded-2xl bg-neutral-950 border border-neutral-900 p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500 mb-4">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Your Watchlist is empty</h3>
          <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
            Explore our curated catalog of Hindi, English, Bangla, and Hindi Dubbed movies and save the ones you wish to experience.
          </p>
          <Link
            href="/movies"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-all shadow-lg"
          >
            <span>Browse Movies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

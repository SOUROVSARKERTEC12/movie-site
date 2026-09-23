'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import {
  Film,
  ArrowLeft,
  Star,
  Info,
  Plus,
  Check,
  Keyboard,
  Share2,
} from 'lucide-react';
import { getMovieById, getSimilarMovies } from '@/data/movies';
import { VideoPlayer } from '@/components/VideoPlayer';
import { MovieCard } from '@/components/MovieCard';
import { useMovieContext } from '@/context/MovieContext';

export default function WatchPage() {
  const params = useParams();
  const id = params?.id as string;
  const movie = getMovieById(id);

  const { isInWatchlist, toggleWatchlist } = useMovieContext();

  if (!movie) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <Film className="w-12 h-12 text-neutral-600 mb-4" />
        <h1 className="text-2xl font-bold text-white">Stream Not Found</h1>
        <p className="text-neutral-400 text-sm mt-2">
          The requested movie stream could not be loaded.
        </p>
        <Link
          href="/movies"
          className="mt-6 px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors"
        >
          Return to Movies
        </Link>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(movie.id);
  const upNextMovies = getSimilarMovies(movie, 4);

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Cinematic Theater Canvas */}
      <div className="w-full bg-black py-2 sm:py-6 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <VideoPlayer movie={movie} />
        </div>
      </div>

      {/* Stream Info & Next Up Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Movie Meta & Controls Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white text-black">
                    {movie.quality}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-900 border border-neutral-800 text-neutral-300">
                    {movie.language}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-neutral-300 font-bold">
                    <Star className="w-3.5 h-3.5 fill-white text-white" />
                    <span>{movie.rating.toFixed(1)}</span>
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {movie.title}
                </h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Released in {movie.releaseYear} • {movie.duration} • {movie.genre.join(', ')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <button
                  onClick={() => toggleWatchlist(movie.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    inWatchlist
                      ? 'bg-neutral-800 text-white border-white'
                      : 'bg-neutral-900 text-white border-neutral-800 hover:border-neutral-600'
                  }`}
                >
                  {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{inWatchlist ? 'Watchlist' : 'Add to List'}</span>
                </button>

                <Link
                  href={`/movie/${movie.id}`}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-600 transition-colors"
                >
                  <Info className="w-4 h-4" />
                  <span>Details</span>
                </Link>
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-neutral-500 font-bold mb-2">
                Overview
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {movie.description}
              </p>
            </div>

            {/* Cast & Director */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-500 block uppercase text-[10px]">
                  Director
                </span>
                <span className="text-white font-medium mt-0.5 block">
                  {movie.director || 'Master Director'}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block uppercase text-[10px]">
                  Cast
                </span>
                <span className="text-white font-medium mt-0.5 block">
                  {movie.cast.join(', ')}
                </span>
              </div>
            </div>

            {/* Keyboard Shortcuts Helper Guide */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-900 text-xs space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Keyboard className="w-4 h-4 text-neutral-400" />
                <span>Cinema Player Keyboard Shortcuts</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-neutral-400 pt-1">
                <div>
                  <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded font-mono text-white">
                    Space
                  </kbd>{' '}
                  Play/Pause
                </div>
                <div>
                  <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded font-mono text-white">
                    ← / →
                  </kbd>{' '}
                  ±10s Seek
                </div>
                <div>
                  <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded font-mono text-white">
                    ↑ / ↓
                  </kbd>{' '}
                  Volume
                </div>
                <div>
                  <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded font-mono text-white">
                    F / T / M
                  </kbd>{' '}
                  Full/Theater/Mute
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Up Next Queue */}
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-wider text-neutral-400 font-bold flex items-center justify-between">
              <span>Up Next For You</span>
              <span className="text-[11px] text-neutral-500 font-normal">Autoplay Ready</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {upNextMovies.map((nextMovie) => (
                <Link
                  key={nextMovie.id}
                  href={`/watch/${nextMovie.id}`}
                  className="group flex gap-3 p-2 rounded-xl bg-neutral-950 border border-neutral-900 hover:border-neutral-700 transition-all"
                >
                  <div className="relative w-24 aspect-[16/9] rounded-lg overflow-hidden bg-neutral-900 flex-shrink-0">
                    <img
                      src={nextMovie.backdrop || nextMovie.poster}
                      alt={nextMovie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1 right-1 text-[8px] font-mono px-1 rounded bg-black/80 text-white">
                      {nextMovie.quality}
                    </span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-xs font-bold text-white group-hover:text-neutral-300 line-clamp-1">
                      {nextMovie.title}
                    </h4>
                    <p className="text-[10px] text-neutral-500 mt-0.5">
                      {nextMovie.language} • {nextMovie.releaseYear}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-neutral-400 mt-1">
                      <Star className="w-3 h-3 fill-white text-white" />
                      <span>{nextMovie.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

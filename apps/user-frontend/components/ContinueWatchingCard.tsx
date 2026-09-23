'use client';

import React from 'react';
import Link from 'next/link';
import { Play, X } from 'lucide-react';
import { Movie, WatchProgress } from '@/types/movie';
import { useMovieContext } from '@/context/MovieContext';
import { ImageWithFallback } from './ImageWithFallback';

interface ContinueWatchingCardProps {
  movie: Movie;
  progress: WatchProgress;
}

export const ContinueWatchingCard: React.FC<ContinueWatchingCardProps> = ({
  movie,
  progress,
}) => {
  const { removeFromContinueWatching } = useMovieContext();

  const remainingSeconds = Math.max(0, progress.duration - progress.currentTime);
  const remainingMinutes = Math.round(remainingSeconds / 60);

  const formatRemaining = () => {
    if (remainingMinutes >= 60) {
      const h = Math.floor(remainingMinutes / 60);
      const m = remainingMinutes % 60;
      return `${h}h ${m}m remaining`;
    }
    return `${remainingMinutes}m remaining`;
  };

  return (
    <div className="group relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-all flex flex-col">
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-950">
        <ImageWithFallback
          src={movie.backdrop || movie.poster}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover / Play Overlay */}
        <Link
          href={`/watch/${movie.id}`}
          className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center transition-colors z-10"
        >
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center pl-0.5 shadow-xl group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-black" />
          </div>
        </Link>

        {/* Dismiss Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeFromContinueWatching(movie.id);
          }}
          className="absolute top-2 right-2 p-1 rounded-full bg-black/70 hover:bg-white hover:text-black text-neutral-300 transition-colors z-20"
          title="Remove from Continue Watching"
          aria-label="Remove"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Quality tag */}
        <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/80 text-white uppercase border border-white/20 z-10">
          {movie.quality}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-800 h-1.5 overflow-hidden">
        <div
          className="bg-white h-full transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{ width: `${progress.percent}%` }}
        />
      </div>

      {/* Content */}
      <div className="p-3 bg-neutral-950/90 flex items-center justify-between">
        <div className="overflow-hidden pr-2">
          <Link
            href={`/movie/${movie.id}`}
            className="font-semibold text-xs text-white hover:text-neutral-300 line-clamp-1 transition-colors"
          >
            {movie.title}
          </Link>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            {formatRemaining()}
          </p>
        </div>
        <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded">
          {progress.percent}%
        </span>
      </div>
    </div>
  );
};

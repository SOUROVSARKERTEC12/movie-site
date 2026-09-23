'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Star, Plus, Check, Info } from 'lucide-react';
import { Movie } from '@/types/movie';
import { useMovieContext } from '@/context/MovieContext';
import { ImageWithFallback } from './ImageWithFallback';

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, priority = false }) => {
  const { isInWatchlist, toggleWatchlist } = useMovieContext();
  const inWatchlist = isInWatchlist(movie.id);

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist(movie.id);
  };

  return (
    <div className="group relative rounded-xl overflow-hidden bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-500 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.9)] flex flex-col h-full">
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full block overflow-hidden bg-neutral-950">
        <Link
          href={`/movie/${movie.id}`}
          className="absolute inset-0 z-0"
          aria-label={movie.title}
        >
          <ImageWithFallback
            src={movie.poster}
            alt={movie.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-black/80 backdrop-blur-md text-white border border-white/20">
            {movie.quality}
          </span>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold bg-black/80 backdrop-blur-md text-white border border-white/20">
            <Star className="w-3 h-3 fill-white text-white" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Hover Quick Actions Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 pointer-events-none z-20">
          <div className="flex items-center justify-center gap-2 mb-2 pointer-events-auto">
            <Link
              href={`/watch/${movie.id}`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-transform active:scale-95 shadow-lg"
              title="Play Now"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Watch</span>
            </Link>

            <button
              onClick={handleWatchlistClick}
              className={`p-2 rounded-lg border transition-colors ${
                inWatchlist
                  ? 'bg-white text-black border-white'
                  : 'bg-black/80 text-white border-white/30 hover:border-white'
              }`}
              title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              aria-label="Toggle Watchlist"
            >
              {inWatchlist ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            </button>

            <Link
              href={`/movie/${movie.id}`}
              className="p-2 rounded-lg bg-black/80 text-white border border-white/30 hover:border-white transition-colors"
              title="Movie Details"
              aria-label="Movie Details"
            >
              <Info className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-3 flex flex-col flex-grow justify-between bg-neutral-950/80">
        <div>
          <Link
            href={`/movie/${movie.id}`}
            className="font-semibold text-xs text-white hover:text-neutral-300 line-clamp-1 transition-colors"
            title={movie.title}
          >
            {movie.title}
          </Link>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
            <span>{movie.releaseYear}</span>
            <span>•</span>
            <span>{movie.duration}</span>
            <span>•</span>
            <span className="text-neutral-300 font-medium">{movie.language}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2 text-[10px] text-neutral-500 overflow-hidden line-clamp-1">
          {movie.genre.slice(0, 2).join(' / ')}
        </div>
      </div>
    </div>
  );
};

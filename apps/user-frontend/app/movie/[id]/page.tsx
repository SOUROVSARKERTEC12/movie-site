'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import {
  Play,
  Plus,
  Check,
  Star,
  Clock,
  Calendar,
  Globe,
  Film,
  Sparkles,
  Share2,
  Clapperboard,
  X,
} from 'lucide-react';
import { getMovieById, getSimilarMovies } from '@/data/movies';
import { useMovieContext } from '@/context/MovieContext';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { MovieCard } from '@/components/MovieCard';

export default function MovieDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const movie = getMovieById(id);

  const { isInWatchlist, toggleWatchlist } = useMovieContext();
  const [showTrailerModal, setShowTrailerModal] = React.useState(false);

  if (!movie) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Film className="w-12 h-12 text-neutral-600 mb-4" />
        <h1 className="text-2xl font-bold text-white">Movie Not Found</h1>
        <p className="text-neutral-400 text-sm mt-2">
          The requested movie could not be located in our catalog.
        </p>
        <Link
          href="/movies"
          className="mt-6 px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(movie.id);
  const similarMovies = getSimilarMovies(movie, 6);

  return (
    <div className="pb-20 -mt-16">
      {/* Giant Backdrop Hero Section */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[78vh] min-h-[480px] max-h-[750px] overflow-hidden bg-black select-none">
        <ImageWithFallback
          src={movie.backdrop || movie.poster}
          alt={movie.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105"
        />

        {/* Gradient Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
        <div className="absolute inset-0 hero-vignette-radial opacity-60" />
      </div>

      {/* Main Details Overlay Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-44 sm:-mt-56 lg:-mt-64 relative z-20">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          {/* Poster Card (Stands out in colorful vibrance) */}
          <div className="w-48 sm:w-60 md:w-72 flex-shrink-0 mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-neutral-700 bg-neutral-900 group">
            <div className="relative aspect-[2/3] w-full">
              <ImageWithFallback
                src={movie.poster}
                alt={movie.title}
                fill
                priority
                sizes="(max-width: 768px) 240px, 288px"
                className="object-cover"
              />
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-black/80 backdrop-blur-md text-white border border-white/20">
                {movie.quality}
              </div>
            </div>
          </div>

          {/* Details Content */}
          <div className="flex-1 space-y-5 text-center md:text-left">
            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded font-extrabold text-[10px] tracking-wider uppercase bg-white text-black">
                {movie.quality}
              </span>
              <span className="px-2.5 py-0.5 rounded font-semibold text-[11px] bg-neutral-900 border border-neutral-700 text-white">
                {movie.language}
              </span>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-neutral-900 border border-neutral-700 text-white">
                <Star className="w-3.5 h-3.5 fill-white text-white" />
                <span>{movie.rating.toFixed(1)} IMDb</span>
              </div>
              <span className="text-neutral-400 text-xs flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {movie.releaseYear}
              </span>
              <span className="text-neutral-400 text-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {movie.duration}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
                {movie.title}
              </h1>
              {movie.originalTitle && (
                <p className="text-base sm:text-lg text-neutral-400 font-medium mt-1">
                  {movie.originalTitle}
                </p>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5">
              {movie.genre.map((genre) => (
                <Link
                  key={genre}
                  href={`/movies?genre=${encodeURIComponent(genre)}`}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors"
                >
                  {genre}
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <Link
                href={`/watch/${movie.id}`}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white text-black font-extrabold text-sm hover:bg-neutral-200 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.35)]"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Watch Now</span>
              </Link>

              {/* Watch Trailer Button */}
              {movie.trailerYoutubeId && (
                <button
                  onClick={() => setShowTrailerModal(true)}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm border border-neutral-700 hover:border-white transition-all active:scale-95"
                >
                  <Clapperboard className="w-4 h-4 text-white" />
                  <span>Watch Trailer</span>
                </button>
              )}

              <button
                onClick={() => toggleWatchlist(movie.id)}
                className={`flex items-center gap-2 px-5 py-3.5 rounded-full border text-sm font-semibold transition-all active:scale-95 ${
                  inWatchlist
                    ? 'bg-neutral-800 text-white border-white'
                    : 'bg-black/60 text-white border-neutral-700 hover:border-white'
                }`}
              >
                {inWatchlist ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>In Watchlist</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Watchlist</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Movie link copied to clipboard!');
                  }
                }}
                className="p-3.5 rounded-full border border-neutral-800 bg-black/60 text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors"
                title="Share Movie Link"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Synopsis */}
            <div className="pt-4 border-t border-neutral-900/80">
              <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-2">
                Synopsis
              </h3>
              <p className="text-neutral-300 leading-relaxed text-sm sm:text-base max-w-3xl">
                {movie.description}
              </p>
            </div>

            {/* Credits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 text-xs text-neutral-400">
              {movie.director && (
                <div>
                  <span className="text-neutral-500 font-medium block uppercase text-[10px] tracking-wider">
                    Director
                  </span>
                  <span className="text-white font-semibold text-sm mt-0.5 block">
                    {movie.director}
                  </span>
                </div>
              )}
              <div>
                <span className="text-neutral-500 font-medium block uppercase text-[10px] tracking-wider">
                  Cast & Crew
                </span>
                <span className="text-white font-semibold text-sm mt-0.5 block">
                  {movie.cast.join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Movies Rail */}
        {similarMovies.length > 0 && (
          <div className="mt-20 pt-10 border-t border-neutral-900">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  More Like This
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Hand-picked related titles from the CineBlack vault
                </p>
              </div>
              <Link
                href={`/movies?category=${movie.category}`}
                className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
              >
                More in {movie.language} →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {similarMovies.map((sim) => (
                <MovieCard key={sim.id} movie={sim} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* YouTube Trailer Lightbox Modal */}
      {showTrailerModal && movie.trailerYoutubeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-xl transition-opacity animate-in fade-in"
            onClick={() => setShowTrailerModal(false)}
          />

          <div className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-10 flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-900 bg-neutral-950/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-600/90 text-white flex items-center justify-center">
                  <Clapperboard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1">
                    {movie.title} — Official Trailer
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    {movie.language} • {movie.releaseYear} • {movie.quality}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowTrailerModal(false)}
                className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
                aria-label="Close trailer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${movie.trailerYoutubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={`${movie.title} YouTube Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="flex items-center justify-between px-5 py-3.5 border-t border-neutral-900 bg-neutral-950 text-xs">
              <div className="text-neutral-400 hidden sm:block">
                Stream full film in {movie.quality}
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setShowTrailerModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white transition-colors"
                >
                  Close
                </button>
                <Link
                  href={`/watch/${movie.id}`}
                  onClick={() => setShowTrailerModal(false)}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>Stream Full Film</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  Plus,
  Check,
  Info,
  Star,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  X,
  Volume2,
  Volume1,
  VolumeX,
} from 'lucide-react';
import { Movie } from '@/types/movie';
import { useMovieContext } from '@/context/MovieContext';
import { ImageWithFallback } from './ImageWithFallback';

interface HeroBannerProps {
  featuredMovies: Movie[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ featuredMovies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(80);
  const [trailerLoaded, setTrailerLoaded] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { isInWatchlist, toggleWatchlist } = useMovieContext();

  const currentMovie = featuredMovies[currentIndex] || featuredMovies[0];
  const inWatchlist = currentMovie ? isInWatchlist(currentMovie.id) : false;
  const trailerId = currentMovie?.trailerYoutubeId || 'COv52Qyctws';

  // Refs to avoid stale closures in window event listeners
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  const featuredMoviesCountRef = useRef(featuredMovies.length);
  featuredMoviesCountRef.current = featuredMovies.length;

  // Helper to send postMessage commands to YouTube IFrame API without reloading the iframe
  const sendIframeCommand = useCallback((func: string, args: (string | number)[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        '*'
      );
    }
  }, []);

  // Handshake with YouTube IFrame to initiate state and infoDelivery events
  const sendYoutubeHandshake = useCallback(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'listening' }),
        '*'
      );
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'addEventListener',
          args: ['onStateChange'],
        }),
        '*'
      );
    }
  }, []);

  // Handle Mute / Unmute Toggle smoothly via postMessage (no video restart!)
  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      const targetVol = volume > 0 ? volume : 80;
      setVolume(targetVol);
      sendIframeCommand('unMute');
      sendIframeCommand('setVolume', [targetVol]);
    } else {
      setIsMuted(true);
      sendIframeCommand('mute');
    }
  };

  // Handle Volume Slider changes
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);

    if (val === 0) {
      setIsMuted(true);
      sendIframeCommand('mute');
    } else {
      if (isMuted) {
        setIsMuted(false);
        sendIframeCommand('unMute');
      }
      sendIframeCommand('setVolume', [val]);
    }
  };

  // Handle Play / Pause background trailer
  const handleTogglePlay = () => {
    if (isTrailerPlaying) {
      setIsTrailerPlaying(false);
      sendIframeCommand('pauseVideo');
    } else {
      setIsTrailerPlaying(true);
      sendIframeCommand('playVideo');
    }
  };

  // Reset trailer load state and configure audio when slide changes
  useEffect(() => {
    setTrailerLoaded(false);
    setIsTrailerPlaying(true);

    const timer1 = setTimeout(() => {
      sendYoutubeHandshake();
    }, 400);

    const timer2 = setTimeout(() => {
      setTrailerLoaded(true);
      sendYoutubeHandshake();
      if (!isMutedRef.current) {
        sendIframeCommand('unMute');
        sendIframeCommand('setVolume', [volume]);
      }
    }, 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [currentIndex, volume, sendIframeCommand, sendYoutubeHandshake]);

  // Listen for YouTube video 'ENDED' event via window message listener:
  // - When trailer plays WITH sound (!isMuted), AFTER playing the FULL trailer, advance to next movie!
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        if (!data) return;

        // Detect YouTube Player State = 0 (ENDED)
        // YouTube sends either infoDelivery with playerState, or onStateChange event
        const isEnded =
          (data.event === 'infoDelivery' && data.info?.playerState === 0) ||
          (data.event === 'onStateChange' &&
            (data.info === 0 || data.info === '0' || data.data === 0)) ||
          data.info?.playerState === 0;

        if (isEnded) {
          // If trailer was playing with sound, advance to the next movie now that full trailer finished!
          if (!isMutedRef.current && featuredMoviesCountRef.current > 0) {
            setCurrentIndex((prev) => (prev + 1) % featuredMoviesCountRef.current);
          }
        }
      } catch {
        // Ignore non-JSON postMessages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Slide rotation timer:
  // - If played WITH sound (!isMuted): DO NOT rotate on timer; wait until full trailer finishes!
  // - If played with NO sound (isMuted): rotate with the current flow (every 25 seconds)
  useEffect(() => {
    if (!featuredMovies.length || showTrailerModal) return;

    // If sound is enabled, user is listening to the trailer -> wait for full trailer to complete!
    if (!isMuted) {
      // Safety fallback: typical trailers are 1-3 mins. If for any reason YouTube drops the ended event,
      // advance after 3.5 minutes (210s) so it never hangs indefinitely.
      const safetyFallback = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
      }, 210000);
      return () => clearTimeout(safetyFallback);
    }

    // Default flow: when playing with no sound, advance every 25 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 25000);

    return () => clearInterval(interval);
  }, [featuredMovies.length, showTrailerModal, isMuted, currentIndex]);

  if (!currentMovie) return null;

  return (
    <>
      <div className="relative w-full h-[85vh] sm:h-[82vh] lg:h-[90vh] min-h-[640px] max-h-[920px] overflow-hidden bg-black select-none">
        {/* Layer 1: High-Res Backdrop Image (Base Layer) */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={currentMovie.backdrop || currentMovie.poster}
            alt={currentMovie.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-105"
          />
        </div>

        {/* Layer 2: Autoplaying YouTube Trailer Background with exact 16:9 responsive framing */}
        {trailerId && (
          <div
            className={`absolute inset-0 z-1 overflow-hidden pointer-events-none transition-opacity duration-700 ${
              trailerLoaded && isTrailerPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative w-full h-full">
              <iframe
                ref={iframeRef}
                key={trailerId}
                src={`https://www.youtube-nocookie.com/embed/${trailerId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1`}
                title={`${currentMovie.title} Autoplay Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                onLoad={() => {
                  // Enable event listening for onStateChange
                  if (iframeRef.current?.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(
                      JSON.stringify({ event: 'listening' }),
                      '*'
                    );
                  }
                  sendIframeCommand('addEventListener', ['onStateChange']);
                  if (!isMuted) {
                    sendIframeCommand('unMute');
                    sendIframeCommand('setVolume', [volume]);
                  }
                }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 'max(100vw, 177.78vh)',
                  height: 'max(56.25vw, 100vh)',
                  minWidth: '100%',
                  minHeight: '100%',
                  transform: 'translate(-50%, -50%)',
                }}
                className="pointer-events-none border-0 transition-opacity duration-700"
              />
            </div>
          </div>
        )}

        {/* Layer 3: Cinema Vignettes & Atmospheric Overlays (Lighter for high video visibility) */}
        <div className="absolute inset-0 z-2 bg-gradient-to-r from-black/75 via-black/30 via-45% to-transparent pointer-events-none" />
        <div className="absolute inset-0 z-2 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent pointer-events-none" />

        {/* Layer 4: Top Right Floating Audio & Video Controls (Never collides with bottom buttons!) */}
        <div className="absolute top-20 sm:top-24 right-4 sm:right-6 lg:right-8 z-30">
          <div className="flex items-center gap-2 bg-black/85 backdrop-blur-md border border-neutral-700/80 px-3.5 py-1.5 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.8)]">
            {/* Mute/Unmute Icon Button */}
            <button
              onClick={handleToggleMute}
              className="p-1 text-neutral-300 hover:text-white transition-colors"
              title={isMuted ? 'Unmute Trailer (Sound On)' : 'Mute Trailer'}
              aria-label="Toggle Mute"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-neutral-400" />
              ) : volume < 50 ? (
                <Volume1 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
              )}
            </button>

            {/* Volume Slider Bar */}
            <div className="flex items-center gap-1.5">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 sm:w-20 h-1 accent-white bg-neutral-700 rounded cursor-pointer"
                title={`Volume: ${isMuted ? 'Muted' : `${volume}%`}`}
                aria-label="Trailer Volume Level"
              />
              <span className="text-[10px] font-mono text-neutral-400 w-6 text-right select-none">
                {isMuted ? 'OFF' : `${volume}%`}
              </span>
            </div>

            {!isMuted && (
              <span className="hidden md:inline-block px-1.5 py-0.5 rounded bg-red-600/80 text-[9px] font-bold text-white uppercase tracking-wider animate-pulse">
                Trailer Audio
              </span>
            )}

            <span className="w-px h-3.5 bg-neutral-700 mx-0.5" />

            {/* Play / Pause Toggle Button */}
            <button
              onClick={handleTogglePlay}
              className="p-1 rounded-full text-neutral-400 hover:text-white transition-colors"
              title={isTrailerPlaying ? 'Pause Background Trailer' : 'Resume Background Trailer'}
              aria-label="Toggle Trailer Video Playback"
            >
              {isTrailerPlaying ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
            </button>
          </div>
        </div>

        {/* Layer 5: Main Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-8 sm:pb-14 lg:pb-16 z-10">
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded font-extrabold text-[11px] tracking-wider uppercase bg-white text-black shadow-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping inline-block" />
                <span>Trailer Premiere</span>
              </span>
              <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-neutral-900/80 border border-neutral-700 text-white backdrop-blur-md">
                {currentMovie.quality}
              </span>
              <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-neutral-900/80 border border-neutral-700 text-white backdrop-blur-md">
                {currentMovie.language}
              </span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-neutral-900/80 border border-neutral-700 text-white backdrop-blur-md">
                <Star className="w-3.5 h-3.5 fill-white text-white" />
                <span>{currentMovie.rating.toFixed(1)} IMDb</span>
              </div>
              <span className="text-neutral-300 font-medium text-xs drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                {currentMovie.releaseYear} • {currentMovie.duration}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                {currentMovie.title}
              </h1>
              {currentMovie.originalTitle && (
                <p className="text-sm sm:text-base text-neutral-300 font-medium mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {currentMovie.originalTitle}
                </p>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {currentMovie.genre.map((g) => (
                <span
                  key={g}
                  className="text-[11px] font-medium text-white bg-black/50 border border-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-md"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed line-clamp-2 sm:line-clamp-3 max-w-xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] font-medium">
              {currentMovie.description}
            </p>

            {/* Cast */}
            <p className="text-xs text-neutral-300 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] hidden sm:block">
              <span className="text-neutral-400 font-semibold">Starring:</span>{' '}
              {currentMovie.cast.slice(0, 3).join(', ')}
            </p>

            {/* Action Buttons: Clean 2-column on mobile, inline-flex on larger screens */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 pt-2">
              {/* Primary Watch Now */}
              <Link
                href={`/watch/${currentMovie.id}`}
                className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-black font-extrabold text-sm hover:bg-neutral-200 transition-all active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.4)]"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Watch Full Movie</span>
              </Link>

              {/* Watch Fullscreen Trailer Modal */}
              <button
                onClick={() => setShowTrailerModal(true)}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm border border-neutral-700 hover:border-white backdrop-blur-md transition-all active:scale-95 shadow-lg group"
                title="Watch Full Trailer in Lightbox"
              >
                <Clapperboard className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span>Expand Trailer</span>
              </button>

              {/* Add to Watchlist */}
              <button
                onClick={() => toggleWatchlist(currentMovie.id)}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full border text-xs sm:text-sm font-semibold backdrop-blur-md transition-all active:scale-95 ${
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
                    <span>Watchlist</span>
                  </>
                )}
              </button>

              {/* Details Link */}
              <Link
                href={`/movie/${currentMovie.id}`}
                className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:py-3 rounded-full border border-neutral-800 bg-black/40 text-neutral-300 hover:text-white hover:border-neutral-600 backdrop-blur-md text-xs sm:text-sm font-medium transition-colors"
              >
                <Info className="w-4 h-4" />
                <span>Details</span>
              </Link>
            </div>
          </div>

          {/* Slide Pagination & Arrows (Neatly aligned at the bottom right) */}
          <div className="mt-4 sm:mt-0 sm:absolute sm:right-6 lg:sm:right-8 sm:bottom-14 lg:sm:bottom-16 flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t border-neutral-900/60 sm:border-0">
            <span className="text-[11px] font-mono text-neutral-400 sm:hidden">
              {currentIndex + 1} of {featuredMovies.length}
            </span>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                {featuredMovies.map((m, idx) => (
                  <button
                    key={m.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`transition-all rounded-full ${
                      idx === currentIndex
                        ? 'w-7 h-2 bg-white'
                        : 'w-2 h-2 bg-neutral-600 hover:bg-neutral-400'
                    }`}
                    aria-label={`Jump to movie ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1 ml-1">
                <button
                  onClick={() =>
                    setCurrentIndex(
                      (prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length
                    )
                  }
                  className="p-1.5 rounded-full border border-neutral-800 bg-black/60 text-white hover:bg-white hover:text-black transition-colors"
                  aria-label="Previous featured movie"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length)
                  }
                  className="p-1.5 rounded-full border border-neutral-800 bg-black/60 text-white hover:bg-white hover:text-black transition-colors"
                  aria-label="Next featured movie"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic YouTube Trailer Lightbox Modal */}
      {showTrailerModal && (
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
                    {currentMovie.title} — Official Trailer
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    {currentMovie.language} • {currentMovie.releaseYear} • {currentMovie.quality}
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
                src={`https://www.youtube-nocookie.com/embed/${trailerId}?autoplay=1&rel=0&modestbranding=1`}
                title={`${currentMovie.title} YouTube Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="flex items-center justify-between px-5 py-3.5 border-t border-neutral-900 bg-neutral-950 text-xs">
              <div className="text-neutral-400 hidden sm:block">
                Stream full film in {currentMovie.quality} with Dolby Audio
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setShowTrailerModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white transition-colors"
                >
                  Close
                </button>
                <Link
                  href={`/watch/${currentMovie.id}`}
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
    </>
  );
};

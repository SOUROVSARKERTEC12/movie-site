'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  Settings,
  Subtitles,
  ArrowLeft,
  Tv,
  Check,
  Sparkles,
} from 'lucide-react';
import { Movie } from '@/types/movie';
import { useMovieContext } from '@/context/MovieContext';

interface VideoPlayerProps {
  movie: Movie;
  initialTime?: number;
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
const VIDEO_QUALITIES = ['4K UHD', '1080p FHD', '720p HD', 'Auto'];

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  movie,
  initialTime = 0,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { updateWatchProgress, continueWatching } = useMovieContext();

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [selectedQuality, setSelectedQuality] = useState('1080p FHD');
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'main' | 'speed' | 'quality'>('main');
  const [showControls, setShowControls] = useState(true);
  const [hoverSeekTime, setHoverSeekTime] = useState<number | null>(null);
  const [hoverSeekPos, setHoverSeekPos] = useState<number>(0);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [showCenterFeedback, setShowCenterFeedback] = useState<'play' | 'pause' | null>(null);

  // Resume time from saved progress if available
  useEffect(() => {
    const saved = continueWatching[movie.id];
    const resumeTime = initialTime || (saved ? saved.currentTime : 0);

    if (videoRef.current && resumeTime > 0) {
      videoRef.current.currentTime = resumeTime;
      setCurrentTime(resumeTime);
    }
  }, [movie.id]);

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    const pad = (n: number) => n.toString().padStart(2, '0');
    if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
    return `${pad(m)}:${pad(s)}`;
  };

  // Sync controls visibility
  const triggerActivity = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        if (!showSettings) {
          setShowControls(false);
        }
      }, 3500);
    }
  };

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setShowCenterFeedback('play');
        setTimeout(() => setShowCenterFeedback(null), 600);
      }).catch(console.error);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowCenterFeedback('pause');
      setTimeout(() => setShowCenterFeedback(null), 600);
    }
    triggerActivity();
  }, [isPlaying]);

  // Forward / Backward
  const seekRelative = useCallback((seconds: number) => {
    if (!videoRef.current) return;
    const newTime = Math.min(Math.max(videoRef.current.currentTime + seconds, 0), duration);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    triggerActivity();
  }, [duration]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(console.error);
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(console.error);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'arrowleft':
          e.preventDefault();
          seekRelative(-10);
          break;
        case 'arrowright':
          e.preventDefault();
          seekRelative(10);
          break;
        case 'arrowup':
          e.preventDefault();
          setVolume((v) => {
            const next = Math.min(1, v + 0.1);
            if (videoRef.current) videoRef.current.volume = next;
            setIsMuted(false);
            return next;
          });
          triggerActivity();
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume((v) => {
            const next = Math.max(0, v - 0.1);
            if (videoRef.current) videoRef.current.volume = next;
            return next;
          });
          triggerActivity();
          break;
        case 'm':
          e.preventDefault();
          setIsMuted((m) => {
            const next = !m;
            if (videoRef.current) videoRef.current.muted = next;
            return next;
          });
          triggerActivity();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 't':
          e.preventDefault();
          setIsTheaterMode((t) => !t);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seekRelative]);

  // Video Events
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setCurrentTime(current);

    // Update buffer
    if (videoRef.current.buffered.length > 0) {
      setBufferedEnd(videoRef.current.buffered.end(videoRef.current.buffered.length - 1));
    }

    // Save progress periodically (e.g. every 5 seconds)
    if (Math.floor(current) % 5 === 0 && duration > 0) {
      updateWatchProgress(movie.id, current, duration);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || movie.durationSeconds);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  const handleSeekMouseMove = (e: React.MouseEvent<HTMLInputElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    setHoverSeekTime(percent * duration);
    setHoverSeekPos(e.clientX - rect.left);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettings(false);
    setSettingsTab('main');
  };

  const changeQuality = (q: string) => {
    setSelectedQuality(q);
    setShowSettings(false);
    setSettingsTab('main');
  };

  // Demo dynamic subtitles
  const getSubtitlesText = () => {
    if (!subtitlesEnabled) return null;
    const t = Math.floor(currentTime);
    if (t % 18 >= 0 && t % 18 <= 5) {
      return `[${movie.language}] Audio commentary & dialogue soundtrack`;
    }
    if (t % 18 >= 6 && t % 18 <= 11) {
      return `${movie.title} • Directed by ${movie.director || 'Master Cinema'}`;
    }
    if (t % 18 >= 12 && t % 18 <= 16) {
      return `Starring ${movie.cast.slice(0, 2).join(' & ')}`;
    }
    return null;
  };

  const subtitleText = getSubtitlesText();

  return (
    <div
      ref={containerRef}
      onMouseMove={triggerActivity}
      onClick={() => setShowSettings(false)}
      className={`relative bg-black select-none overflow-hidden transition-all duration-300 ${
        isTheaterMode
          ? 'w-full h-[90vh] max-h-[950px]'
          : 'w-full max-w-6xl mx-auto aspect-video rounded-2xl border border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.9)]'
      }`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={movie.videoUrl}
        poster={movie.backdrop}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          updateWatchProgress(movie.id, duration, duration);
        }}
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
        playsInline
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Pulsing Feedback Animation on Center Play/Pause */}
      {showCenterFeedback && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="w-20 h-20 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center animate-ping">
            {showCenterFeedback === 'play' ? (
              <Play className="w-8 h-8 fill-white ml-1" />
            ) : (
              <Pause className="w-8 h-8 fill-white" />
            )}
          </div>
        </div>
      )}

      {/* Subtitles Overlay */}
      {subtitleText && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center pointer-events-none z-20 px-4 text-center">
          <span className="bg-black/80 backdrop-blur-sm text-white px-4 py-1.5 rounded-lg text-sm sm:text-base font-semibold shadow-lg border border-white/10 tracking-wide">
            {subtitleText}
          </span>
        </div>
      )}

      {/* Controls Overlay (Fade in/out) */}
      <div
        className={`absolute inset-0 flex flex-col justify-between p-4 sm:p-6 transition-opacity duration-300 pointer-events-none ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: showControls
            ? 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 30%, transparent 60%, rgba(0,0,0,0.85) 100%)'
            : 'none',
        }}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
            <Link
              href={`/movie/${movie.id}`}
              className="p-2 rounded-full bg-black/70 hover:bg-white hover:text-black text-white transition-colors border border-white/10"
              title="Return to Movie Details"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h3 className="text-white font-bold text-sm sm:text-base drop-shadow-md line-clamp-1">
                {movie.title}
              </h3>
              <p className="text-[11px] text-neutral-400">
                {movie.language} • {movie.releaseYear} • {movie.quality}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white text-black">
              {selectedQuality}
            </span>
          </div>
        </div>

        {/* Bottom Controls Bar */}
        <div className="space-y-3 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          {/* Seek Bar + Hover Tooltip */}
          <div className="relative group/seeker">
            {hoverSeekTime !== null && (
              <div
                className="absolute -top-8 px-2 py-0.5 rounded bg-black/90 border border-neutral-700 text-white text-[11px] font-mono pointer-events-none transform -translate-x-1/2"
                style={{ left: `${hoverSeekPos}px` }}
              >
                {formatTime(hoverSeekTime)}
              </div>
            )}

            {/* Buffer bar background */}
            <div className="relative w-full h-2 rounded overflow-hidden bg-white/20">
              <div
                className="absolute top-0 bottom-0 left-0 bg-white/30"
                style={{
                  width: `${duration > 0 ? (bufferedEnd / duration) * 100 : 0}%`,
                }}
              />
              <div
                className="absolute top-0 bottom-0 left-0 bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]"
                style={{
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                }}
              />
            </div>

            {/* Interactive Slider Input */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeekChange}
              onMouseMove={handleSeekMouseMove}
              onMouseLeave={() => setHoverSeekTime(null)}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-4 -top-1"
              aria-label="Seek Video"
            />
          </div>

          {/* Control Buttons Cluster */}
          <div className="flex items-center justify-between">
            {/* Left buttons: Play/Pause, Seek 10s, Volume, Time */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="p-2 rounded-full bg-white text-black hover:bg-neutral-200 transition-transform active:scale-95 shadow-md"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-black" />
                ) : (
                  <Play className="w-5 h-5 fill-black pl-0.5" />
                )}
              </button>

              {/* Backward 10s */}
              <button
                onClick={() => seekRelative(-10)}
                className="p-2 text-neutral-300 hover:text-white transition-colors"
                title="Rewind 10 seconds"
                aria-label="Rewind 10 seconds"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Forward 10s */}
              <button
                onClick={() => seekRelative(10)}
                className="p-2 text-neutral-300 hover:text-white transition-colors"
                title="Forward 10 seconds"
                aria-label="Forward 10 seconds"
              >
                <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2 group/volume">
                <button
                  onClick={toggleMute}
                  className="p-1.5 text-neutral-300 hover:text-white transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5 text-neutral-400" />
                  ) : volume < 0.5 ? (
                    <Volume1 className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <div className="w-16 sm:w-20 hidden group-hover/volume:block">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.02}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1"
                    aria-label="Volume slider"
                  />
                </div>
              </div>

              {/* Time display */}
              <div className="text-[11px] sm:text-xs font-mono text-neutral-300 tracking-wider">
                <span>{formatTime(currentTime)}</span>
                <span className="text-neutral-500 mx-1">/</span>
                <span className="text-neutral-400">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right buttons: Subtitles, Settings, Theater Mode, Fullscreen */}
            <div className="flex items-center gap-1.5 sm:gap-3 relative">
              {/* Subtitles toggle */}
              <button
                onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  subtitlesEnabled
                    ? 'text-white bg-neutral-800'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title={subtitlesEnabled ? 'Disable Subtitles' : 'Enable Subtitles'}
                aria-label="Subtitles"
              >
                <Subtitles className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Settings Menu Trigger */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSettings(!showSettings);
                    setSettingsTab('main');
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    showSettings
                      ? 'text-white bg-neutral-800'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Playback Settings"
                  aria-label="Settings"
                >
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Settings Dropdown Popover */}
                {showSettings && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 bottom-12 w-52 sm:w-60 rounded-xl bg-neutral-950/95 border border-neutral-800 p-2 shadow-2xl text-xs backdrop-blur-md z-40 space-y-1"
                  >
                    {settingsTab === 'main' && (
                      <>
                        <div className="px-3 py-2 border-b border-neutral-900 font-semibold text-neutral-300">
                          Playback Settings
                        </div>
                        <button
                          onClick={() => setSettingsTab('speed')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-neutral-900 text-neutral-300 hover:text-white"
                        >
                          <span>Speed</span>
                          <span className="font-mono text-neutral-400">
                            {playbackSpeed === 1 ? 'Normal' : `${playbackSpeed}x`} →
                          </span>
                        </button>
                        <button
                          onClick={() => setSettingsTab('quality')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-neutral-900 text-neutral-300 hover:text-white"
                        >
                          <span>Quality</span>
                          <span className="font-mono text-neutral-400">
                            {selectedQuality} →
                          </span>
                        </button>
                      </>
                    )}

                    {settingsTab === 'speed' && (
                      <>
                        <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-900 font-semibold text-neutral-300">
                          <button
                            onClick={() => setSettingsTab('main')}
                            className="text-neutral-400 hover:text-white"
                          >
                            ← Back
                          </button>
                          <span>Playback Speed</span>
                        </div>
                        <div className="py-1">
                          {PLAYBACK_SPEEDS.map((s) => (
                            <button
                              key={s}
                              onClick={() => changeSpeed(s)}
                              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-neutral-900 text-neutral-300 hover:text-white"
                            >
                              <span>{s === 1.0 ? '1.0x (Normal)' : `${s}x`}</span>
                              {playbackSpeed === s && <Check className="w-3.5 h-3.5 text-white" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {settingsTab === 'quality' && (
                      <>
                        <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-900 font-semibold text-neutral-300">
                          <button
                            onClick={() => setSettingsTab('main')}
                            className="text-neutral-400 hover:text-white"
                          >
                            ← Back
                          </button>
                          <span>Quality</span>
                        </div>
                        <div className="py-1">
                          {VIDEO_QUALITIES.map((q) => (
                            <button
                              key={q}
                              onClick={() => changeQuality(q)}
                              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-neutral-900 text-neutral-300 hover:text-white"
                            >
                              <span>{q}</span>
                              {selectedQuality === q && <Check className="w-3.5 h-3.5 text-white" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Theater Mode toggle */}
              <button
                onClick={() => setIsTheaterMode(!isTheaterMode)}
                className={`p-2 rounded-lg transition-colors hidden sm:block ${
                  isTheaterMode
                    ? 'text-white bg-neutral-800'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title={isTheaterMode ? 'Standard View' : 'Theater Mode (T)'}
                aria-label="Theater Mode"
              >
                <Tv className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Fullscreen toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-2 text-neutral-300 hover:text-white transition-colors"
                title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
                aria-label="Fullscreen"
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

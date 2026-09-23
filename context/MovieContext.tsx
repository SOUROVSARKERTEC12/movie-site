'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { WatchProgress } from '@/types/movie';

interface MovieContextType {
  watchlist: string[];
  continueWatching: Record<string, WatchProgress>;
  history: string[];
  isLoaded: boolean;
  addToWatchlist: (id: string) => void;
  removeFromWatchlist: (id: string) => void;
  toggleWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
  updateWatchProgress: (id: string, currentTime: number, duration: number) => void;
  removeFromContinueWatching: (id: string) => void;
  clearContinueWatching: () => void;
  addToHistory: (id: string) => void;
  clearHistory: () => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

const WATCHLIST_KEY = 'cinemablack_watchlist';
const CONTINUE_KEY = 'cinemablack_continue_watching';
const HISTORY_KEY = 'cinemablack_history';

// Default initial continue watching items for a rich demo experience
const INITIAL_CONTINUE: Record<string, WatchProgress> = {
  'hindi-jawan': {
    movieId: 'hindi-jawan',
    currentTime: 3650,
    duration: 10140,
    percent: 36,
    updatedAt: Date.now() - 3600000 * 2,
  },
  'eng-inception': {
    movieId: 'eng-inception',
    currentTime: 5400,
    duration: 8880,
    percent: 61,
    updatedAt: Date.now() - 3600000 * 5,
  },
  'dub-rrr': {
    movieId: 'dub-rrr',
    currentTime: 2400,
    duration: 11220,
    percent: 21,
    updatedAt: Date.now() - 3600000 * 24,
  },
};

const INITIAL_WATCHLIST = ['eng-interstellar', 'ban-hawa', 'dub-kgf-2', 'hindi-stree-2'];
const INITIAL_HISTORY = ['eng-dark-knight', 'ban-aynabaji', 'hindi-3-idiots'];

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<string[]>(INITIAL_WATCHLIST);
  const [continueWatching, setContinueWatching] =
    useState<Record<string, WatchProgress>>(INITIAL_CONTINUE);
  const [history, setHistory] = useState<string[]>(INITIAL_HISTORY);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedWatchlist = localStorage.getItem(WATCHLIST_KEY);
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      } else {
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(INITIAL_WATCHLIST));
      }

      const savedContinue = localStorage.getItem(CONTINUE_KEY);
      if (savedContinue) {
        setContinueWatching(JSON.parse(savedContinue));
      } else {
        localStorage.setItem(CONTINUE_KEY, JSON.stringify(INITIAL_CONTINUE));
      }

      const savedHistory = localStorage.getItem(HISTORY_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      } else {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(INITIAL_HISTORY));
      }
    } catch (e) {
      console.warn('LocalStorage access warning:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const addToWatchlist = (id: string) => {
    setWatchlist((prev) => {
      if (prev.includes(id)) return prev;
      const next = [id, ...prev];
      try {
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const removeFromWatchlist = (id: string) => {
    setWatchlist((prev) => {
      const next = prev.filter((item) => item !== id);
      try {
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const toggleWatchlist = (id: string) => {
    if (watchlist.includes(id)) {
      removeFromWatchlist(id);
    } else {
      addToWatchlist(id);
    }
  };

  const isInWatchlist = (id: string) => {
    return watchlist.includes(id);
  };

  const updateWatchProgress = (id: string, currentTime: number, duration: number) => {
    if (!duration || duration <= 0) return;
    const percent = Math.min(100, Math.round((currentTime / duration) * 100));

    setContinueWatching((prev) => {
      const next = {
        ...prev,
        [id]: {
          movieId: id,
          currentTime,
          duration,
          percent,
          updatedAt: Date.now(),
        },
      };
      try {
        localStorage.setItem(CONTINUE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    // Also add to watch history
    addToHistory(id);
  };

  const removeFromContinueWatching = (id: string) => {
    setContinueWatching((prev) => {
      const next = { ...prev };
      delete next[id];
      try {
        localStorage.setItem(CONTINUE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const clearContinueWatching = () => {
    setContinueWatching({});
    try {
      localStorage.removeItem(CONTINUE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const addToHistory = (id: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item !== id);
      const next = [id, ...filtered].slice(0, 30);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <MovieContext.Provider
      value={{
        watchlist,
        continueWatching,
        history,
        isLoaded,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        isInWatchlist,
        updateWatchProgress,
        removeFromContinueWatching,
        clearContinueWatching,
        addToHistory,
        clearHistory,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
};

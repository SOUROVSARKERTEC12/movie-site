'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon, Film, X, Sparkles } from 'lucide-react';
import { MOVIES, CATEGORIES, ALL_GENRES } from '@/data/movies';
import { MovieCard } from '@/components/MovieCard';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  const filteredMovies = useMemo(() => {
    return MOVIES.filter((movie) => {
      // Category filter
      if (selectedCategory !== 'all' && movie.category !== selectedCategory) {
        return false;
      }

      // Genre filter
      if (selectedGenre !== 'All' && !movie.genre.includes(selectedGenre)) {
        return false;
      }

      // Query filter
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const inTitle = movie.title.toLowerCase().includes(q);
        const inOriginal = movie.originalTitle?.toLowerCase().includes(q);
        const inDirector = movie.director?.toLowerCase().includes(q);
        const inCast = movie.cast.some((c) => c.toLowerCase().includes(q));
        const inGenre = movie.genre.some((g) => g.toLowerCase().includes(q));
        const inYear = movie.releaseYear.toString().includes(q);

        return inTitle || inOriginal || inDirector || inCast || inGenre || inYear;
      }

      return true;
    });
  }, [query, selectedCategory, selectedGenre]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
          Search the Cinema Vault
        </h1>
        <p className="text-sm text-neutral-400">
          Find titles, directors, actors, or genres across Hindi, English, Bangla, and Hindi Dubbed movies.
        </p>

        {/* Big Search Bar */}
        <div className="relative mt-6">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by movie title, star cast, director..."
            autoFocus
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white text-base shadow-2xl transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
          <span className="text-neutral-500">Popular searches:</span>
          {['Shah Rukh Khan', 'Christopher Nolan', 'Chanchal Chowdhury', 'Action', 'Sci-Fi', '2024'].map(
            (term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors"
              >
                {term}
              </button>
            )
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-white text-black'
                : 'text-neutral-400 hover:text-white bg-neutral-900'
            }`}
          >
            All Languages
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-white text-black'
                  : 'text-neutral-400 hover:text-white bg-neutral-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-neutral-400 font-mono self-end sm:self-auto">
          {filteredMovies.length} {filteredMovies.length === 1 ? 'title' : 'titles'} matching
        </div>
      </div>

      {/* Results Grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center rounded-2xl bg-neutral-950 border border-neutral-900 p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500 mb-4">
            <Film className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No movies found</h3>
          <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
            We couldn't find any titles matching &ldquo;{query}&rdquo;. Check your spelling or try exploring by categories.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => {
                setQuery('');
                setSelectedCategory('all');
                setSelectedGenre('All');
              }}
              className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors"
            >
              Clear Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-neutral-400">
          Loading search vault...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

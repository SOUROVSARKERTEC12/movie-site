'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MOVIES } from '@/data/movies';
import { MovieCard } from '@/components/MovieCard';
import { FilterBar } from '@/components/FilterBar';
import { Film, Sparkles } from 'lucide-react';

function MoviesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSort = searchParams.get('sort') || 'rating';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState(initialSort);

  // Sync category if query param changes
  React.useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const filteredMovies = useMemo(() => {
    return MOVIES.filter((movie) => {
      // Category match
      if (selectedCategory !== 'all' && movie.category !== selectedCategory) {
        return false;
      }

      // Genre match
      if (selectedGenre !== 'All' && !movie.genre.includes(selectedGenre)) {
        return false;
      }

      // Search match (title, cast, director)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = movie.title.toLowerCase().includes(q);
        const matchesOriginal = movie.originalTitle?.toLowerCase().includes(q);
        const matchesCast = movie.cast.some((c) => c.toLowerCase().includes(q));
        const matchesDirector = movie.director?.toLowerCase().includes(q);
        const matchesGenre = movie.genre.some((g) => g.toLowerCase().includes(q));

        if (!matchesTitle && !matchesOriginal && !matchesCast && !matchesDirector && !matchesGenre) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'year-desc') return b.releaseYear - a.releaseYear;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'popular') {
        const aScore = (a.isPopular ? 2 : 0) + (a.isTrending ? 1 : 0);
        const bScore = (b.isPopular ? 2 : 0) + (b.isTrending ? 1 : 0);
        return bScore - aScore || b.rating - a.rating;
      }
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedGenre, sortBy]);

  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case 'hindi':
        return 'Hindi Cinema (Bollywood)';
      case 'english':
        return 'English & Hollywood Cinema';
      case 'bangla':
        return 'Bangla Masterpieces';
      case 'hindi-dubbed':
        return 'Hindi Dubbed Blockbusters';
      default:
        return 'Complete Movie Catalog';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-400 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Curated Streaming Vault</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {getCategoryTitle()}
        </h1>
        <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
          Browse through high-definition titles, filter by category and genre, or sort to find your next favorite film.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mb-8 p-4 sm:p-6 rounded-2xl bg-neutral-950 border border-neutral-900 shadow-xl">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalResults={filteredMovies.length}
        />
      </div>

      {/* Movies Grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-2xl bg-neutral-950/60 border border-neutral-900 p-8">
          <div className="w-14 h-14 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-400 mb-4">
            <Film className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No films match your criteria</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms, changing the category, or clearing your active filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedGenre('All');
            }}
            className="mt-5 px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-neutral-400">
          Loading movie catalog...
        </div>
      }
    >
      <MoviesContent />
    </Suspense>
  );
}

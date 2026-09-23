import {
  MOVIES,
  getTrendingMovies,
  getPopularMovies,
  getLatestMovies,
  getMoviesByCategory,
} from '@/data/movies';
import { HeroBanner } from '@/components/HeroBanner';
import { MovieRow } from '@/components/MovieRow';
import { ContinueWatchingRow } from '@/components/ContinueWatchingRow';

export default function HomePage() {
  const featured = [
    MOVIES.find((m) => m.id === 'hindi-jawan')!,
    MOVIES.find((m) => m.id === 'eng-oppenheimer')!,
    MOVIES.find((m) => m.id === 'ban-hawa')!,
    MOVIES.find((m) => m.id === 'dub-rrr')!,
  ].filter(Boolean);

  const trending = getTrendingMovies();
  const popular = getPopularMovies();
  const latest = getLatestMovies();

  const hindiMovies = getMoviesByCategory('hindi');
  const englishMovies = getMoviesByCategory('english');
  const banglaMovies = getMoviesByCategory('bangla');
  const hindiDubbedMovies = getMoviesByCategory('hindi-dubbed');

  return (
    <div className="pb-16 -mt-16">
      {/* Hero Spotlight */}
      <HeroBanner featuredMovies={featured} />

      {/* Main Content Rails */}
      <div className="space-y-2 sm:space-y-4">
        {/* Continue Watching Section (if active) */}
        <ContinueWatchingRow />

        {/* Trending Rail */}
        <MovieRow
          title="Trending Now"
          subtitle="Top stream choices this week"
          movies={trending}
          exploreHref="/movies?sort=rating"
        />

        {/* Popular Movies */}
        <MovieRow
          title="Popular Across All Languages"
          subtitle="Critically acclaimed fan favorites"
          movies={popular}
          exploreHref="/movies?sort=popular"
        />

        {/* Hindi Cinema Row */}
        <MovieRow
          title="Hindi Cinema"
          subtitle="Bollywood chartbusters and acclaimed dramas"
          movies={hindiMovies}
          exploreHref="/movies?category=hindi"
        />

        {/* English Cinema Row */}
        <MovieRow
          title="English & Hollywood"
          subtitle="Sci-Fi epics, blockbusters, and masterpieces"
          movies={englishMovies}
          exploreHref="/movies?category=english"
        />

        {/* Latest Releases */}
        <MovieRow
          title="Latest Releases"
          subtitle="Fresh additions to the CineBlack theater"
          movies={latest}
          exploreHref="/movies?sort=year-desc"
        />

        {/* Bangla Masterpieces Row */}
        <MovieRow
          title="Bangla Masterpieces"
          subtitle="Dhallywood thrillers, art-house classics & river epics"
          movies={banglaMovies}
          exploreHref="/movies?category=bangla"
        />

        {/* Hindi Dubbed Row */}
        <MovieRow
          title="Hindi Dubbed Pan-India"
          subtitle="High-octane spectacles and regional powerhouses"
          movies={hindiDubbedMovies}
          exploreHref="/movies?category=hindi-dubbed"
        />
      </div>
    </div>
  );
}

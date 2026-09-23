import { SearchQueryStat, ZeroResultQuery } from '@movie-site/shared';

export const TOP_SEARCH_QUERIES: SearchQueryStat[] = [
  { query: 'Jawan', searchesCount: 48920, resultsCount: 4, clickThroughRatePct: 82.4, watchConversionRatePct: 71.8, trend: 'UP' },
  { query: 'Oppenheimer', searchesCount: 42100, resultsCount: 3, clickThroughRatePct: 85.1, watchConversionRatePct: 74.2, trend: 'UP' },
  { query: 'Toofan', searchesCount: 39400, resultsCount: 2, clickThroughRatePct: 88.0, watchConversionRatePct: 79.4, trend: 'UP' },
  { query: 'Pushpa 2', searchesCount: 36800, resultsCount: 2, clickThroughRatePct: 91.2, watchConversionRatePct: 83.1, trend: 'UP' },
  { query: 'Interstellar', searchesCount: 31200, resultsCount: 1, clickThroughRatePct: 79.8, watchConversionRatePct: 68.5, trend: 'STABLE' },
  { query: 'Hawa', searchesCount: 28400, resultsCount: 2, clickThroughRatePct: 84.6, watchConversionRatePct: 75.0, trend: 'DOWN' },
  { query: 'KGF 2', searchesCount: 25900, resultsCount: 3, clickThroughRatePct: 80.2, watchConversionRatePct: 69.4, trend: 'STABLE' },
  { query: '12th Fail', searchesCount: 24100, resultsCount: 1, clickThroughRatePct: 89.4, watchConversionRatePct: 81.2, trend: 'UP' },
  { query: 'The Dark Knight', searchesCount: 22000, resultsCount: 2, clickThroughRatePct: 76.5, watchConversionRatePct: 64.2, trend: 'STABLE' },
  { query: 'Animal', searchesCount: 19800, resultsCount: 2, clickThroughRatePct: 74.1, watchConversionRatePct: 62.0, trend: 'DOWN' },
];

export const ZERO_RESULT_QUERIES: ZeroResultQuery[] = [
  { query: 'Dhuruvangal Pathinaaru', searchesCount: 8420, categoryInferred: 'Tamil Thriller', lastSearched: '12 mins ago' },
  { query: 'Shutter Island', searchesCount: 7100, categoryInferred: 'Hollywood Mystery', lastSearched: '24 mins ago' },
  { query: 'Chander Pahar', searchesCount: 6340, categoryInferred: 'Bangla Adventure', lastSearched: '1 hour ago' },
  { query: 'Fight Club', searchesCount: 5890, categoryInferred: 'Hollywood Drama', lastSearched: '45 mins ago' },
  { query: 'Vikram Vedha Tamil', searchesCount: 4920, categoryInferred: 'Tamil Original', lastSearched: '2 hours ago' },
  { query: 'Kantara 2', searchesCount: 4610, categoryInferred: 'Kannada/Upcoming', lastSearched: '3 hours ago' },
  { query: 'The Matrix 4K', searchesCount: 3980, categoryInferred: 'Hollywood Sci-Fi', lastSearched: '1 hour ago' },
  { query: 'Moner Manush', searchesCount: 3410, categoryInferred: 'Bangla Classic', lastSearched: '4 hours ago' },
];

export const SEARCH_DAILY_TREND = [
  { day: 'Mon', totalSearches: 62400, convertedToStream: 44200 },
  { day: 'Tue', totalSearches: 58900, convertedToStream: 41800 },
  { day: 'Wed', totalSearches: 64100, convertedToStream: 46900 },
  { day: 'Thu', totalSearches: 71200, convertedToStream: 52100 },
  { day: 'Fri', totalSearches: 89400, convertedToStream: 68400 },
  { day: 'Sat', totalSearches: 112000, convertedToStream: 89600 },
  { day: 'Sun', totalSearches: 104500, convertedToStream: 83200 },
];

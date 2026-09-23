import { MovieCategory, MovieQuality } from './types';

export const MOVIE_CATEGORIES: MovieCategory[] = [
  'Hindi',
  'English',
  'Bangla',
  'Hindi Dubbed',
];

export const MOVIE_QUALITIES: MovieQuality[] = [
  '4K UHD',
  '1080p FHD',
  '720p HD',
  'HDR',
];

export const CDN_REGIONS = [
  { code: 'iad1', name: 'US East (Virginia)', city: 'Ashburn' },
  { code: 'sfo1', name: 'US West (San Jose)', city: 'San Jose' },
  { code: 'lhr1', name: 'Europe (London)', city: 'London' },
  { code: 'fra1', name: 'Europe (Frankfurt)', city: 'Frankfurt' },
  { code: 'bom1', name: 'Asia South (Mumbai)', city: 'Mumbai' },
  { code: 'dac1', name: 'Asia South (Dhaka)', city: 'Dhaka' },
  { code: 'sin1', name: 'Asia SE (Singapore)', city: 'Singapore' },
  { code: 'syd1', name: 'Oceania (Sydney)', city: 'Sydney' },
];

export const STATUS_COLORS = {
  HEALTHY: {
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  WARNING: {
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-400',
  },
  ERROR: {
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    dot: 'bg-rose-400',
  },
  INFO: {
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    dot: 'bg-blue-400',
  },
};

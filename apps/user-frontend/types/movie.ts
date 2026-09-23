export type MovieCategory = 'hindi' | 'english' | 'bangla' | 'hindi-dubbed';

export type MovieQuality = '4K UHD' | '1080p FHD' | '720p HD';

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  description: string;
  poster: string;
  backdrop: string;
  genre: string[];
  releaseYear: number;
  rating: number; // e.g., 8.8
  duration: string; // e.g., "2h 49m"
  durationSeconds: number; // for video progress calculation
  language: string; // e.g., "Hindi", "English", "Bengali"
  category: MovieCategory;
  quality: MovieQuality;
  videoUrl: string; // Sample/demo MP4 video source
  trailerUrl?: string; // YouTube trailer URL
  trailerYoutubeId?: string; // YouTube video ID for embed
  director?: string;
  cast: string[];
  isTrending?: boolean;
  isPopular?: boolean;
  isLatest?: boolean;
}

export interface WatchProgress {
  movieId: string;
  currentTime: number;
  duration: number;
  percent: number;
  updatedAt: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  membership: string;
  joinedDate: string;
}

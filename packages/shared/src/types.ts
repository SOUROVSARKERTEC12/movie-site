export type MovieCategory = 'Hindi' | 'English' | 'Bangla' | 'Hindi Dubbed' | string;

export type MovieQuality = '4K UHD' | '1080p FHD' | '720p HD' | 'HDR';

export interface CategoryModel {
  id: string;
  name: string;
  slug: string;
  description: string;
  subcategories: string[];
  color?: string;
  borderAccent?: string;
  isCustom?: boolean;
}

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  description: string;
  category: MovieCategory;
  subcategory?: string;
  genre: string[];
  releaseYear: number;
  rating: number;
  duration: string;
  language: string;
  quality: MovieQuality;
  poster: string;
  backdrop: string;
  videoUrl: string;
  trailerUrl?: string;
  trailerYoutubeId?: string;
  director: string;
  cast: string[];
  trending?: boolean;
  featured?: boolean;
  totalViews?: number;
  completionRate?: number; // 0-100%
  status?: 'Published' | 'Draft' | 'Featured' | 'Archived';
}

export interface WatchProgress {
  movieId: string;
  currentTime: number;
  duration: number;
  updatedAt: number;
}

export type UserRole = 'admin' | 'super_admin' | 'user';
export type UserSubscriptionTier = 'Free' | 'Standard HD' | 'Premium 4K' | 'Family VIP';
export type UserStatus = 'Active' | 'Inactive' | 'Suspended' | 'VIP';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  registrationDate: string;
  lastActive: string;
  status: UserStatus;
  totalWatchTimeHours: number;
  moviesWatchedCount: number;
  currentDevice: string;
  location: {
    country: string;
    city: string;
    flag: string;
  };
  ipAddress: string;
  currentSessionId?: string;
  preferences?: {
    preferredQuality: MovieQuality;
    subtitlesEnabled: boolean;
    autoplayNext: boolean;
  };
}

export type ActivityEventType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'MOVIE_OPENED'
  | 'MOVIE_STARTED'
  | 'MOVIE_PAUSED'
  | 'MOVIE_RESUMED'
  | 'MOVIE_COMPLETED'
  | 'MOVIE_ABANDONED'
  | 'SEARCH_PERFORMED'
  | 'WATCHLIST_ADD'
  | 'WATCHLIST_REMOVE'
  | 'CATEGORY_VIEWED'
  | 'QUALITY_CHANGED'
  | 'SPEED_CHANGED'
  | 'SUBTITLE_TOGGLED'
  | 'FULLSCREEN_TOGGLED'
  | 'SESSION_START'
  | 'SESSION_END';

export interface UserActivityEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userAvatar: string;
  eventType: ActivityEventType;
  contentTitle?: string;
  contentId?: string;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  sessionId: string;
  metadata?: Record<string, string | number | boolean>;
}

export type BufferHealthStatus = 'Optimal' | 'Adequate' | 'Critical' | 'Rebuffering';
export type StreamConnectionStatus = 'Stable' | 'Buffering' | 'Reconnecting' | 'Degraded';

export interface LiveSession {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  movieTitle: string;
  moviePoster: string;
  category: MovieCategory;
  sessionDurationSeconds: number;
  currentPositionSeconds: number;
  totalDurationSeconds: number;
  device: string;
  browser: string;
  os: string;
  location: string;
  currentQuality: MovieQuality;
  resolution: string;
  bitrateMbps: number;
  bufferHealthSeconds: number;
  bufferStatus: BufferHealthStatus;
  connectionStatus: StreamConnectionStatus;
  lastHeartbeat: string;
}

export interface StreamingTelemetrySummary {
  activeStreamingSessions: number;
  concurrentViewersPeak: number;
  playbackStartsToday: number;
  playbackFailuresToday: number;
  bufferingEventsToday: number;
  avgStartupTimeMs: number;
  rebufferingRatePct: number;
  avgBitrateMbps: number;
  completionRatePct: number;
  avgBufferHealthSec: number;
  qualityBreakdown: {
    quality: string;
    percentage: number;
    streamCount: number;
  }[];
  cdnRegions: {
    region: string;
    status: 'Healthy' | 'Warning' | 'Error';
    cacheHitRatioPct: number;
    latencyMs: number;
    activeSessions: number;
  }[];
}

export interface SystemHealthMetrics {
  apiStatus: 'Healthy' | 'Degraded' | 'Down';
  apiLatencyP50Ms: number;
  apiLatencyP95Ms: number;
  apiLatencyP99Ms: number;
  apiRequestCount24h: number;
  errorRatePct: number;
  serverCpuPct: number;
  serverMemoryPct: number;
  dbStatus: 'Healthy' | 'Slow' | 'Down';
  dbResponseTimeMs: number;
  cacheStatus: 'Healthy' | 'Degraded';
  redisHitRatePct: number;
  redisMemoryUsedMb: number;
  redisMemoryTotalMb: number;
  cdnStatus: 'Healthy' | 'Warning';
  activeWebsocketConnections: number;
  activeBackgroundTranscodeJobs: number;
  storageUsedTb: number;
  storageTotalTb: number;
}

export interface SystemEventLog {
  id: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'ERROR';
  component: string;
  message: string;
  resolved: boolean;
}

export interface SearchQueryStat {
  query: string;
  searchesCount: number;
  resultsCount: number;
  clickThroughRatePct: number;
  watchConversionRatePct: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface ZeroResultQuery {
  query: string;
  searchesCount: number;
  categoryInferred: string;
  lastSearched: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  resource: string;
  ipAddress: string;
  result: 'SUCCESS' | 'FAILED';
  details: string;
}

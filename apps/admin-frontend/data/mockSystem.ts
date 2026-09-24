import { SystemHealthMetrics, SystemEventLog } from '@movie-site/shared';

export const MOCK_SYSTEM_HEALTH: SystemHealthMetrics = {
  apiStatus: 'Healthy',
  apiLatencyP50Ms: 0,
  apiLatencyP95Ms: 0,
  apiLatencyP99Ms: 0,
  apiRequestCount24h: 0,
  errorRatePct: 0.0,
  serverCpuPct: 0.0,
  serverMemoryPct: 0.0,
  dbStatus: 'Healthy',
  dbResponseTimeMs: 0.0,
  cacheStatus: 'Healthy',
  redisHitRatePct: 100.0,
  redisMemoryUsedMb: 0,
  redisMemoryTotalMb: 4096,
  cdnStatus: 'Healthy',
  activeWebsocketConnections: 0,
  activeBackgroundTranscodeJobs: 0,
  storageUsedTb: 0.0,
  storageTotalTb: 50.0,
};

// Initialized as clean empty state, ready for cluster event log ingestion
export const MOCK_SYSTEM_LOGS: SystemEventLog[] = [];

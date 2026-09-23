import { StreamingTelemetrySummary } from '@movie-site/shared';

export const MOCK_TELEMETRY_SUMMARY: StreamingTelemetrySummary = {
  activeStreamingSessions: 3842,
  concurrentViewersPeak: 5920,
  playbackStartsToday: 68420,
  playbackFailuresToday: 94,
  bufferingEventsToday: 182,
  avgStartupTimeMs: 412,
  rebufferingRatePct: 0.28,
  avgBitrateMbps: 9.4,
  completionRatePct: 78.4,
  avgBufferHealthSec: 24.2,
  qualityBreakdown: [
    { quality: '4K UHD (2160p)', percentage: 32, streamCount: 1229 },
    { quality: '1080p Full HD', percentage: 48, streamCount: 1844 },
    { quality: '720p HD', percentage: 16, streamCount: 615 },
    { quality: '480p SD', percentage: 4, streamCount: 154 },
  ],
  cdnRegions: [
    { region: 'US East (Ashburn)', status: 'Healthy', cacheHitRatioPct: 96.8, latencyMs: 14, activeSessions: 840 },
    { region: 'US West (San Jose)', status: 'Healthy', cacheHitRatioPct: 95.4, latencyMs: 18, activeSessions: 610 },
    { region: 'Europe (Frankfurt)', status: 'Healthy', cacheHitRatioPct: 97.1, latencyMs: 22, activeSessions: 540 },
    { region: 'Europe (London)', status: 'Healthy', cacheHitRatioPct: 96.2, latencyMs: 19, activeSessions: 490 },
    { region: 'Asia South (Mumbai)', status: 'Healthy', cacheHitRatioPct: 93.8, latencyMs: 28, activeSessions: 720 },
    { region: 'Asia South (Dhaka)', status: 'Healthy', cacheHitRatioPct: 94.2, latencyMs: 24, activeSessions: 390 },
    { region: 'Asia SE (Singapore)', status: 'Healthy', cacheHitRatioPct: 95.0, latencyMs: 31, activeSessions: 180 },
    { region: 'Oceania (Sydney)', status: 'Healthy', cacheHitRatioPct: 92.5, latencyMs: 44, activeSessions: 72 },
  ],
};

export interface HourlyTelemetryPoint {
  time: string;
  concurrentViewers: number;
  avgBitrateMbps: number;
  startupTimeMs: number;
  rebufferingRatePct: number;
  errorsCount: number;
}

export const HOURLY_TELEMETRY_SERIES: HourlyTelemetryPoint[] = [
  { time: '00:00', concurrentViewers: 2840, avgBitrateMbps: 9.8, startupTimeMs: 405, rebufferingRatePct: 0.22, errorsCount: 3 },
  { time: '02:00', concurrentViewers: 1920, avgBitrateMbps: 9.9, startupTimeMs: 395, rebufferingRatePct: 0.18, errorsCount: 1 },
  { time: '04:00', concurrentViewers: 1450, avgBitrateMbps: 10.1, startupTimeMs: 380, rebufferingRatePct: 0.15, errorsCount: 0 },
  { time: '06:00', concurrentViewers: 1890, avgBitrateMbps: 9.7, startupTimeMs: 410, rebufferingRatePct: 0.20, errorsCount: 2 },
  { time: '08:00', concurrentViewers: 2410, avgBitrateMbps: 9.5, startupTimeMs: 420, rebufferingRatePct: 0.24, errorsCount: 4 },
  { time: '10:00', concurrentViewers: 3120, avgBitrateMbps: 9.3, startupTimeMs: 430, rebufferingRatePct: 0.26, errorsCount: 5 },
  { time: '12:00', concurrentViewers: 3890, avgBitrateMbps: 9.1, startupTimeMs: 445, rebufferingRatePct: 0.30, errorsCount: 8 },
  { time: '14:00', concurrentViewers: 4200, avgBitrateMbps: 9.2, startupTimeMs: 438, rebufferingRatePct: 0.28, errorsCount: 6 },
  { time: '16:00', concurrentViewers: 4680, avgBitrateMbps: 9.0, startupTimeMs: 450, rebufferingRatePct: 0.32, errorsCount: 9 },
  { time: '18:00', concurrentViewers: 5340, avgBitrateMbps: 8.8, startupTimeMs: 462, rebufferingRatePct: 0.35, errorsCount: 14 },
  { time: '20:00', concurrentViewers: 5920, avgBitrateMbps: 8.6, startupTimeMs: 480, rebufferingRatePct: 0.41, errorsCount: 18 },
  { time: '22:00', concurrentViewers: 4980, avgBitrateMbps: 9.1, startupTimeMs: 440, rebufferingRatePct: 0.31, errorsCount: 10 },
];

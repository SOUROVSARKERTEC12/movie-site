import { LiveSession } from '@movie-site/shared';
import { MOCK_MOVIES } from './mockMovies';
import { MOCK_USERS } from './mockUsers';

const BROWSERS = ['Chrome 128', 'Safari 17.4', 'Firefox 130', 'Edge 128', 'Brave 1.69'];
const RESOLUTIONS: Record<string, string> = {
  '4K UHD': '3840×2160',
  '1080p FHD': '1920×1080',
  '720p HD': '1280×720',
};

export function generateLiveSessions(): LiveSession[] {
  const sessions: LiveSession[] = [];
  const activeUsers = MOCK_USERS.filter((u) => u.status === 'Active' || u.status === 'VIP').slice(0, 42);

  activeUsers.forEach((user, idx) => {
    const movie = MOCK_MOVIES[(idx * 7) % MOCK_MOVIES.length];
    const quality = user.preferences?.preferredQuality || '1080p FHD';
    const resolution = RESOLUTIONS[quality] || '1920×1080';
    const bitrateMbps = quality === '4K UHD' ? 14.8 + (idx % 5) * 0.4 : quality === '1080p FHD' ? 7.2 + (idx % 4) * 0.3 : 3.8;
    
    // Elapsed time calculation
    const totalDurationSeconds = 7200 + (idx % 6) * 600;
    const sessionDurationSeconds = 300 + (idx * 210) % 5400;
    const currentPositionSeconds = (sessionDurationSeconds * 1.05) % totalDurationSeconds;

    // Buffer status
    const bufRand = (idx * 11) % 100;
    const bufferHealthSeconds = bufRand < 75 ? 24 + (idx % 12) : bufRand < 90 ? 12 + (idx % 6) : 3.5;
    const bufferStatus = bufferHealthSeconds > 18 ? 'Optimal' : bufferHealthSeconds > 8 ? 'Adequate' : 'Critical';
    const connectionStatus = bufferStatus === 'Critical' ? 'Buffering' : 'Stable';

    sessions.push({
      id: `ses_live_${1000 + idx}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      movieTitle: movie.title,
      moviePoster: movie.poster,
      category: movie.category,
      sessionDurationSeconds,
      currentPositionSeconds,
      totalDurationSeconds,
      device: user.currentDevice,
      browser: BROWSERS[idx % BROWSERS.length],
      os: user.currentDevice.includes('Mac') || user.currentDevice.includes('Apple') ? 'macOS / tvOS' : user.currentDevice.includes('Windows') ? 'Windows 11' : 'Android / iOS',
      location: `${user.location.city}, ${user.location.country}`,
      currentQuality: quality,
      resolution,
      bitrateMbps: Math.round(bitrateMbps * 10) / 10,
      bufferHealthSeconds: Math.round(bufferHealthSeconds * 10) / 10,
      bufferStatus,
      connectionStatus,
      lastHeartbeat: `${(idx % 15) + 1}s ago`,
    });
  });

  return sessions;
}

export const INITIAL_LIVE_SESSIONS = generateLiveSessions();

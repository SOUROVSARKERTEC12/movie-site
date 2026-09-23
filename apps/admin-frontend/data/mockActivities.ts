import { UserActivityEvent, ActivityEventType } from '@movie-site/shared';
import { MOCK_USERS } from './mockUsers';
import { MOCK_MOVIES } from './mockMovies';

const EVENT_TYPES: ActivityEventType[] = [
  'LOGIN',
  'MOVIE_STARTED',
  'MOVIE_PAUSED',
  'MOVIE_RESUMED',
  'MOVIE_COMPLETED',
  'MOVIE_ABANDONED',
  'SEARCH_PERFORMED',
  'WATCHLIST_ADD',
  'WATCHLIST_REMOVE',
  'CATEGORY_VIEWED',
  'QUALITY_CHANGED',
  'SPEED_CHANGED',
  'SUBTITLE_TOGGLED',
  'FULLSCREEN_TOGGLED',
  'LOGOUT',
];

const BROWSERS = ['Chrome 128', 'Safari 17', 'Firefox 130', 'Edge 128', 'Brave'];

export function generateActivities(): UserActivityEvent[] {
  const events: UserActivityEvent[] = [];
  const now = Date.now();

  for (let i = 0; i < 220; i++) {
    const user = MOCK_USERS[(i * 3) % MOCK_USERS.length];
    const movie = MOCK_MOVIES[(i * 7) % MOCK_MOVIES.length];
    const eventType = EVENT_TYPES[(i * 5) % EVENT_TYPES.length];
    
    // Stagger timestamps across past 48 hours
    const minutesAgo = i * 11 + (i % 7) * 3;
    const eventTime = new Date(now - minutesAgo * 60 * 1000).toISOString();

    let metadata: Record<string, string | number | boolean> = {};
    if (eventType === 'QUALITY_CHANGED') {
      metadata = { from: '1080p FHD', to: '4K UHD', bitrateMbps: 14.8 };
    } else if (eventType === 'SPEED_CHANGED') {
      metadata = { playbackRate: (i % 2 === 0 ? 1.25 : 1.5) };
    } else if (eventType === 'SUBTITLE_TOGGLED') {
      metadata = { enabled: i % 2 === 0, language: 'English [CC]' };
    } else if (eventType === 'MOVIE_PAUSED' || eventType === 'MOVIE_RESUMED') {
      metadata = { timestamp: '00:48:12', bufferSec: 22.4 };
    } else if (eventType === 'MOVIE_COMPLETED') {
      metadata = { watchDurationMinutes: 148, completedCredits: true };
    } else if (eventType === 'SEARCH_PERFORMED') {
      metadata = { query: movie.title.split(' ')[0], resultsFound: 6 };
    } else if (eventType === 'CATEGORY_VIEWED') {
      metadata = { category: movie.category };
    }

    events.push({
      id: `act_${10000 + i}`,
      timestamp: eventTime,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      eventType,
      contentTitle: eventType.includes('MOVIE') || eventType.includes('WATCHLIST') ? movie.title : undefined,
      contentId: eventType.includes('MOVIE') || eventType.includes('WATCHLIST') ? movie.id : undefined,
      device: user.currentDevice,
      browser: BROWSERS[i % BROWSERS.length],
      os: user.currentDevice.includes('Mac') || user.currentDevice.includes('Apple') ? 'macOS' : user.currentDevice.includes('Windows') ? 'Windows 11' : 'Android / iOS',
      ipAddress: user.ipAddress,
      location: `${user.location.city}, ${user.location.country}`,
      sessionId: `ses_${9000 + (i % 80)}`,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    });
  }

  return events;
}

export const MOCK_ACTIVITIES = generateActivities();

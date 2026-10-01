import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { uuidv7 } from 'uuidv7';

export const admins = sqliteTable('admins', {
  id: text('id').primaryKey().$defaultFn(() => uuidv7()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const movies = sqliteTable('movies', {
  id: text('id').primaryKey().$defaultFn(() => uuidv7()),
  title: text('title').notNull(),
  originalTitle: text('original_title'),
  description: text('description').notNull(),
  category: text('category').notNull(),
  subcategory: text('subcategory'),
  releaseYear: integer('release_year').notNull(),
  rating: real('rating').notNull(),
  duration: text('duration').notNull(), // e.g., "2h 15m" or just minutes
  language: text('language').notNull(),
  quality: text('quality').notNull(),
  poster: text('poster'),
  backdrop: text('backdrop'),
  videoUrl: text('video_url'),
  trailerUrl: text('trailer_url'),
  trailerYoutubeId: text('trailer_youtube_id'),
  director: text('director').notNull(),
  status: text('status').default('Draft'), // 'Published', 'Draft', 'Featured', 'Archived'
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => uuidv7()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('user'),
  status: text('status').notNull().default('Active'),
  totalWatchTimeHours: integer('total_watch_time_hours').default(0),
  moviesWatchedCount: integer('movies_watched_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey().$defaultFn(() => uuidv7()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  color: text('color'),
  isCustom: integer('is_custom', { mode: 'boolean' }).default(false),
});

export const storagePaths = sqliteTable('storage_paths', {
  id: text('id').primaryKey().$defaultFn(() => uuidv7()),
  name: text('name').notNull(),
  path: text('path').notNull().unique(),
  maxLimitGb: integer('max_limit_gb').notNull(),
  usedGb: real('used_gb').default(0),
});

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey().$defaultFn(() => uuidv7()),
  actor: text('actor').notNull(),
  actorRole: text('actor_role').notNull(),
  action: text('action').notNull(),
  resource: text('resource').notNull(),
  ipAddress: text('ip_address').notNull(),
  result: text('result').notNull(), // 'SUCCESS' | 'FAILED'
  details: text('details').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const userActivities = sqliteTable('user_activities', {
  id: text('id').primaryKey().$defaultFn(() => uuidv7()),
  userId: text('user_id').notNull(),
  userName: text('user_name').notNull(),
  eventType: text('event_type').notNull(),
  contentTitle: text('content_title'),
  contentId: text('content_id'),
  device: text('device'),
  browser: text('browser'),
  os: text('os'),
  ipAddress: text('ip_address'),
  location: text('location'),
  sessionId: text('session_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

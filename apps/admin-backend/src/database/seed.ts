import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { count } from 'drizzle-orm';

export async function seedDatabase(dbUrl: string = './dev.db') {
  const sqlite = new Database(dbUrl);
  const db = drizzle(sqlite, { schema });

  // 1. Seed Super Admin
  const [adminCount] = await db.select({ count: count() }).from(schema.admins);
  if (!adminCount || adminCount.count === 0) {
    console.log('Seeding Super Admin...');
    await db.insert(schema.admins).values({
      name: 'Super Admin',
      email: 'admin@cineblack.com',
      passwordHash: 'password123',
    });
  }

  // 2. Seed Default Categories
  const [catCount] = await db.select({ count: count() }).from(schema.categories);
  if (!catCount || catCount.count === 0) {
    console.log('Seeding Categories...');
    await db.insert(schema.categories).values([
      {
        name: 'Hindi',
        slug: 'hindi',
        description: 'Bollywood & Hindi Cinema',
        color: '#E50914',
        isCustom: false,
      },
      {
        name: 'English',
        slug: 'english',
        description: 'Hollywood & International Cinema',
        color: '#3B82F6',
        isCustom: false,
      },
      {
        name: 'Bangla',
        slug: 'bangla',
        description: 'Tollywood & Regional Bengali Films',
        color: '#10B981',
        isCustom: false,
      },
      {
        name: 'Hindi Dubbed',
        slug: 'hindi-dubbed',
        description: 'International Blockbusters Dubbed in Hindi',
        color: '#F59E0B',
        isCustom: false,
      },
    ]);
  }

  // 3. Seed Storage Paths
  const [pathCount] = await db.select({ count: count() }).from(schema.storagePaths);
  if (!pathCount || pathCount.count === 0) {
    console.log('Seeding Storage Paths...');
    await db.insert(schema.storagePaths).values([
      {
        name: 'Primary SAN Storage',
        path: '/mnt/storage/primary',
        maxLimitGb: 5000,
        usedGb: 1240.5,
      },
      {
        name: 'Fast Edge NVMe',
        path: '/mnt/storage/edge-cache',
        maxLimitGb: 1000,
        usedGb: 380.2,
      },
      {
        name: 'Archive Cold Tier',
        path: '/mnt/storage/archive-cold',
        maxLimitGb: 10000,
        usedGb: 4820.0,
      },
    ]);
  }

  // 4. Seed Initial Movies
  const [movieCount] = await db.select({ count: count() }).from(schema.movies);
  if (!movieCount || movieCount.count === 0) {
    console.log('Seeding Initial Movies...');
    await db.insert(schema.movies).values([
      {
        title: 'Jawan',
        description: 'A high-octane action thriller outlining the emotional journey of a man who is set out to rectify the wrongs in the society.',
        category: 'Hindi',
        releaseYear: 2023,
        rating: 7.0,
        duration: '2h 49m',
        language: 'Hindi',
        quality: '4K UHD',
        poster: 'https://image.tmdb.org/t/p/w500/jBWRLn1jXyqW9Wb3N10Q4gU6vI0.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/8YFL5QQVPy3AgrEQxNYvsgiPEbe.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        director: 'Atlee',
        status: 'Featured',
      },
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        category: 'English',
        releaseYear: 2010,
        rating: 8.8,
        duration: '2h 28m',
        language: 'English',
        quality: '4K UHD',
        poster: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        director: 'Christopher Nolan',
        status: 'Published',
      },
      {
        title: 'Hawa',
        description: 'The story revolves around a group of fishermen in the deep sea who catch a strange fish-like creature in their net.',
        category: 'Bangla',
        releaseYear: 2022,
        rating: 8.0,
        duration: '2h 11m',
        language: 'Bangla',
        quality: '1080p FHD',
        poster: 'https://image.tmdb.org/t/p/w500/tL61M2G8BfN8s0aUuYc58q7c1P7.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/tL61M2G8BfN8s0aUuYc58q7c1P7.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        director: 'Mejbaur Rahman Sumon',
        status: 'Published',
      },
    ]);
  }

  // 5. Seed Initial Users
  const [userCount] = await db.select({ count: count() }).from(schema.users);
  if (!userCount || userCount.count === 0) {
    console.log('Seeding Initial Users...');
    await db.insert(schema.users).values([
      {
        name: 'Alex Mercer',
        email: 'alex.mercer@example.com',
        role: 'user',
        status: 'Active',
        totalWatchTimeHours: 42,
        moviesWatchedCount: 18,
      },
      {
        name: 'Sophia Chen',
        email: 'sophia.chen@example.com',
        role: 'user',
        status: 'Active',
        totalWatchTimeHours: 89,
        moviesWatchedCount: 37,
      },
      {
        name: 'Rahim Ahmed',
        email: 'rahim.ahmed@example.com',
        role: 'user',
        status: 'Active',
        totalWatchTimeHours: 12,
        moviesWatchedCount: 5,
      },
    ]);
  }

  // 6. Seed Initial Audit Log
  const [auditCount] = await db.select({ count: count() }).from(schema.auditLogs);
  if (!auditCount || auditCount.count === 0) {
    console.log('Seeding Audit Log...');
    await db.insert(schema.auditLogs).values([
      {
        actor: 'System Bootstrap',
        actorRole: 'system',
        action: 'SYSTEM_INITIALIZE',
        resource: '/database',
        ipAddress: '127.0.0.1',
        result: 'SUCCESS',
        details: 'Initial database schema and seeds created.',
      },
    ]);
  }

  // 7. Seed Initial User Activities
  const [actCount] = await db.select({ count: count() }).from(schema.userActivities);
  if (!actCount || actCount.count === 0) {
    console.log('Seeding User Activities...');
    await db.insert(schema.userActivities).values([
      {
        userId: 'usr_root_001',
        userName: 'Sourov Sarker',
        eventType: 'MOVIE_STARTED',
        contentTitle: 'Jawan',
        contentId: 'hindi-1',
        device: 'MacBook Pro 16"',
        browser: 'Chrome 128',
        os: 'macOS Sonoma',
        ipAddress: '103.230.104.12',
        location: 'Dhaka, Bangladesh',
        sessionId: 'sess_live_9901a',
      },
      {
        userId: 'usr_sub_003',
        userName: 'Rahim Ahmed',
        eventType: 'QUALITY_CHANGED',
        contentTitle: 'Aynabaji',
        contentId: 'ban-1',
        device: 'Samsung Smart TV',
        browser: 'Tizen Browser',
        os: 'Tizen 7.0',
        ipAddress: '103.205.71.18',
        location: 'Chittagong, Bangladesh',
        sessionId: 'sess_live_4482c',
      },
      {
        userId: 'usr_admin_002',
        userName: 'Sarah Jenkins',
        eventType: 'MOVIE_COMPLETED',
        contentTitle: 'The Dark Knight',
        contentId: 'eng-1',
        device: 'Dell XPS 15',
        browser: 'Chrome 128',
        os: 'Windows 11',
        ipAddress: '198.51.100.44',
        location: 'San Francisco, US',
        sessionId: 'sess_live_1092b',
      },
    ]);
  }

  console.log('Seeding check completed successfully!');
}

if (require.main === module) {
  seedDatabase().catch((err) => {
    console.error('Failed to seed database:', err);
    process.exit(1);
  });
}

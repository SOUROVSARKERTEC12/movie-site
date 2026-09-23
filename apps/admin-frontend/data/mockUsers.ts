import { UserProfile } from '@movie-site/shared';

const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Rohan', 'Priya', 'Kabir', 'Zara', 'Dev', 'Ishita',
  'Liam', 'Emma', 'Noah', 'Olivia', 'James', 'Sophia', 'Ethan', 'Isabella',
  'Tanvir', 'Nusrat', 'Shakib', 'Tahsan', 'Mehzabeen', 'Afran', 'Sabila', ' Siam',
  'Arjun', 'Diya', 'Vikram', 'Meera', 'Aditya', 'Sneha', 'Reyansh', 'Pooja',
  'Lucas', 'Mia', 'Benjamin', 'Charlotte', 'Henry', 'Amelia', 'Alexander', 'Harper',
  'Rifat', 'Farhana', 'Mushfiq', 'Jannat', 'Ashik', 'Tanjina', 'Rashed', 'Sharmin'
];

const LAST_NAMES = [
  'Sharma', 'Patel', 'Sengupta', 'Chowdhury', 'Kapoor', 'Chatterjee', 'Verma', 'Khan',
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rahman', 'Hossain', 'Islam', 'Ahmed', 'Hasan', 'Sarker', 'Bhuiyan', 'Uddin',
  'Mehta', 'Bose', 'Reddy', 'Nair', 'Malhotra', 'Mukherjee', 'Das', 'Roy',
  'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee'
];

const LOCATIONS = [
  { country: 'Bangladesh', city: 'Dhaka', flag: '🇧🇩' },
  { country: 'Bangladesh', city: 'Chittagong', flag: '🇧🇩' },
  { country: 'Bangladesh', city: 'Sylhet', flag: '🇧🇩' },
  { country: 'India', city: 'Mumbai', flag: '🇮🇳' },
  { country: 'India', city: 'Delhi', flag: '🇮🇳' },
  { country: 'India', city: 'Kolkata', flag: '🇮🇳' },
  { country: 'India', city: 'Bengaluru', flag: '🇮🇳' },
  { country: 'United States', city: 'New York', flag: '🇺🇸' },
  { country: 'United States', city: 'Los Angeles', flag: '🇺🇸' },
  { country: 'United States', city: 'Chicago', flag: '🇺🇸' },
  { country: 'United Kingdom', city: 'London', flag: '🇬🇧' },
  { country: 'United Kingdom', city: 'Manchester', flag: '🇬🇧' },
  { country: 'Canada', city: 'Toronto', flag: '🇨🇦' },
  { country: 'Canada', city: 'Vancouver', flag: '🇨🇦' },
  { country: 'Australia', city: 'Sydney', flag: '🇦🇺' },
  { country: 'United Arab Emirates', city: 'Dubai', flag: '🇦🇪' },
  { country: 'Germany', city: 'Berlin', flag: '🇩🇪' },
  { country: 'Singapore', city: 'Singapore', flag: '🇸🇬' },
];

const DEVICES = [
  'Apple TV 4K',
  'LG OLED C3 65"',
  'Samsung Neo QLED 4K',
  'Sony Bravia XR A80L',
  'MacBook Pro 16" (M3 Max)',
  'MacBook Air 15" (M2)',
  'Windows 11 Custom PC (RTX 4080)',
  'Dell XPS 15',
  'iPhone 15 Pro Max',
  'iPhone 14 Pro',
  'Samsung Galaxy S24 Ultra',
  'Google Pixel 8 Pro',
  'iPad Pro 12.9" (M2)',
  'Fire TV Stick 4K Max',
];

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
];

// Deterministic generator function to create exactly 120 rich realistic users
function generateUsers(): UserProfile[] {
  const users: UserProfile[] = [];

  for (let i = 1; i <= 120; i++) {
    const fName = FIRST_NAMES[(i * 7) % FIRST_NAMES.length];
    const lName = LAST_NAMES[(i * 11) % LAST_NAMES.length];
    const loc = LOCATIONS[(i * 5) % LOCATIONS.length];
    const dev = DEVICES[(i * 3) % DEVICES.length];
    const avatar = AVATARS[i % AVATARS.length];
    
    // Status distribution
    const statusRand = (i * 13) % 100;
    const status: UserProfile['status'] =
      statusRand < 72 ? 'Active' : statusRand < 86 ? 'VIP' : statusRand < 96 ? 'Inactive' : 'Suspended';

    // Tier distribution
    const tierRand = (i * 17) % 100;
    const subscriptionTier: UserProfile['subscriptionTier'] =
      tierRand < 30 ? 'Free' : tierRand < 65 ? 'Standard HD' : tierRand < 90 ? 'Premium 4K' : 'Family VIP';

    // Fictional IP address
    const ipAddress = `192.${(i * 3) % 255}.${(i * 7) % 255}.${(i * 13 + 10) % 250}`;

    // Registration date (past 365 days)
    const daysAgo = (i * 3) % 360;
    const regDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const registrationDate = regDate.toISOString().split('T')[0];

    // Last active
    let lastActive: string;
    if (i % 6 === 0) lastActive = 'Just now';
    else if (i % 5 === 0) lastActive = `${(i % 50) + 1}m ago`;
    else if (i % 3 === 0) lastActive = `${(i % 12) + 1}h ago`;
    else lastActive = `${(i % 7) + 1}d ago`;

    // Watch stats
    const totalWatchTimeHours = Math.round(((i * 19) % 450 + 12) * 10) / 10;
    const moviesWatchedCount = Math.round((totalWatchTimeHours / 2.1) + ((i * 3) % 10));

    users.push({
      id: `usr_${1000 + i}`,
      name: `${fName} ${lName}`,
      email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i % 10 === 0 ? i : ''}@cineblack-stream.demo`,
      avatar,
      registrationDate,
      lastActive,
      status,
      subscriptionTier,
      totalWatchTimeHours,
      moviesWatchedCount,
      currentDevice: dev,
      location: loc,
      ipAddress,
      currentSessionId: status === 'Active' || status === 'VIP' ? `ses_${8000 + i}` : undefined,
      preferences: {
        preferredQuality: subscriptionTier.includes('4K') || subscriptionTier.includes('VIP') ? '4K UHD' : '1080p FHD',
        subtitlesEnabled: i % 2 === 0,
        autoplayNext: i % 3 !== 0,
      },
    });
  }

  return users;
}

export const MOCK_USERS = generateUsers();

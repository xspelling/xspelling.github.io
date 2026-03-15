import type { Car, Season, NewsItem } from '../types';

export const cars: Car[] = [
  // Common Cars
  { id: 'sedan', name: 'Sedan', emoji: '🚗', speed: 5, acceleration: 5, rarity: 'common', price: 0 },
  { id: 'hatchback', name: 'Hatchback', emoji: '🚙', speed: 4, acceleration: 6, rarity: 'common', price: 500 },
  { id: 'truck', name: 'Truck', emoji: '🛻', speed: 4, acceleration: 4, rarity: 'common', price: 800 },
  { id: 'van', name: 'Van', emoji: '🚐', speed: 3, acceleration: 5, rarity: 'common', price: 1000 },
  
  // Rare Cars
  { id: 'sports', name: 'Sports Car', emoji: '🏎️', speed: 7, acceleration: 8, rarity: 'rare', price: 3000 },
  { id: 'racer', name: 'Racer', emoji: '🚓', speed: 8, acceleration: 7, rarity: 'rare', price: 4500 },
  { id: 'formula', name: 'Formula', emoji: '🏁', speed: 9, acceleration: 9, rarity: 'rare', price: 6000 },
  { id: 'police', name: 'Police Car', emoji: '🚔', speed: 7, acceleration: 8, rarity: 'rare', price: 5000 },
  
  // Epic Cars
  { id: 'supercar', name: 'Supercar', emoji: '🚀', speed: 9, acceleration: 9, rarity: 'epic', price: 15000 },
  { id: 'hyper', name: 'Hypercar', emoji: '⚡', speed: 10, acceleration: 10, rarity: 'epic', price: 25000 },
  { id: 'futuristic', name: 'Futuristic', emoji: '🛸', speed: 10, acceleration: 9, rarity: 'epic', price: 30000 },
  { id: 'dragon', name: 'Dragon', emoji: '🐉', speed: 10, acceleration: 10, rarity: 'epic', price: 35000 },
  
  // Legendary Cars
  { id: 'phoenix', name: 'Phoenix', emoji: '🔥', speed: 10, acceleration: 10, rarity: 'legendary', price: 100000 },
  { id: 'unicorn', name: 'Unicorn', emoji: '🦄', speed: 10, acceleration: 10, rarity: 'legendary', price: 150000 },
  { id: 'rocket', name: 'Rocket', emoji: '🌟', speed: 10, acceleration: 10, rarity: 'legendary', price: 200000 },
  
  // Seasonal - Spring
  { id: 'blossom', name: 'Blossom', emoji: '🌸', speed: 6, acceleration: 7, rarity: 'rare', price: 4000, season: 'spring' },
  { id: 'butterfly', name: 'Butterfly', emoji: '🦋', speed: 7, acceleration: 8, rarity: 'epic', price: 12000, season: 'spring' },
  
  // Seasonal - Summer
  { id: 'surfer', name: 'Surfer', emoji: '🏄', speed: 6, acceleration: 7, rarity: 'rare', price: 4000, season: 'summer' },
  { id: 'dolphin', name: 'Dolphin', emoji: '🐬', speed: 8, acceleration: 8, rarity: 'epic', price: 15000, season: 'summer' },
  
  // Seasonal - Fall
  { id: 'pumpkin', name: 'Pumpkin', emoji: '🎃', speed: 6, acceleration: 7, rarity: 'rare', price: 3500, season: 'fall' },
  { id: 'leaf', name: 'Leaf Racer', emoji: '🍂', speed: 7, acceleration: 8, rarity: 'epic', price: 12000, season: 'fall' },
  
  // Seasonal - Winter
  { id: 'snowmobile', name: 'Snowmobile', emoji: '⛄', speed: 6, acceleration: 6, rarity: 'rare', price: 4000, season: 'winter' },
  { id: 'santa', name: 'Santa Sleigh', emoji: '🎅', speed: 9, acceleration: 8, rarity: 'legendary', price: 75000, season: 'winter' },
];

export const getCurrentSeason = (): Season => {
  const month = new Date().getMonth();
  
  if (month >= 2 && month <= 4) {
    return {
      id: 'spring',
      name: 'Spring Racing',
      startDate: '2026-03-01',
      endDate: '2026-05-31',
      theme: 'spring',
      background: 'linear-gradient(135deg, #ecfdf5 0%, #fce7f3 50%, #f3e8ff 100%)',
      accentColor: '#10b981',
    };
  } else if (month >= 5 && month <= 7) {
    return {
      id: 'summer',
      name: 'Summer Heat',
      startDate: '2026-06-01',
      endDate: '2026-08-31',
      theme: 'summer',
      background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #22d3ee 100%)',
      accentColor: '#0ea5e9',
    };
  } else if (month >= 8 && month <= 10) {
    return {
      id: 'fall',
      name: 'Autumn Rush',
      startDate: '2026-09-01',
      endDate: '2026-11-30',
      theme: 'fall',
      background: 'linear-gradient(135deg, #f97316 0%, #eab308 50%, #84cc16 100%)',
      accentColor: '#f97316',
    };
  } else {
    return {
      id: 'winter',
      name: 'Winter Blitz',
      startDate: '2026-12-01',
      endDate: '2027-02-28',
      theme: 'winter',
      background: 'linear-gradient(135deg, #1e3a5f 0%, #06b6d4 50%, #a5f3fc 100%)',
      accentColor: '#06b6d4',
    };
  }
};

export const news: NewsItem[] = [
  {
    id: '1',
    title: 'Winter Blitz Season is Here!',
    content: 'Welcome to the Winter Blitz season! Race through snowy tracks with our new winter-themed cars including the Santa Sleigh and Snowmobile. Complete daily challenges to earn exclusive winter badges!',
    date: '2026-03-15',
    type: 'season',
  },
  {
    id: '2',
    title: 'New League System',
    content: 'We have updated our league system! Climb the ranks from Bronze to Champion and prove you are the fastest typer. Weekly rewards await at every tier!',
    date: '2026-03-10',
    type: 'update',
  },
  {
    id: '3',
    title: 'VIP Club Launch',
    content: 'Introducing VIP Club! Get 2x Cash, 2x XP, exclusive cars, and an ad-free experience. Subscribe now and get a free legendary car!',
    date: '2026-03-01',
    type: 'announcement',
  },
  {
    id: '4',
    title: 'Friend System Live',
    content: 'Race against your friends! Send friend requests, track their progress, and compete on the leaderboard together.',
    date: '2026-02-20',
    type: 'update',
  },
];

export const defaultTexts = [
  'The quick brown fox jumps over the lazy dog.',
  'Pack my box with five dozen liquor jugs.',
  'How vexingly quick daft zebras jump!',
  'Sphinx of black quartz, judge my vow.',
  'Two driven jocks help fax my big quiz.',
  'The five boxing wizards jump quickly.',
  'Amazingly few discotheques provide jukeboxes.',
  'Crazy Frederick bought many very exquisite opal jewels.',
];

export const getRandomText = () => defaultTexts[Math.floor(Math.random() * defaultTexts.length)];

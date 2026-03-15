export interface Car {
  id: string;
  name: string;
  emoji: string;
  speed: number;
  acceleration: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  price: number;
  season?: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  cash: number;
  xp: number;
  level: number;
  league: string;
  ownedCars: string[];
  selectedCar: string;
  isPremium: boolean;
  friends: string[];
  friendRequests: string[];
}

export interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  theme: string;
  background: string;
  accentColor: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'update' | 'season' | 'announcement';
}

export const LEAGUES = [
  { name: 'Bronze', minXP: 0, color: '#cd7f32' },
  { name: 'Silver', minXP: 1000, color: '#c0c0c0' },
  { name: 'Gold', minXP: 5000, color: '#ffd700' },
  { name: 'Platinum', minXP: 15000, color: '#e5e4e2' },
  { name: 'Diamond', minXP: 40000, color: '#b9f2ff' },
  { name: 'Champion', minXP: 100000, color: '#9d4edd' },
];

export const RARITY_COLORS: Record<string, string> = {
  common: '#9ca3af',
  rare: '#3b82f6',
  epic: '#8b5cf6',
  legendary: '#f59e0b',
};

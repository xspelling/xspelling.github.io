export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
  isPremium: boolean;
  publishedAt: string;
  author: string;
}

export interface User {
  id: string;
  name: string;
  isPremium: boolean;
  bookmarks: string[];
}

export const categoryColors: Record<string, string> = {
  tech: '#0071e3',
  science: '#30d158',
  business: '#ffd60a',
  sports: '#ff6b6b',
  entertainment: '#a29bfe',
  lifestyle: '#fd79a8',
  world: '#00cec9',
};

export const difficultyColors: Record<string, string> = {
  beginner: '#30d158',
  intermediate: '#ffd60a',
  advanced: '#ff453a',
};

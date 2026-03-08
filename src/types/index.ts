export interface Article {
  id: string;
  title: string;
  content: string;
  category: 'tech' | 'science' | 'business' | 'lifestyle';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  wordCount: number;
  imageUrl: string;
  readTime: number;
}

export interface Player {
  id: string;
  name: string;
  progress: number;
  wpm: number;
  isReady: boolean;
  color: string;
}

export interface RaceRoom {
  code: string;
  host: string;
  players: Player[];
  status: 'waiting' | 'racing' | 'finished';
  text: string;
}

export interface TypingSession {
  startTime: number;
  endTime?: number;
  text: string;
  typedText: string;
  errors: number;
  wpm: number;
  accuracy: number;
}

export interface FingerKey {
  key: string;
  finger: string;
  hand: 'left' | 'right';
  fingerColor: string;
}

export const FINGER_COLORS: Record<string, string> = {
  'Left Pinky': '#ff6b6b',
  'Left Ring': '#feca57',
  'Left Middle': '#48dbfb',
  'Left Index': '#1dd1a1',
  'Right Index': '#1dd1a1',
  'Right Middle': '#48dbfb',
  'Right Ring': '#feca57',
  'Right Pinky': '#ff6b6b',
  'Thumb': '#a29bfe',
};

export const RACE_COLORS = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3'];

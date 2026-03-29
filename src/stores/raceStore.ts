import { create } from 'zustand';
import { api, Room } from '../lib/api';

interface RaceState {
  room: Room | null;
  isSearching: boolean;
  isRacing: boolean;
  isCountdown: boolean;
  countdown: number;
  text: string;
  currentIndex: number;
  errors: number;
  wpm: number;
  accuracy: number;
  finished: boolean;
  result: RaceResult | null;
  startRace: () => Promise<void>;
  quickMatch: () => Promise<void>;
  createRoom: (difficulty?: string) => Promise<void>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: () => void;
  reset: () => void;
  handleKeyPress: (key: string) => void;
  updateProgress: () => void;
}

interface RaceResult {
  place: number;
  wpm: number;
  accuracy: number;
  xp: number;
  cash: number;
  gems: number;
  level: number;
  league: string;
}

export const useRaceStore = create<RaceState>((set, get) => ({
  room: null,
  isSearching: false,
  isRacing: false,
  isCountdown: false,
  countdown: 0,
  text: '',
  currentIndex: 0,
  errors: 0,
  wpm: 0,
  accuracy: 100,
  finished: false,
  result: null,

  startRace: async () => {
    const { room } = get();
    if (!room) return;
    
    await api.startRace(room.id);
  },

  quickMatch: async () => {
    set({ isSearching: true });
    const response = await api.quickPlay() as any;
    
    if (response.roomId && response.room) {
      set({ room: response.room as Room, isSearching: false });
    } else if (response.status === 'searching') {
      set({ isSearching: true });
      setTimeout(() => get().quickMatch(), 3000);
    }
  },

  createRoom: async (difficulty = 'medium') => {
    const response = await api.createPrivateRoom(difficulty) as any;
    if (response.roomId && response.room) {
      set({ room: response.room as Room });
    }
  },

  joinRoom: async (roomId: string) => {
    const response = await api.joinRoom(roomId) as any;
    if (response.room) {
      set({ room: response.room as Room });
    }
  },

  leaveRoom: () => {
    set({
      room: null,
      isSearching: false,
      isRacing: false,
      isCountdown: false,
      currentIndex: 0,
      errors: 0,
      wpm: 0,
      accuracy: 100,
      finished: false,
      result: null,
    });
  },

  reset: () => {
    set({
      room: null,
      isSearching: false,
      isRacing: false,
      isCountdown: false,
      countdown: 0,
      text: '',
      currentIndex: 0,
      errors: 0,
      wpm: 0,
      accuracy: 100,
      finished: false,
      result: null,
    });
  },

  handleKeyPress: (key: string) => {
    const state = get();
    if (!state.isRacing || state.finished || !state.text) return;

    const expectedChar = state.text[state.currentIndex];

    if (key === expectedChar) {
      const newIndex = state.currentIndex + 1;
      const elapsed = Date.now() - (state.room?.startTime || Date.now());
      const minutes = elapsed / 60000;
      const words = newIndex / 5;
      const newWpm = minutes > 0 ? Math.round(words / minutes) : 0;
      const totalKeystrokes = newIndex + state.errors;
      const newAccuracy = totalKeystrokes > 0 ? Math.round((newIndex / totalKeystrokes) * 100) : 100;

      set({
        currentIndex: newIndex,
        wpm: newWpm,
        accuracy: newAccuracy,
      });

      if (newIndex >= state.text.length) {
        set({ finished: true });
      }
    } else {
      set({ errors: state.errors + 1 });
    }
  },

  updateProgress: () => {
    const state = get();
    if (!state.room || !state.isRacing) return;
  },
}));

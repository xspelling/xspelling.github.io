import { create } from 'zustand';
import { api, Room } from '../lib/api';
import { socketManager } from '../lib/socket';

export interface PlayerState {
  id: string;
  username: string;
  avatar: string;
  car: { emoji: string };
  progress: number;
  wpm: number;
  accuracy: number;
  finished: boolean;
  place: number | null;
  isBot: boolean;
}

interface RaceRewards {
  xp: number;
  cash: number;
  place: number;
  wpm: number;
  accuracy: number;
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

interface RaceState {
  room: Room | null;
  roomId: string | null;
  isSearching: boolean;
  isRacing: boolean;
  isCountdown: boolean;
  countdown: number;
  text: string;
  currentIndex: number;
  errors: number;
  totalKeystrokes: number;
  wpm: number;
  accuracy: number;
  finished: boolean;
  result: RaceResult | null;
  rewards: RaceRewards | null;
  players: Record<string, PlayerState>;
  startTime: number | null;
  errorAtIndex: boolean;

  // Actions
  quickMatch: (difficulty?: string) => Promise<void>;
  createRoom: (difficulty?: string) => Promise<void>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: () => void;
  reset: () => void;
  handleKeyPress: (key: string) => void;
  startRace: () => Promise<void>;
  setupSocketListeners: () => void;
  cleanupSocketListeners: () => void;
}

const initialState = {
  room: null,
  roomId: null,
  isSearching: false,
  isRacing: false,
  isCountdown: false,
  countdown: 0,
  text: '',
  currentIndex: 0,
  errors: 0,
  totalKeystrokes: 0,
  wpm: 0,
  accuracy: 100,
  finished: false,
  result: null,
  rewards: null,
  players: {},
  startTime: null,
  errorAtIndex: false,
};

export const useRaceStore = create<RaceState>((set, get) => ({
  ...initialState,

  setupSocketListeners: () => {
    const handleRoomUpdate = (data: any) => {
      const room = data.room || data;
      const players: Record<string, PlayerState> = {};
      if (room.players) {
        for (const p of room.players) {
          players[p.id] = {
            id: p.id,
            username: p.username || p.user_name || 'Player',
            avatar: p.avatar || '👤',
            car: { emoji: p.car?.emoji || p.carEmoji || '🚗' },
            progress: p.progress || 0,
            wpm: p.wpm || 0,
            accuracy: p.accuracy || 100,
            finished: p.finished || false,
            place: p.place || null,
            isBot: p.isBot || p.is_bot || false,
          };
        }
      }
      set({ room, players });
    };

    const handleCountdown = (data: any) => {
      const count = typeof data === 'number' ? data : data.count;
      set({ isCountdown: true, countdown: count });
    };

    const handleRaceStart = (data: any) => {
      const text = data.text || '';
      const startTime = data.startTime || data.start_time || Date.now();
      set({
        isCountdown: false,
        isRacing: true,
        text,
        startTime,
        currentIndex: 0,
        errors: 0,
        totalKeystrokes: 0,
        wpm: 0,
        accuracy: 100,
        finished: false,
        errorAtIndex: false,
      });
    };

    const handlePlayerProgress = (data: any) => {
      const userId = data.userId || data.user_id;
      const { players } = get();
      if (players[userId]) {
        set({
          players: {
            ...players,
            [userId]: {
              ...players[userId],
              progress: data.progress ?? players[userId].progress,
              wpm: data.wpm ?? players[userId].wpm,
              accuracy: data.accuracy ?? players[userId].accuracy,
              ...(data.charIndex !== undefined ? {} : {}),
            },
          },
        });
      }
    };

    const handlePlayerFinished = (data: any) => {
      const userId = data.userId || data.user_id;
      const { players } = get();
      if (players[userId]) {
        set({
          players: {
            ...players,
            [userId]: {
              ...players[userId],
              finished: true,
              place: data.place,
              wpm: data.wpm ?? players[userId].wpm,
              accuracy: data.accuracy ?? players[userId].accuracy,
            },
          },
        });
      }
    };

    const handleRaceResult = (data: any) => {
      const rewards = data.rewards || null;
      const results = data.results || [];

      // Find our result
      const result = results.length > 0
        ? {
            place: rewards?.place || 1,
            wpm: rewards?.wpm || get().wpm,
            accuracy: rewards?.accuracy || get().accuracy,
            xp: rewards?.xp || 0,
            cash: rewards?.cash || 0,
            gems: 0,
            level: 0,
            league: '',
          }
        : null;

      set({
        isRacing: false,
        finished: true,
        result,
        rewards,
      });
    };

    const handleError = (data: any) => {
      console.error('[Race] Socket error:', data.message || data);
    };

    socketManager.on('room_update', handleRoomUpdate);
    socketManager.on('countdown', handleCountdown);
    socketManager.on('race_start', handleRaceStart);
    socketManager.on('player_progress', handlePlayerProgress);
    socketManager.on('player_finished', handlePlayerFinished);
    socketManager.on('race_result', handleRaceResult);
    socketManager.on('error', handleError);
  },

  cleanupSocketListeners: () => {
    socketManager.off('room_update');
    socketManager.off('countdown');
    socketManager.off('race_start');
    socketManager.off('player_progress');
    socketManager.off('player_finished');
    socketManager.off('race_result');
    socketManager.off('error');
  },

  startRace: async () => {
    const { room } = get();
    if (!room) return;
    await api.startRace(room.id);
  },

  quickMatch: async (difficulty = 'medium') => {
    set({ isSearching: true });
    get().setupSocketListeners();

    const response = await api.quickPlay(difficulty);
    if (!response) {
      set({ isSearching: false });
      return;
    }

    if ('roomId' in response && response.roomId) {
      const r = response as { roomId: string; room: Room };
      const players: Record<string, PlayerState> = {};
      if (r.room?.players) {
        for (const p of r.room.players) {
          players[p.id] = {
            id: p.id,
            username: p.username || 'Player',
            avatar: p.avatar || '👤',
            car: { emoji: p.car?.emoji || '🚗' },
            progress: p.progress || 0,
            wpm: p.wpm || 0,
            accuracy: p.accuracy || 100,
            finished: p.finished || false,
            place: null,
            isBot: p.isBot || false,
          };
        }
      }
      set({ room: r.room, roomId: r.roomId, isSearching: false, players });
      socketManager.emit('join_race', { roomId: r.roomId });
    } else if ('status' in response && response.status === 'searching') {
      // Still searching, retry after delay
      setTimeout(() => {
        if (get().isSearching) {
          get().quickMatch(difficulty);
        }
      }, 3000);
    } else {
      set({ isSearching: false });
    }
  },

  createRoom: async (difficulty = 'medium') => {
    get().setupSocketListeners();

    const response = await api.createPrivateRoom(difficulty);
    if (!response) return;

    const players: Record<string, PlayerState> = {};
    if (response.room?.players) {
      for (const p of response.room.players) {
        players[p.id] = {
          id: p.id,
          username: p.username || 'Player',
          avatar: p.avatar || '👤',
          car: { emoji: p.car?.emoji || '🚗' },
          progress: p.progress || 0,
          wpm: p.wpm || 0,
          accuracy: p.accuracy || 100,
          finished: p.finished || false,
          place: null,
          isBot: p.isBot || false,
        };
      }
    }
    set({ room: response.room, roomId: response.roomId, players });
    socketManager.emit('join_race', { roomId: response.roomId });
  },

  joinRoom: async (roomId: string) => {
    get().setupSocketListeners();

    const response = await api.joinRoom(roomId);
    if (!response) return;

    const players: Record<string, PlayerState> = {};
    if (response.room?.players) {
      for (const p of response.room.players) {
        players[p.id] = {
          id: p.id,
          username: p.username || 'Player',
          avatar: p.avatar || '👤',
          car: { emoji: p.car?.emoji || '🚗' },
          progress: p.progress || 0,
          wpm: p.wpm || 0,
          accuracy: p.accuracy || 100,
          finished: p.finished || false,
          place: null,
          isBot: p.isBot || false,
        };
      }
    }
    set({ room: response.room, roomId, players });
    socketManager.emit('join_race', { roomId });
  },

  leaveRoom: () => {
    get().cleanupSocketListeners();
    set({ ...initialState });
  },

  reset: () => {
    get().cleanupSocketListeners();
    set({ ...initialState });
  },

  handleKeyPress: (key: string) => {
    const state = get();
    if (!state.isRacing || state.finished || !state.text) return;

    // Handle Backspace - hard stop system
    if (key === 'Backspace') {
      if (state.errorAtIndex && state.currentIndex > 0) {
        // Allow going back when there's an error
        set({ errorAtIndex: false });
      }
      return;
    }

    // If there's an error at current index, don't allow advancing
    if (state.errorAtIndex) {
      return;
    }

    // Only handle single characters
    if (key.length !== 1) return;

    const expectedChar = state.text[state.currentIndex];
    const correct = key === expectedChar;
    const newTotalKeystrokes = state.totalKeystrokes + 1;

    if (correct) {
      const newIndex = state.currentIndex + 1;
      const elapsed = Date.now() - (state.startTime || Date.now());
      const minutes = elapsed / 60000;
      const words = newIndex / 5;
      const newWpm = minutes > 0 ? Math.round(words / minutes) : 0;
      const newAccuracy = newTotalKeystrokes > 0
        ? Math.round(((newTotalKeystrokes - state.errors) / newTotalKeystrokes) * 100)
        : 100;

      set({
        currentIndex: newIndex,
        totalKeystrokes: newTotalKeystrokes,
        wpm: newWpm,
        accuracy: newAccuracy,
        errorAtIndex: false,
      });

      // Send keystroke to server
      socketManager.emit('keystroke', {
        roomId: state.roomId,
        charIndex: newIndex,
        timestamp: Date.now(),
        correct: true,
      });

      // Check if race is complete
      if (newIndex >= state.text.length) {
        set({ finished: true, isRacing: false });
        socketManager.emit('race_complete', {
          roomId: state.roomId,
          wpm: newWpm,
          accuracy: newAccuracy,
        });
      }
    } else {
      // Wrong character - mark error at this index (hard stop)
      set({
        errors: state.errors + 1,
        totalKeystrokes: newTotalKeystrokes,
        errorAtIndex: true,
      });

      // Still send the incorrect keystroke to server
      socketManager.emit('keystroke', {
        roomId: state.roomId,
        charIndex: state.currentIndex,
        timestamp: Date.now(),
        correct: false,
      });
    }
  },
}));

const API_URL = 'https://xspelling.duckdns.org';

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar: string;
  level: number;
  xp: number;
  cash: number;
  gems: number;
  league: string;
  division?: string;
  mmr?: number;
  totalRaces: number;
  racesWon: number;
  highestWPM: number;
  averageAccuracy: number;
  totalWordsTyped?: number;
  streak: number;
  lastLogin?: string;
  ownedCars: string[];
  selectedCar: string;
  achievements: Achievement[];
  friends: string[];
  friendRequests?: string[];
  team: string | null;
  teamRole?: string;
  isPremium: boolean;
  isGuest: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  settings: Settings;
  stats: Stats;
  badges: string[];
  title: string;
  banner: string;
  border: string;
  profileTheme?: string;
  paintColor?: string;
  statsPublic?: boolean;
  weeklyXP?: number;
  seasonXP?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  target: number;
  reward: number;
  progress: number;
  unlocked: boolean;
  type?: string;
}

export interface Settings {
  theme: string;
  sound: boolean;
  music: boolean;
  fontSize: string;
  backspaceMode: string;
  showCountdown: boolean;
}

export interface Stats {
  wordsTyped: number;
  timeTyping: number;
  perfectRaces: number;
}

export interface Car {
  id: string;
  name: string;
  emoji: string;
  speed: number;
  acceleration: number;
  rarity: string;
  price: number;
}

export interface Player {
  id: string;
  username: string;
  avatar: string;
  car: Car;
  progress: number;
  wpm: number;
  accuracy: number;
  errors: number;
  finished: boolean;
  finishTime: number | null;
  isBot?: boolean;
}

export interface Room {
  id: string;
  players: Player[];
  status: 'waiting' | 'countdown' | 'racing' | 'finished';
  text: string;
  countdown: number;
  startTime: number | null;
  difficulty?: string;
}

export interface Team {
  id: string;
  name: string;
  tag: string;
  description: string;
  color: string;
  leader: string;
  members: string[];
  totalXP: number;
  totalRaces: number;
  wins: number;
}

export interface Classroom {
  id: string;
  name: string;
  description: string;
  teacher: string;
  students: string[];
  joinCode: string;
  assignments: Assignment[];
}

export interface Assignment {
  id: string;
  title: string;
  targetWPM: number;
  targetAccuracy: number;
  dueDate: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  weeklyXP?: number;
  league: string;
  highestWPM: number;
}

export interface Mission {
  id: string;
  type: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  reward: number;
  completed: boolean;
}

class Api {
  private token: string | null = localStorage.getItem('token');

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_URL}/api${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.detail || errorData?.error || 'Request failed';
        console.error(`API error ${response.status}: ${message}`);
        return null;
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('Network error:', error);
      return null;
    }
  }

  async register(username: string, email: string, password: string) {
    const response = await this.request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    if (response?.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async login(username: string, password: string) {
    const response = await this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (response?.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async guestLogin() {
    const response = await this.request<{ token: string; user: User }>('/auth/guest', {
      method: 'POST',
    });
    if (response?.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async getMe() {
    return this.request<User>('/auth/me');
  }

  async getUsers(search?: string) {
    return this.request<User[]>(`/users${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  }

  async getUser(id: string) {
    return this.request<User>(`/users/${id}`);
  }

  async updateProfile(data: Partial<User>) {
    return this.request<User>('/users/profile', { method: 'PUT', body: JSON.stringify(data) });
  }

  async updateSettings(data: Partial<Settings>) {
    return this.request<User>('/users/settings', { method: 'PUT', body: JSON.stringify(data) });
  }

  async quickPlay(difficulty = 'medium') {
    return this.request<{ roomId: string; room: Room } | { status: string; message: string }>('/race/quick-play', {
      method: 'POST',
      body: JSON.stringify({ difficulty }),
    });
  }

  async createPrivateRoom(difficulty = 'medium') {
    return this.request<{ roomId: string; room: Room }>('/race/create-private', {
      method: 'POST',
      body: JSON.stringify({ difficulty }),
    });
  }

  async joinRoom(roomId: string) {
    return this.request<{ room: Room }>(`/race/join/${roomId}`, { method: 'POST' });
  }

  async startRace(roomId: string) {
    return this.request<{ room: Room }>(`/race/start/${roomId}`, { method: 'POST' });
  }

  async getShop() {
    return this.request<{ dailyItems: Car[]; featuredItems: Car[]; userCoins: number; userGems: number }>('/shop');
  }

  async buyCar(carId: string) {
    return this.request<{ success: boolean; newBalance: number; car: Car }>('/shop/buy', {
      method: 'POST',
      body: JSON.stringify({ carId, type: 'car' }),
    });
  }

  async getGarage() {
    return this.request<{ ownedCars: Car[]; selectedCar: string }>('/garage');
  }

  async selectCar(carId: string) {
    return this.request<{ success: boolean; selectedCar: string }>('/garage/select', {
      method: 'POST',
      body: JSON.stringify({ carId }),
    });
  }

  async getFriends() {
    return this.request<{ friends: User[]; incomingRequests: User[]; outgoingRequests: User[] }>('/friends');
  }

  async addFriend(userId: string) {
    return this.request<{ success: boolean }>(`/friends/add/${userId}`, { method: 'POST' });
  }

  async acceptFriend(userId: string) {
    return this.request<{ success: boolean }>(`/friends/accept/${userId}`, { method: 'POST' });
  }

  async removeFriend(userId: string) {
    return this.request<{ success: boolean }>(`/friends/${userId}`, { method: 'DELETE' });
  }

  async getTeams(search?: string) {
    return this.request<Team[]>(`/teams${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  }

  async createTeam(data: { name: string; tag: string; description?: string; color?: string }) {
    return this.request<Team>('/teams', { method: 'POST', body: JSON.stringify(data) });
  }

  async getTeam(id: string) {
    return this.request<Team & { members: User[] }>(`/teams/${id}`);
  }

  async joinTeam(id: string) {
    return this.request<{ success: boolean }>(`/teams/${id}/join`, { method: 'POST' });
  }

  async leaveTeam(id: string) {
    return this.request<{ success: boolean }>(`/teams/${id}/leave`, { method: 'DELETE' });
  }

  async getLeaderboard() {
    return this.request<{ leaderboard: LeaderboardEntry[]; yourRank: number }>('/leaderboard');
  }

  async getWeeklyLeaderboard() {
    return this.request<{ leaderboard: LeaderboardEntry[]; yourRank: number }>('/leaderboard/weekly');
  }

  async getAchievements() {
    return this.request<{ achievements: Achievement[] }>('/achievements');
  }

  async getDailyReward() {
    return this.request<{ canClaim: boolean; claimedToday: boolean; streak: number; currentReward: number; nextReward: number }>('/daily-reward');
  }

  async getMissions() {
    return this.request<{ daily: Mission[]; weekly: Mission[] }>('/missions');
  }

  async getStats() {
    return this.request<any>('/stats');
  }

  async openMysteryBox() {
    return this.request<{ rewardType: string; rewardValue: number; car?: Car; newBalance: number }>('/mystery-box/open', {
      method: 'POST',
    });
  }

  async createClassroom(name: string, description?: string) {
    return this.request<Classroom>('/classroom/create', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  }

  async joinClassroom(joinCode: string) {
    return this.request<Classroom>('/classroom/join', {
      method: 'POST',
      body: JSON.stringify({ joinCode }),
    });
  }

  async getClassroom(id: string) {
    return this.request<Classroom & { students: User[]; isTeacher: boolean }>(`/classroom/${id}`);
  }

  async report(userId: string, reason: string, details?: string) {
    return this.request<{ success: boolean }>('/report', {
      method: 'POST',
      body: JSON.stringify({ userId, reason, details }),
    });
  }
}

export const api = new Api();

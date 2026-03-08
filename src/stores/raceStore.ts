import { makeAutoObservable, runInAction } from 'mobx';
import type { Player, RaceRoom } from '../types';
import { RACE_COLORS } from '../types';

function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generatePlayerId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export class RaceStore {
  currentRoom: RaceRoom | null = null;
  playerName: string = 'Player';
  playerId: string = generatePlayerId();
  isHost: boolean = false;
  winner: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPlayerName(name: string) {
    this.playerName = name.slice(0, 8);
  }

  createRoom(text: string): string {
    const code = generateRoomCode();
    const hostPlayer: Player = {
      id: this.playerId,
      name: this.playerName,
      progress: 0,
      wpm: 0,
      isReady: true,
      color: RACE_COLORS[0],
    };

    this.currentRoom = {
      code,
      host: this.playerId,
      players: [hostPlayer],
      status: 'waiting',
      text,
    };
    this.isHost = true;
    return code;
  }

  joinRoom(_code: string): boolean {
    if (!this.currentRoom) return false;
    
    const existingPlayer = this.currentRoom.players.find(p => p.id === this.playerId);
    if (existingPlayer) return true;

    if (this.currentRoom.players.length < 4) {
      const newPlayer: Player = {
        id: this.playerId,
        name: this.playerName,
        progress: 0,
        wpm: 0,
        isReady: true,
        color: RACE_COLORS[this.currentRoom.players.length % RACE_COLORS.length],
      };
      this.currentRoom.players.push(newPlayer);
      return true;
    }
    return false;
  }

  startRace() {
    if (!this.currentRoom || !this.isHost) return;
    this.currentRoom.status = 'racing';
    this.winner = null;
    this.currentRoom.players.forEach(p => {
      p.progress = 0;
      p.wpm = 0;
    });
  }

  updateProgress(progress: number, wpm: number) {
    if (!this.currentRoom || this.currentRoom.status !== 'racing') return;

    const player = this.currentRoom.players.find(p => p.id === this.playerId);
    if (player) {
      runInAction(() => {
        player.progress = Math.min(progress, 100);
        player.wpm = wpm;

        if (progress >= 100 && !this.winner) {
          this.winner = player.name;
          this.currentRoom!.status = 'finished';
        }
      });
    }
  }

  simulateOtherPlayers() {
    if (!this.currentRoom || this.currentRoom.status !== 'racing') return;

    this.currentRoom.players.forEach(player => {
      if (player.id !== this.playerId && player.progress < 100) {
        const randomIncrement = Math.random() * 0.5;
        runInAction(() => {
          player.progress = Math.min(player.progress + randomIncrement, 100);
          player.wpm = Math.floor(30 + Math.random() * 50);
        });
      }
    });

    const finishedPlayer = this.currentRoom.players.find(p => p.progress >= 100 && !this.winner);
    if (finishedPlayer && !this.winner) {
      runInAction(() => {
        this.winner = finishedPlayer.name;
        this.currentRoom!.status = 'finished';
      });
    }
  }

  leaveRoom() {
    this.currentRoom = null;
    this.isHost = false;
    this.winner = null;
  }

  get isInRoom(): boolean {
    return this.currentRoom !== null;
  }

  get roomCode(): string {
    return this.currentRoom?.code || '';
  }
}

export const raceStore = new RaceStore();

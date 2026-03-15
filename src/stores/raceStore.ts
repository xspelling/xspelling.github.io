import { makeAutoObservable, runInAction } from 'mobx';
import { getRandomText } from '../data';

export interface RaceOpponent {
  id: string;
  name: string;
  avatar: string;
  carEmoji: string;
  progress: number;
  wpm: number;
  finished: boolean;
}

export interface RaceResult {
  place: number;
  wpm: number;
  accuracy: number;
  xpEarned: number;
  cashEarned: number;
}

class RaceStore {
  text: string = '';
  typedText: string = '';
  currentIndex: number = 0;
  errors: number = 0;
  isRacing: boolean = false;
  isCountdown: boolean = false;
  countdown: number = 3;
  wpm: number = 0;
  accuracy: number = 100;
  startTime: number | null = null;
  opponents: RaceOpponent[] = [];
  raceResult: RaceResult | null = null;
  finished: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  startCountdown() {
    this.reset();
    this.isCountdown = true;
    this.countdown = 3;
    
    const countdownInterval = setInterval(() => {
      runInAction(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(countdownInterval);
          this.startRace();
        }
      });
    }, 1000);
  }

  startRace() {
    this.isCountdown = false;
    this.isRacing = true;
    this.text = getRandomText();
    this.startTime = Date.now();
    this.generateOpponents();
    this.simulateRace();
  }

  generateOpponents() {
    const names = ['Speedster', 'Typemaster', 'Flash', 'Bolt', 'RacerX', 'Swift', 'Quick', 'Zoom'];
    const avatars = ['🏎️', '🚗', '🏁', '⚡', '🔥', '💨', '🎯', '⭐'];
    const carEmojis = ['🚗', '🏎️', '🚓', '🚙', '🏁', '🚕'];
    
    this.opponents = Array(3).fill(null).map((_, i) => ({
      id: `opponent-${i}`,
      name: names[Math.floor(Math.random() * names.length)],
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      carEmoji: carEmojis[Math.floor(Math.random() * carEmojis.length)],
      progress: 0,
      wpm: 0,
      finished: false,
    }));
  }

  simulateRace() {
    const interval = setInterval(() => {
      runInAction(() => {
        if (!this.isRacing) {
          clearInterval(interval);
          return;
        }

        this.opponents.forEach(opp => {
          if (!opp.finished) {
            const randomProgress = Math.random() * 2 + 0.5;
            opp.progress = Math.min(100, opp.progress + randomProgress);
            opp.wpm = Math.floor(30 + Math.random() * 70);
            
            if (opp.progress >= 100) {
              opp.finished = true;
            }
          }
        });

        const finishedCount = this.opponents.filter(o => o.finished).length;
        if (finishedCount >= 3 && !this.finished) {
          this.finishRace();
          clearInterval(interval);
        }
      });
    }, 200);
  }

  handleKeyPress(key: string) {
    if (!this.isRacing || this.finished) return;
    
    const expectedChar = this.text[this.currentIndex];
    
    if (key === expectedChar) {
      this.typedText += key;
      this.currentIndex++;
      
      if (this.currentIndex >= this.text.length) {
        this.finishRace();
      }
    } else {
      this.errors++;
    }

    this.calculateStats();
  }

  calculateStats() {
    if (!this.startTime) return;
    const elapsedMinutes = (Date.now() - this.startTime) / 60000;
    if (elapsedMinutes > 0) {
      const words = this.currentIndex / 5;
      runInAction(() => {
        this.wpm = Math.round(words / elapsedMinutes);
      });
    }
    if (this.currentIndex + this.errors > 0) {
      runInAction(() => {
        this.accuracy = Math.round((this.currentIndex / (this.currentIndex + this.errors)) * 100);
      });
    }
  }

  finishRace() {
    this.isRacing = false;
    this.finished = true;
    
    const myPosition = this.opponents.filter(o => o.finished && o.progress >= 100).length + 1;
    const place = this.currentIndex >= 100 ? myPosition : this.opponents.filter(o => o.finished).length + 1;
    
    const baseXP = this.wpm * 10;
    const baseCash = this.wpm * 5;
    const placeBonus = Math.max(0, (4 - place) * 50);
    
    this.raceResult = {
      place,
      wpm: this.wpm,
      accuracy: this.accuracy,
      xpEarned: baseXP + placeBonus,
      cashEarned: baseCash + placeBonus,
    };
  }

  reset() {
    this.text = '';
    this.typedText = '';
    this.currentIndex = 0;
    this.errors = 0;
    this.isRacing = false;
    this.isCountdown = false;
    this.countdown = 3;
    this.wpm = 0;
    this.accuracy = 100;
    this.startTime = null;
    this.opponents = [];
    this.raceResult = null;
    this.finished = false;
  }

  get progress(): number {
    return (this.currentIndex / this.text.length) * 100;
  }
}

export const raceStore = new RaceStore();

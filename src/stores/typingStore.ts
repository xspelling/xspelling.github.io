import { makeAutoObservable, runInAction } from 'mobx';
import { getRandomText } from '../data';

const FINGER_MAP: Record<string, { finger: string; hand: 'left' | 'right'; fingerColor: string }> = {
  'q': { finger: 'Left Pinky', hand: 'left', fingerColor: '#ff6b6b' },
  'a': { finger: 'Left Pinky', hand: 'left', fingerColor: '#ff6b6b' },
  'z': { finger: 'Left Pinky', hand: 'left', fingerColor: '#ff6b6b' },
  'w': { finger: 'Left Ring', hand: 'left', fingerColor: '#feca57' },
  's': { finger: 'Left Ring', hand: 'left', fingerColor: '#feca57' },
  'x': { finger: 'Left Ring', hand: 'left', fingerColor: '#feca57' },
  'e': { finger: 'Left Middle', hand: 'left', fingerColor: '#48dbfb' },
  'd': { finger: 'Left Middle', hand: 'left', fingerColor: '#48dbfb' },
  'c': { finger: 'Left Middle', hand: 'left', fingerColor: '#48dbfb' },
  'r': { finger: 'Left Index', hand: 'left', fingerColor: '#1dd1a1' },
  'f': { finger: 'Left Index', hand: 'left', fingerColor: '#1dd1a1' },
  'v': { finger: 'Left Index', hand: 'left', fingerColor: '#1dd1a1' },
  't': { finger: 'Left Index', hand: 'left', fingerColor: '#1dd1a1' },
  'g': { finger: 'Left Index', hand: 'left', fingerColor: '#1dd1a1' },
  'b': { finger: 'Left Index', hand: 'left', fingerColor: '#1dd1a1' },
  'y': { finger: 'Right Index', hand: 'right', fingerColor: '#1dd1a1' },
  'h': { finger: 'Right Index', hand: 'right', fingerColor: '#1dd1a1' },
  'n': { finger: 'Right Index', hand: 'right', fingerColor: '#1dd1a1' },
  'u': { finger: 'Right Index', hand: 'right', fingerColor: '#1dd1a1' },
  'j': { finger: 'Right Index', hand: 'right', fingerColor: '#1dd1a1' },
  'm': { finger: 'Right Index', hand: 'right', fingerColor: '#1dd1a1' },
  'i': { finger: 'Right Middle', hand: 'right', fingerColor: '#48dbfb' },
  'k': { finger: 'Right Middle', hand: 'right', fingerColor: '#48dbfb' },
  ',': { finger: 'Right Middle', hand: 'right', fingerColor: '#48dbfb' },
  'o': { finger: 'Right Ring', hand: 'right', fingerColor: '#feca57' },
  'l': { finger: 'Right Ring', hand: 'right', fingerColor: '#feca57' },
  '.': { finger: 'Right Ring', hand: 'right', fingerColor: '#feca57' },
  'p': { finger: 'Right Pinky', hand: 'right', fingerColor: '#ff6b6b' },
  ';': { finger: 'Right Pinky', hand: 'right', fingerColor: '#ff6b6b' },
  ' ': { finger: 'Thumb', hand: 'left', fingerColor: '#a29bfe' },
};

class TypingStore {
  text: string = getRandomText();
  typedText: string = '';
  currentIndex: number = 0;
  errors: number = 0;
  startTime: number | null = null;
  isActive: boolean = false;
  wpm: number = 0;
  accuracy: number = 100;

  constructor() {
    makeAutoObservable(this);
  }

  setText(text: string) {
    this.text = text;
    this.reset();
  }

  reset() {
    this.typedText = '';
    this.currentIndex = 0;
    this.errors = 0;
    this.startTime = null;
    this.isActive = false;
    this.wpm = 0;
    this.accuracy = 100;
  }

  startTyping() {
    this.startTime = Date.now();
    this.isActive = true;
  }

  handleKeyPress(key: string) {
    if (!this.isActive && this.startTime === null) {
      this.startTyping();
    }

    const expectedChar = this.text[this.currentIndex];
    
    if (key === expectedChar) {
      this.typedText += key;
      this.currentIndex++;
      
      if (this.currentIndex >= this.text.length) {
        this.isActive = false;
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

  get currentChar(): string {
    return this.text[this.currentIndex] || '';
  }

  get currentFinger() {
    const char = this.currentChar.toLowerCase();
    return FINGER_MAP[char] || { finger: 'Unknown', hand: 'left' as const, fingerColor: '#888' };
  }

  get progress(): number {
    return (this.currentIndex / this.text.length) * 100;
  }

  get isComplete(): boolean {
    return this.currentIndex >= this.text.length;
  }
}

export const typingStore = new TypingStore();

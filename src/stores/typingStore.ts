import { makeAutoObservable, runInAction } from 'mobx';
import { FINGER_COLORS } from '../types';

const FINGER_MAP: Record<string, { finger: string; hand: 'left' | 'right'; fingerColor: string }> = {
  'q': { finger: 'Left Pinky', hand: 'left', fingerColor: FINGER_COLORS['Left Pinky'] },
  'a': { finger: 'Left Pinky', hand: 'left', fingerColor: FINGER_COLORS['Left Pinky'] },
  'z': { finger: 'Left Pinky', hand: 'left', fingerColor: FINGER_COLORS['Left Pinky'] },
  'w': { finger: 'Left Ring', hand: 'left', fingerColor: FINGER_COLORS['Left Ring'] },
  's': { finger: 'Left Ring', hand: 'left', fingerColor: FINGER_COLORS['Left Ring'] },
  'x': { finger: 'Left Ring', hand: 'left', fingerColor: FINGER_COLORS['Left Ring'] },
  'e': { finger: 'Left Middle', hand: 'left', fingerColor: FINGER_COLORS['Left Middle'] },
  'd': { finger: 'Left Middle', hand: 'left', fingerColor: FINGER_COLORS['Left Middle'] },
  'c': { finger: 'Left Middle', hand: 'left', fingerColor: FINGER_COLORS['Left Middle'] },
  'r': { finger: 'Left Index', hand: 'left', fingerColor: FINGER_COLORS['Left Index'] },
  'f': { finger: 'Left Index', hand: 'left', fingerColor: FINGER_COLORS['Left Index'] },
  'v': { finger: 'Left Index', hand: 'left', fingerColor: FINGER_COLORS['Left Index'] },
  't': { finger: 'Left Index', hand: 'left', fingerColor: FINGER_COLORS['Left Index'] },
  'g': { finger: 'Left Index', hand: 'left', fingerColor: FINGER_COLORS['Left Index'] },
  'b': { finger: 'Left Index', hand: 'left', fingerColor: FINGER_COLORS['Left Index'] },
  'y': { finger: 'Right Index', hand: 'right', fingerColor: FINGER_COLORS['Right Index'] },
  'h': { finger: 'Right Index', hand: 'right', fingerColor: FINGER_COLORS['Right Index'] },
  'n': { finger: 'Right Index', hand: 'right', fingerColor: FINGER_COLORS['Right Index'] },
  'u': { finger: 'Right Index', hand: 'right', fingerColor: FINGER_COLORS['Right Index'] },
  'j': { finger: 'Right Index', hand: 'right', fingerColor: FINGER_COLORS['Right Index'] },
  'm': { finger: 'Right Index', hand: 'right', fingerColor: FINGER_COLORS['Right Index'] },
  'i': { finger: 'Right Middle', hand: 'right', fingerColor: FINGER_COLORS['Right Middle'] },
  'k': { finger: 'Right Middle', hand: 'right', fingerColor: FINGER_COLORS['Right Middle'] },
  ',': { finger: 'Right Middle', hand: 'right', fingerColor: FINGER_COLORS['Right Middle'] },
  'o': { finger: 'Right Ring', hand: 'right', fingerColor: FINGER_COLORS['Right Ring'] },
  'l': { finger: 'Right Ring', hand: 'right', fingerColor: FINGER_COLORS['Right Ring'] },
  '.': { finger: 'Right Ring', hand: 'right', fingerColor: FINGER_COLORS['Right Ring'] },
  'p': { finger: 'Right Pinky', hand: 'right', fingerColor: FINGER_COLORS['Right Pinky'] },
  ';': { finger: 'Right Pinky', hand: 'right', fingerColor: FINGER_COLORS['Right Pinky'] },
  '/': { finger: 'Right Pinky', hand: 'right', fingerColor: FINGER_COLORS['Right Pinky'] },
  ' ': { finger: 'Thumb', hand: 'left', fingerColor: FINGER_COLORS['Thumb'] },
};

export class TypingStore {
  text: string = 'The quick brown fox jumps over the lazy dog.';
  typedText: string = '';
  currentIndex: number = 0;
  errors: number = 0;
  startTime: number | null = null;
  endTime: number | null = null;
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
    this.endTime = null;
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
        this.endTime = Date.now();
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

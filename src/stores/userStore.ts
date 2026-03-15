import { makeAutoObservable, runInAction } from 'mobx';
import type { User, Car } from '../types';
import { cars, getCurrentSeason } from '../data';
import { LEAGUES } from '../types';

const DEFAULT_USER: User = {
  id: 'user-1',
  username: 'Racer',
  avatar: '🏎️',
  cash: 5000,
  xp: 0,
  level: 1,
  league: 'Bronze',
  ownedCars: ['sedan'],
  selectedCar: 'sedan',
  isPremium: false,
  friends: [],
  friendRequests: [],
};

class UserStore {
  user: User = DEFAULT_USER;
  isLoggedIn: boolean = true;
  season = getCurrentSeason();

  constructor() {
    makeAutoObservable(this);
    this.loadUser();
  }

  loadUser() {
    const saved = localStorage.getItem('typerush_user');
    if (saved) {
      this.user = JSON.parse(saved);
    }
    this.isLoggedIn = true;
  }

  saveUser() {
    localStorage.setItem('typerush_user', JSON.stringify(this.user));
  }

  setUsername(name: string) {
    this.user.username = name.slice(0, 12);
    this.saveUser();
  }

  addCash(amount: number) {
    const multiplier = this.user.isPremium ? 2 : 1;
    this.user.cash += amount * multiplier;
    this.saveUser();
  }

  addXP(amount: number) {
    const multiplier = this.user.isPremium ? 2 : 1;
    this.user.xp += amount * multiplier;
    this.updateLeague();
    this.updateLevel();
    this.saveUser();
  }

  updateLeague() {
    for (let i = LEAGUES.length - 1; i >= 0; i--) {
      if (this.user.xp >= LEAGUES[i].minXP) {
        this.user.league = LEAGUES[i].name;
        break;
      }
    }
  }

  updateLevel() {
    this.user.level = Math.floor(this.user.xp / 500) + 1;
  }

  buyCar(carId: string): boolean {
    const car = cars.find(c => c.id === carId);
    if (!car) return false;
    if (this.user.cash < car.price) return false;
    if (this.user.ownedCars.includes(carId)) return false;

    this.user.cash -= car.price;
    this.user.ownedCars.push(carId);
    this.saveUser();
    return true;
  }

  selectCar(carId: string) {
    if (this.user.ownedCars.includes(carId)) {
      this.user.selectedCar = carId;
      this.saveUser();
    }
  }

  isCarOwned(carId: string): boolean {
    return this.user.ownedCars.includes(carId);
  }

  getSelectedCar(): Car | undefined {
    return cars.find(c => c.id === this.user.selectedCar);
  }

  subscribePremium() {
    this.user.isPremium = true;
    this.saveUser();
  }

  logout() {
    this.isLoggedIn = false;
  }

  login() {
    this.isLoggedIn = true;
  }

  addFriend(friendId: string) {
    if (!this.user.friends.includes(friendId)) {
      this.user.friends.push(friendId);
      this.saveUser();
    }
  }

  removeFriend(friendId: string) {
    const index = this.user.friends.indexOf(friendId);
    if (index > -1) {
      this.user.friends.splice(index, 1);
      this.saveUser();
    }
  }

  acceptFriendRequest(friendId: string) {
    this.addFriend(friendId);
    const index = this.user.friendRequests.indexOf(friendId);
    if (index > -1) {
      this.user.friendRequests.splice(index, 1);
    }
    this.saveUser();
  }

  getLeagueColor(): string {
    const league = LEAGUES.find(l => l.name === this.user.league);
    return league?.color || '#cd7f32';
  }
}

export const userStore = new UserStore();

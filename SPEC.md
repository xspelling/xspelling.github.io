# TypeRush - Competitive Typing Platform

## 1. Project Overview

- **Project Name**: TypeRush
- **Project Type**: React Web Application (SPA)
- **Core Functionality**: A competitive typing racing platform with seasons, garage, shop, friends, leagues, and premium features
- **Target Users**: Typing enthusiasts, students, competitive players

## 2. Technology Stack

- **Framework**: React 18 + TypeScript + Vite
- **State Management**: MobX + mobx-react-lite
- **UI Library**: Material UI v5
- **Routing**: React Router v6
- **Hosting**: GitHub Pages
- **Ads**: Google AdSense

## 3. UI/UX Specification

### 3.1 Color Palette
```
--primary: #6366f1 (Indigo)
--primary-dark: #4f46e5
--accent: #f59e0b (Amber/Gold)
--success: #10b981
--error: #ef4444
--background: #0f172a (Dark blue-black)
--card-bg: #1e293b
--text-primary: #f8fafc
--text-secondary: #94a3b8
--cash: #22c55e (Green for cash)
--premium: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)
```

### 3.2 Typography
- **Font**: 'Orbitron' for headers, 'Inter' for body (racing/tech feel)
- **Hero Title**: 48px, bold
- **Section Title**: 32px, bold
- **Body**: 16px, regular

### 3.3 Seasons System
Seasons change quarterly with different themes:
- **Spring** (Mar-May): Cherry blossoms, green themes, flower cars
- **Summer** (Jun-Aug): Beach, ocean, bright colors
- **Fall** (Sep-Nov): Autumn leaves, orange/brown themes
- **Winter** (Dec-Feb): Snow, ice, holiday themes

Each season has:
- Unique background image
- Seasonal cars
- Seasonal badges
- Special shop items

## 4. Pages & Features

### 4.1 Header/Navigation
- Logo left
- Main nav: Race | Practice | Garage | Leagues
- Right: User avatar, cash balance, triangle menu (logout)

### 4.2 Race Page
- Car selection before race
- 3-2-1 VROOM countdown
- Racing track with lanes
- Real-time position of opponents
- Background music during race
- Finish line results: speed, accuracy, placement

### 4.3 Practice Page
- Finger guidance keyboard (from previous project)
- WPM tracking
- Accuracy tracking
- No opponents (solo)

### 4.4 Garage
- View owned cars
- Select active car
- Car stats display
- Total value

### 4.5 Shop
- Browse cars by category
- Buy with cash
- Preview cars
- Limited-time seasonal items

### 4.6 Friends
- Friend list
- Search users
- Send/accept friend requests
- Friend racing stats

### 4.7 Leagues
- Bronze, Silver, Gold, Platinum, Diamond, Champion
- XP required for promotion
- Weekly rewards
- Leaderboard

### 4.8 News
- Game updates
- Seasonal announcements
- Patch notes

### 4.9 Premium (VIP Club)
- Name: "VIP Club"
- Benefits: 2x Cash, 2x XP, Exclusive cars, No ads
- Pricing: $4.99/month or $39.99/year

### 4.10 Settings
- Change username
- View profile stats
- Account settings

## 5. Data Models

### 5.1 Car
```typescript
interface Car {
  id: string;
  name: string;
  image: string;
  speed: number;
  acceleration: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  price: number;
  season?: string;
}
```

### 5.2 User
```typescript
interface User {
  id: string;
  username: string;
  avatar: string;
  cash: number;
  xp: number;
  level: number;
  league: string;
  ownedCars: string[];
  selectedCar: string;
  isPremium: boolean;
  friends: string[];
  friendRequests: string[];
}
```

### 5.3 Season
```typescript
interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  theme: string;
  background: string;
  cars: Car[];
}
```

## 6. Currency System
- **Cash**: Earned from races, bonuses
- **XP**: Determines league rank

## 7. Acceptance Criteria

1. ✓ Racing with 3-2-1 countdown
2. ✓ Background music during race
3. ✓ See opponents in real-time
4. ✓ Results screen with stats
5. ✓ Practice mode with finger guidance
6. ✓ Garage with owned cars
7. ✓ Shop to buy cars
8. ✓ Friends system
9. ✓ Leagues system
10. ✓ Premium/VIP subscription
11. ✓ Seasons that change background/theme
12. ✓ Google AdSense integration
13. ✓ Privacy policy and terms pages

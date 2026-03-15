# LitPro - Literacy Platform

## 1. Project Overview

- **Project Name**: LitPro
- **Project Type**: React Web Application (SPA)
- **Core Functionality**: A literacy platform for reading articles, news, with premium subscription for exclusive content
- **Target Users**: Students, educators, and literacy learners

## 2. Technology Stack

- **Framework**: React 18 + TypeScript + Vite
- **State Management**: MobX + mobx-react-lite
- **UI Library**: Material UI v5
- **Routing**: React Router v6
- **Hosting**: GitHub Pages

## 3. UI/UX Specification

### 3.1 Color Palette (Apple-inspired Light Theme)
```
--primary: #0071e3
--primary-hover: #0077ed
--secondary: #86868b
--background: #f5f5f7
--card-bg: #ffffff
--text-primary: #1d1d1f
--text-secondary: #86868b
--success: #30d158
--warning: #ffd60a
--premium-gold: #f5a623
--premium-gradient: linear-gradient(135deg, #f5a623 0%, #f5d023 100%)
```

### 3.2 Typography
- **Font**: SF Pro Display, -apple-system, Segoe UI, Roboto
- **Hero Title**: 56px, bold
- **Section Title**: 40px, bold
- **Card Title**: 20px, semibold
- **Body**: 17px, regular
- **Caption**: 13px, regular

### 3.3 Layout

#### Header
- Logo "LitPro" on left
- Navigation: Home | News | Premium
- User avatar on right
- Fixed, glassmorphism effect

#### Pages

**Home Page**
- Hero section with tagline
- Featured articles grid
- Category filters
- Reading difficulty indicators

**News Page**
- Latest news articles
- Search functionality
- Category filters (Tech, Science, Business, World, Sports)
- Trending section

**Premium Page**
- Membership benefits
- Pricing tiers (Monthly/Yearly)
- Feature comparison
- CTA buttons

**Article Detail Page**
- Full article content
- Reading progress bar
- Related articles
- Share functionality

## 4. Features

### 4.1 Article Library
- Articles with images, titles, excerpts
- Categories: Technology, Science, Business, World, Sports, Entertainment
- Difficulty levels: Beginner, Intermediate, Advanced
- Reading time estimates
- Bookmark functionality

### 4.2 News Feed
- Latest news articles
- Search and filter
- Trending articles
- Daily updates (mock data)

### 4.3 Premium Membership
- Benefits: Unlimited articles, Ad-free, Offline reading, Exclusive content
- Pricing: $9.99/month or $79.99/year
- Feature comparison table
- "Most Popular" badge on yearly plan

## 5. Data Models

```typescript
interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
  isPremium: boolean;
  publishedAt: string;
  author: string;
}
```

## 6. Acceptance Criteria

1. ✓ Home page with featured articles
2. ✓ News page with filters
3. ✓ Premium page with pricing
4. ✓ Light Apple-inspired theme
5. ✓ Responsive design
6. ✓ Smooth animations
7. ✓ Articles can be viewed
8. ✓ Category filtering works

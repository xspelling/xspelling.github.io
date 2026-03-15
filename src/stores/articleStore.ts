import { makeAutoObservable } from 'mobx';
import type { Article } from '../types';
import { articles } from '../data/articles';

export class ArticleStore {
  articles: Article[] = articles;
  selectedArticle: Article | null = null;
  searchQuery: string = '';
  categoryFilter: string = 'all';
  difficultyFilter: string = 'all';
  bookmarkedIds: string[] = [];
  isPremiumUser: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.loadBookmarks();
  }

  loadBookmarks() {
    const saved = localStorage.getItem('litpro_bookmarks');
    if (saved) {
      this.bookmarkedIds = JSON.parse(saved);
    }
    const premium = localStorage.getItem('litpro_premium');
    if (premium) {
      this.isPremiumUser = JSON.parse(premium);
    }
  }

  saveBookmarks() {
    localStorage.setItem('litpro_bookmarks', JSON.stringify(this.bookmarkedIds));
  }

  savePremium() {
    localStorage.setItem('litpro_premium', JSON.stringify(this.isPremiumUser));
  }

  selectArticle(article: Article) {
    this.selectedArticle = article;
  }

  clearSelection() {
    this.selectedArticle = null;
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  setCategoryFilter(category: string) {
    this.categoryFilter = category;
  }

  setDifficultyFilter(difficulty: string) {
    this.difficultyFilter = difficulty;
  }

  toggleBookmark(articleId: string) {
    const index = this.bookmarkedIds.indexOf(articleId);
    if (index === -1) {
      this.bookmarkedIds.push(articleId);
    } else {
      this.bookmarkedIds.splice(index, 1);
    }
    this.saveBookmarks();
  }

  isBookmarked(articleId: string): boolean {
    return this.bookmarkedIds.includes(articleId);
  }

  subscribePremium() {
    this.isPremiumUser = true;
    this.savePremium();
  }

  canReadArticle(article: Article): boolean {
    if (!article.isPremium) return true;
    return this.isPremiumUser;
  }

  get filteredArticles(): Article[] {
    return this.articles.filter(article => {
      const matchesSearch = this.searchQuery === '' || 
        article.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesCategory = this.categoryFilter === 'all' || article.category === this.categoryFilter;
      const matchesDifficulty = this.difficultyFilter === 'all' || article.difficulty === this.difficultyFilter;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }

  get featuredArticles(): Article[] {
    return this.articles.slice(0, 6);
  }

  get premiumArticles(): Article[] {
    return this.articles.filter(a => a.isPremium);
  }

  get freeArticles(): Article[] {
    return this.articles.filter(a => !a.isPremium);
  }

  get bookmarkedArticles(): Article[] {
    return this.articles.filter(a => this.bookmarkedIds.includes(a.id));
  }

  get latestArticles(): Article[] {
    return [...this.articles].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }
}

export const articleStore = new ArticleStore();

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

  constructor() {
    makeAutoObservable(this);
    this.loadBookmarks();
  }

  loadBookmarks() {
    const saved = localStorage.getItem('xspelling_bookmarks');
    if (saved) {
      this.bookmarkedIds = JSON.parse(saved);
    }
  }

  saveBookmarks() {
    localStorage.setItem('xspelling_bookmarks', JSON.stringify(this.bookmarkedIds));
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

  get filteredArticles(): Article[] {
    return this.articles.filter(article => {
      const matchesSearch = this.searchQuery === '' || 
        article.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesCategory = this.categoryFilter === 'all' || article.category === this.categoryFilter;
      const matchesDifficulty = this.difficultyFilter === 'all' || article.difficulty === this.difficultyFilter;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }

  get bookmarkedArticles(): Article[] {
    return this.articles.filter(a => this.bookmarkedIds.includes(a.id));
  }
}

export const articleStore = new ArticleStore();

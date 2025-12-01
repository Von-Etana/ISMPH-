import { NewsArticle } from '../constants/newsData';
import { logger } from './logger';

const NEWS_API_KEY = 'a40a6ed71928423dafd4888f6b5d18ea';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

interface NewsAPIArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

class NewsAPIService {
  private static instance: NewsAPIService;

  static getInstance(): NewsAPIService {
    if (!NewsAPIService.instance) {
      NewsAPIService.instance = new NewsAPIService();
    }
    return NewsAPIService.instance;
  }

  async getHealthNews(
    query: string = 'health Nigeria',
    pageSize: number = 20,
    page: number = 1
  ): Promise<NewsArticle[]> {
    try {
      const url = `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(query)}&apiKey=${NEWS_API_KEY}&pageSize=${pageSize}&page=${page}&sortBy=publishedAt&language=en`;

      const response = await fetch(url);
      const data: NewsAPIResponse = await response.json();

      if (data.status !== 'ok') {
        throw new Error(`NewsAPI error: ${data.status}`);
      }

      return data.articles.map(article => this.transformArticle(article));
    } catch (error) {
      logger.error('Error fetching news from NewsAPI:', error);
      throw error;
    }
  }

  async getTopHealthHeadlines(
    country: string = 'ng',
    category: string = 'health',
    pageSize: number = 10
  ): Promise<NewsArticle[]> {
    try {
      // Use 'everything' endpoint instead of 'top-headlines' for better results
      const url = `${NEWS_API_BASE_URL}/everything?q=health+Nigeria&apiKey=${NEWS_API_KEY}&pageSize=${pageSize}&sortBy=publishedAt&language=en`;

      const response = await fetch(url);
      const data: NewsAPIResponse = await response.json();

      if (data.status !== 'ok') {
        throw new Error(`NewsAPI error: ${data.status}`);
      }

      return data.articles.map(article => this.transformArticle(article));
    } catch (error) {
      logger.error('Error fetching top headlines from NewsAPI:', error);
      throw error;
    }
  }

  private transformArticle(article: NewsAPIArticle): NewsArticle {
    // Determine state based on content analysis
    const content = (article.title + ' ' + (article.description || '')).toLowerCase();
    let state: 'Kaduna' | 'Kano' | 'Lagos' = 'Lagos'; // default

    if (content.includes('kaduna')) {
      state = 'Kaduna';
    } else if (content.includes('kano')) {
      state = 'Kano';
    }

    // Determine priority based on keywords
    let priority: 'low' | 'medium' | 'high' = 'medium';
    const highPriorityKeywords = ['emergency', 'crisis', 'outbreak', 'death', 'fatal', 'urgent'];
    const lowPriorityKeywords = ['routine', 'maintenance', 'minor'];

    if (highPriorityKeywords.some(keyword => content.includes(keyword))) {
      priority = 'high';
    } else if (lowPriorityKeywords.some(keyword => content.includes(keyword))) {
      priority = 'low';
    }

    // Categorize based on content
    let category = 'Other Health Report';
    if (content.includes('maternal') || content.includes('child') || content.includes('pregnant')) {
      category = 'RMNCAH';
    } else if (content.includes('vaccine') || content.includes('immunization')) {
      category = 'Immunization';
    } else if (content.includes('training') || content.includes('capacity')) {
      category = 'Capacity Building';
    } else if (content.includes('insurance') || content.includes('health scheme')) {
      category = 'Contributory Health Insurance';
    } else if (content.includes('phc') || content.includes('primary health')) {
      category = 'PHC Agenda';
    }

    return {
      id: `newsapi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: article.title,
      description: article.description || 'No description available',
      source: article.source.name,
      date: new Date(article.publishedAt).toISOString().split('T')[0],
      category,
      priority,
      type: 'news',
      state,
      url: article.url,
      mediaType: 'Online'
    };
  }

  async searchHealthNews(
    query: string,
    fromDate?: string,
    toDate?: string,
    pageSize: number = 20
  ): Promise<NewsArticle[]> {
    try {
      let url = `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(query)}+health&apiKey=${NEWS_API_KEY}&pageSize=${pageSize}&sortBy=publishedAt&language=en`;

      if (fromDate) {
        url += `&from=${fromDate}`;
      }
      if (toDate) {
        url += `&to=${toDate}`;
      }

      const response = await fetch(url);
      const data: NewsAPIResponse = await response.json();

      if (data.status !== 'ok') {
        throw new Error(`NewsAPI error: ${data.status}`);
      }

      return data.articles.map(article => this.transformArticle(article));
    } catch (error) {
      logger.error('Error searching news:', error);
      throw error;
    }
  }
}

export const newsAPIService = NewsAPIService.getInstance();
export default newsAPIService;
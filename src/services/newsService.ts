import { supabase } from './supabase';
import { NewsArticle, NewsStatus } from '../types';
import { toApiError } from '../types/supabase';

export const newsService = {
  async fetchApprovedNews(): Promise<NewsArticle[]> {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('status', 'approved')
        .order('date', { ascending: false });

      if (error) throw error;
      return (data || []) as NewsArticle[];
    } catch (error) {
      console.error('Error fetching approved news:', error);
      throw toApiError(error);
    }
  },

  async fetchAllNews(): Promise<NewsArticle[]> {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as NewsArticle[];
    } catch (error) {
      console.error('Error fetching all news:', error);
      throw toApiError(error);
    }
  },

  async updateNewsStatus(id: string, status: NewsStatus): Promise<NewsArticle> {
    try {
      const { data, error } = await supabase
        .from('news')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as NewsArticle;
    } catch (error) {
      console.error('Error updating news status:', error);
      throw toApiError(error);
    }
  },

  async deleteNews(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting news:', error);
      throw toApiError(error);
    }
  },

  async createNews(news: Omit<NewsArticle, 'id' | 'created_at'>): Promise<NewsArticle> {
    try {
      const { data, error } = await supabase
        .from('news')
        .insert({
          ...news,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data as NewsArticle;
    } catch (error) {
      console.error('Error creating news:', error);
      throw toApiError(error);
    }
  }
};

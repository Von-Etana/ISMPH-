import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { NewsArticle, NewsStatus } from '../../types';
import { newsAPIService } from '../../services/newsApi';
import { newsService } from '../../services/newsService';

interface NewsState {
  articles: NewsArticle[];
  allArticles: NewsArticle[]; // For admin use
  loading: boolean;
  error: string | null;
  lastFetched: string | null;
}

const initialState: NewsState = {
  articles: [],
  allArticles: [],
  loading: false,
  error: null,
  lastFetched: null,
};

// Existing API thunks
export const fetchNewsFromAPI = createAsyncThunk(
  'news/fetchFromAPI',
  async (query: string = 'health Nigeria', { rejectWithValue }) => {
    try {
      const articles = await newsAPIService.getHealthNews(query);
      return articles;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch news from API');
    }
  }
);

export const fetchTopHeadlines = createAsyncThunk(
  'news/fetchTopHeadlines',
  async (_, { rejectWithValue }) => {
    try {
      const articles = await newsAPIService.getTopHealthHeadlines();
      return articles;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch headlines');
    }
  }
);

// New Supabase thunks
export const fetchApprovedNews = createAsyncThunk<
  NewsArticle[],
  void,
  { rejectValue: string }
>(
  'news/fetchApproved',
  async (_, { rejectWithValue }) => {
    try {
      return await newsService.fetchApprovedNews();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch news');
    }
  }
);

export const fetchAllNewsAdmin = createAsyncThunk<
  NewsArticle[],
  void,
  { rejectValue: string }
>(
  'news/fetchAllAdmin',
  async (_, { rejectWithValue }) => {
    try {
      return await newsService.fetchAllNews();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch all news');
    }
  }
);

export const updateNewsStatus = createAsyncThunk<
  NewsArticle,
  { id: string; status: NewsStatus },
  { rejectValue: string }
>(
  'news/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await newsService.updateNewsStatus(id, status);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update news status');
    }
  }
);

export const deleteNews = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'news/delete',
  async (id, { rejectWithValue }) => {
    try {
      await newsService.deleteNews(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete news');
    }
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setArticles: (state, action: PayloadAction<NewsArticle[]>) => {
      state.articles = action.payload;
      state.lastFetched = new Date().toISOString();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // API Fetch
      .addCase(fetchNewsFromAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsFromAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload as unknown as NewsArticle[];
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchNewsFromAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Supabase fetch approved
      .addCase(fetchApprovedNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApprovedNews.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(fetchApprovedNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error';
      })
      // Admin fetch all
      .addCase(fetchAllNewsAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllNewsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.allArticles = action.payload;
      })
      // Update Status
      .addCase(updateNewsStatus.fulfilled, (state, action) => {
        const index = state.allArticles.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.allArticles[index] = action.payload;
        }
        // Also update in public articles if it was approved/became something else
        const publicIndex = state.articles.findIndex(a => a.id === action.payload.id);
        if (action.payload.status === 'approved') {
          if (publicIndex !== -1) state.articles[publicIndex] = action.payload;
          else state.articles.unshift(action.payload);
        } else {
          if (publicIndex !== -1) state.articles.splice(publicIndex, 1);
        }
      })
      // Delete
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.allArticles = state.allArticles.filter(a => a.id !== action.payload);
        state.articles = state.articles.filter(a => a.id !== action.payload);
      });
  },
});

export const { setArticles, clearError } = newsSlice.actions;
export default newsSlice.reducer;
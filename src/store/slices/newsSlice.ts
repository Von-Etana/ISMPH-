import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { NewsArticle } from '../../constants/newsData';
import { newsAPIService } from '../../services/newsApi';

interface NewsState {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  lastFetched: string | null;
}

const initialState: NewsState = {
  articles: [],
  loading: false,
  error: null,
  lastFetched: null,
};

export const fetchNewsFromAPI = createAsyncThunk(
  'news/fetchFromAPI',
  async (query: string = 'health Nigeria', { rejectWithValue }) => {
    try {
      const articles = await newsAPIService.getHealthNews(query);
      return articles;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch news');
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

export const searchNews = createAsyncThunk(
  'news/search',
  async ({ query, fromDate, toDate }: { query: string; fromDate?: string; toDate?: string }, { rejectWithValue }) => {
    try {
      const articles = await newsAPIService.searchHealthNews(query, fromDate, toDate);
      return articles;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search news');
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
      .addCase(fetchNewsFromAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsFromAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchNewsFromAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTopHeadlines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopHeadlines.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchTopHeadlines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(searchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(searchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setArticles, clearError } = newsSlice.actions;
export default newsSlice.reducer;
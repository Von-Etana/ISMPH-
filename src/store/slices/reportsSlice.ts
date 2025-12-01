import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabase';
import { STATE_PROGRAM_OFFICERS } from '../../constants/newsData';
import { Report } from '../../types';
import { toApiError } from '../../types/supabase';

interface ReportsState {
  reports: Report[];
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  reports: [],
  loading: false,
  error: null,
};

export const fetchApprovedReports = createAsyncThunk<
  Report[],
  void,
  { rejectValue: string }
>(
  'reports/fetchApproved',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return (data || []) as Report[];
    } catch (error) {
      const apiError = toApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

interface SubmitReportParams {
  user_id: string;
  state: string;
  title: string;
  category: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  media_urls?: string[];
}

export const submitReport = createAsyncThunk<
  Report,
  SubmitReportParams,
  { rejectValue: string }
>(
  'reports/submitReport',
  async (reportData, { rejectWithValue }) => {
    try {
      // Find the state program officer for the report's state
      const stateKey = reportData.state.toLowerCase();
      const officer = STATE_PROGRAM_OFFICERS[stateKey as keyof typeof STATE_PROGRAM_OFFICERS];

      if (!officer) {
        throw new Error('No program officer found for this state');
      }

      // Submit the report
      const { data, error } = await supabase
        .from('reports')
        .insert({
          user_id: reportData.user_id,
          state: reportData.state,
          title: reportData.title,
          category: reportData.category,
          description: reportData.description,
          priority: reportData.priority,
          media_urls: reportData.media_urls || [],
          assigned_officer: officer.email,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to create report');

      // TODO: Send notification to state program officer
      // This would typically involve sending an email or push notification

      return data as Report;
    } catch (error) {
      const apiError = toApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearReportsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApprovedReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovedReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchApprovedReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch reports';
      })
      .addCase(submitReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.unshift(action.payload);
      })
      .addCase(submitReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to submit report';
      });
  },
});

export const { clearReportsError } = reportsSlice.actions;
export default reportsSlice.reducer;

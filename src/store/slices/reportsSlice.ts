import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabase';
import { STATE_PROGRAM_OFFICERS } from '../../constants/newsData';
import { Report } from '../../types';
import { toApiError } from '../../types/supabase';
import { notificationService } from '../../services/notificationService';

interface ReportsState {
  reports: Report[];
  allReports: Report[];
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  reports: [],
  allReports: [],
  stats: {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  },
  loading: false,
  error: null,
};

export const fetchReportStats = createAsyncThunk<
  ReportsState['stats'],
  void,
  { rejectValue: string }
>(
  'reports/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('status');

      if (error) throw error;

      const stats = {
        total: data.length,
        pending: data.filter(r => r.status === 'pending').length,
        approved: data.filter(r => r.status === 'approved').length,
        rejected: data.filter(r => r.status === 'rejected').length,
      };

      return stats;
    } catch (error) {
      const apiError = toApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

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

export const fetchAllReports = createAsyncThunk<
  Report[],
  void,
  { rejectValue: string }
>(
  'reports/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Report[];
    } catch (error) {
      const apiError = toApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

export const fetchUserReports = createAsyncThunk<
  Report[],
  string,
  { rejectValue: string }
>(
  'reports/fetchUserReports',
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Report[];
    } catch (error) {
      const apiError = toApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

export const updateReportStatus = createAsyncThunk<
  Report,
  { reportId: string; status: 'approved' | 'rejected' },
  { rejectValue: string }
>(
  'reports/updateStatus',
  async ({ reportId, status }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', reportId)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to update report status');

      // Trigger notification (fire and forget for now)
      notificationService.sendStatusUpdate(data.user_id, status, data.title);

      return data as Report;
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
  reporter_name?: string;
  reporter_phone?: string;
  reporter_address?: string;
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
          reporter_name: reportData.reporter_name,
          reporter_phone: reportData.reporter_phone,
          reporter_address: reportData.reporter_address,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to create report');

      // Notify admins of new submission
      notificationService.notifyAdmins(data.title, data.reporter_name || 'Anonymous');

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
      .addCase(fetchAllReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReports.fulfilled, (state, action) => {
        state.loading = false;
        state.allReports = action.payload;
      })
      .addCase(fetchAllReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch all reports';
      })
      .addCase(fetchUserReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchUserReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user reports';
      })
      .addCase(submitReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.unshift(action.payload);
        state.allReports.unshift(action.payload);
      })
      .addCase(submitReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to submit report';
      })
      .addCase(updateReportStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReportStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedReport = action.payload;
        
        // Update in reports list (if present)
        const reportIndex = state.reports.findIndex(r => r.id === updatedReport.id);
        if (reportIndex !== -1) {
          state.reports[reportIndex] = updatedReport;
        }
        
        // Update in allReports list
        const allIndex = state.allReports.findIndex(r => r.id === updatedReport.id);
        if (allIndex !== -1) {
          state.allReports[allIndex] = updatedReport;
        }
      })
      .addCase(updateReportStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update report status';
      })
      .addCase(fetchReportStats.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchReportStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchReportStats.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch report stats';
      });
  },
});

export const { clearReportsError } = reportsSlice.actions;
export default reportsSlice.reducer;

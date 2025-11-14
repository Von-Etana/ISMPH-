import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabase';
import { STATE_PROGRAM_OFFICERS } from '../../constants/newsData';

interface ReportsState {
  reports: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  reports: [],
  loading: false,
  error: null,
};

export const fetchApprovedReports = createAsyncThunk('reports/fetchApproved', async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const submitReport = createAsyncThunk(
  'reports/submitReport',
  async (reportData: any, { rejectWithValue }) => {
    try {
      // Find the state program officer for the report's state
      const stateKey = reportData.state.toLowerCase();
      const officer = STATE_PROGRAM_OFFICERS[stateKey];

      if (!officer) {
        throw new Error('No program officer found for this state');
      }

      // Submit the report
      const { data, error } = await supabase
        .from('reports')
        .insert({
          ...reportData,
          assigned_officer: officer.email,
          status: 'pending',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // TODO: Send notification to state program officer
      // This would typically involve sending an email or push notification

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApprovedReports.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApprovedReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchApprovedReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default reportsSlice.reducer;

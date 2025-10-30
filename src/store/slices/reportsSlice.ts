import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabase';

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

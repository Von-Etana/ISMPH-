import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabase';
import { Disease } from '../../types';
import { toApiError } from '../../types/supabase';

interface DiseasesState {
  diseases: Disease[];
  loading: boolean;
  error: string | null;
}

const initialState: DiseasesState = {
  diseases: [],
  loading: false,
  error: null,
};

export const fetchDiseases = createAsyncThunk<
  Disease[],
  void,
  { rejectValue: string }
>(
  'diseases/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('diseases')
        .select('*')
        .order('last_updated', { ascending: false });

      if (error) throw error;
      return (data || []) as Disease[];
    } catch (error) {
      const apiError = toApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

const diseasesSlice = createSlice({
  name: 'diseases',
  initialState,
  reducers: {
    clearDiseasesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiseases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiseases.fulfilled, (state, action) => {
        state.loading = false;
        state.diseases = action.payload;
      })
      .addCase(fetchDiseases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch diseases';
      });
  },
});

export const { clearDiseasesError } = diseasesSlice.actions;
export default diseasesSlice.reducer;

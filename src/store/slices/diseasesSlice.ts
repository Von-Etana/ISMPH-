import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabase';

interface DiseasesState {
  diseases: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DiseasesState = {
  diseases: [],
  loading: false,
  error: null,
};

export const fetchDiseases = createAsyncThunk('diseases/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from('diseases')
      .select('*')
      .order('last_updated', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const diseasesSlice = createSlice({
  name: 'diseases',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiseases.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDiseases.fulfilled, (state, action) => {
        state.loading = false;
        state.diseases = action.payload;
      })
      .addCase(fetchDiseases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default diseasesSlice.reducer;

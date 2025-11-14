import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabase';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'public' | 'staff' | 'admin' | 'state_admin';
  state: string;
  created_at: string;
}

export interface StateProgramOfficer {
  name: string;
  designation: string;
  state: string;
  phone: string;
  email: string;
  role: 'state_admin';
}

interface AdminState {
  users: User[];
  stateOfficers: StateProgramOfficer[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: [],
  stateOfficers: [
    {
      name: 'SABUWA YAHAY',
      designation: 'STATE PROG. OFFICER',
      state: 'KADUNA (SPO)',
      phone: '08039627357',
      email: 'ysabuwa@lsmph.org',
      role: 'state_admin'
    },
    {
      name: 'Peace Micheal',
      designation: 'STATE Program Officer',
      state: 'LAGOS STATE (SPO)',
      phone: '07033642943',
      email: 'mpeace@lsmph.org',
      role: 'state_admin'
    },
    {
      name: 'Bako Abdul Usman',
      designation: 'STATE PROGRAM OFFICER KADUNA',
      state: 'KADUNA',
      phone: '08060674537',
      email: 'abako@lsmph.org',
      role: 'state_admin'
    }
  ],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }: { userId: string; role: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../services/supabase';
import { Profile, UserRole } from '../../types';
import { toApiError } from '../../types/supabase';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  session: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

interface SignInResponse {
  session: Session | null;
  user: User;
  profile: Profile;
}

interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  state: string;
}

export const signIn = createAsyncThunk<
  SignInResponse,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/signIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user returned from sign in');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;
      if (!profile) throw new Error('Profile not found');

      return {
        session: data.session,
        user: data.user,
        profile: profile as Profile
      };
    } catch (error) {
      const apiError = toApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

export const signUp = createAsyncThunk<
  SignInResponse,
  SignUpParams,
  { rejectValue: string }
>(
  'auth/signUp',
  async ({ email, password, fullName, role, state }, { rejectWithValue }) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role,
        state,
      });

      if (profileError) throw profileError;

      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (fetchError) throw fetchError;
      if (!profile) throw new Error('Profile not found');

      return {
        session: authData.session,
        user: authData.user,
        profile: profile as Profile
      };
    } catch (error) {
      const apiError = toApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

export const signOut = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      const apiError = toApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Profile | null>) => {
      state.profile = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.session = action.payload.session;
        state.isAuthenticated = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Sign in failed';
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.session = action.payload.session;
        state.isAuthenticated = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Sign up failed';
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.profile = null;
        state.session = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;

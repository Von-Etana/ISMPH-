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
  initialized: boolean; // Track if session restoration has been attempted
}

const initialState: AuthState = {
  user: null,
  profile: null,
  session: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  initialized: false,
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

// New: Restore session from Supabase storage
export const restoreSession = createAsyncThunk<
  SignInResponse | null,
  void,
  { rejectValue: string }
>(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;
      if (!session || !session.user) {
        // No active session
        return null;
      }

      // Fetch profile for the authenticated user
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile) {
        // Profile not found, sign out
        await supabase.auth.signOut();
        return null;
      }

      return {
        session,
        user: session.user,
        profile: profile as Profile
      };
    } catch (error) {
      console.error('Session restoration failed:', error);
      // Don't reject, just return null to allow fresh login
      return null;
    }
  }
);

export const signIn = createAsyncThunk<
  SignInResponse,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/signIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Validate inputs
      if (!email || !email.trim()) {
        return rejectWithValue('Please enter your email address');
      }
      if (!password) {
        return rejectWithValue('Please enter your password');
      }
      if (!email.includes('@')) {
        return rejectWithValue('Please enter a valid email address');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
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
      // Validate inputs
      if (!email || !email.trim()) {
        return rejectWithValue('Please enter your email address');
      }
      if (!email.includes('@')) {
        return rejectWithValue('Please enter a valid email address');
      }
      if (!password) {
        return rejectWithValue('Please enter a password');
      }
      if (password.length < 6) {
        return rejectWithValue('Password must be at least 6 characters long');
      }
      if (!fullName || !fullName.trim()) {
        return rejectWithValue('Please enter your full name');
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email: email.trim().toLowerCase(),
        full_name: fullName.trim(),
        role,
        state: state || null,
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
    setInitialized: (state) => {
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Session restoration
      .addCase(restoreSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        if (action.payload) {
          state.user = action.payload.user;
          state.profile = action.payload.profile;
          state.session = action.payload.session;
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
        }
      })
      .addCase(restoreSession.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.isAuthenticated = false;
      })
      // Sign in
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
        state.initialized = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Sign in failed';
      })
      // Sign up
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
        state.initialized = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Sign up failed';
      })
      // Sign out
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.profile = null;
        state.session = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, clearError, setInitialized } = authSlice.actions;
export default authSlice.reducer;

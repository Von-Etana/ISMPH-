import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabase';
import { toApiError } from '../../types/supabase';

// Policy Commitment type
export interface PolicyCommitment {
    id: string;
    title: string;
    description: string;
    category: string;
    state?: string;
    commitment_date?: string;
    deadline?: string;
    status: 'active' | 'completed' | 'overdue' | 'cancelled';
    responsible_party?: string;
    progress_percentage: number;
    created_at: string;
    updated_at: string;
}

interface PolicyState {
    commitments: PolicyCommitment[];
    loading: boolean;
    error: string | null;
}

const initialState: PolicyState = {
    commitments: [],
    loading: false,
    error: null,
};

// Fetch all policy commitments
export const fetchPolicyCommitments = createAsyncThunk<
    PolicyCommitment[],
    void,
    { rejectValue: string }
>(
    'policy/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('policy_commitments')
                .select('*')
                .order('progress_percentage', { ascending: false });

            if (error) throw error;
            return (data || []) as PolicyCommitment[];
        } catch (error) {
            const apiError = toApiError(error);
            return rejectWithValue(apiError.message);
        }
    }
);

// Fetch policy commitments by state
export const fetchPolicyCommitmentsByState = createAsyncThunk<
    PolicyCommitment[],
    string,
    { rejectValue: string }
>(
    'policy/fetchByState',
    async (state, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('policy_commitments')
                .select('*')
                .eq('state', state)
                .order('progress_percentage', { ascending: false });

            if (error) throw error;
            return (data || []) as PolicyCommitment[];
        } catch (error) {
            const apiError = toApiError(error);
            return rejectWithValue(apiError.message);
        }
    }
);

// Fetch policy commitments by category
export const fetchPolicyCommitmentsByCategory = createAsyncThunk<
    PolicyCommitment[],
    string,
    { rejectValue: string }
>(
    'policy/fetchByCategory',
    async (category, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('policy_commitments')
                .select('*')
                .eq('category', category)
                .order('progress_percentage', { ascending: false });

            if (error) throw error;
            return (data || []) as PolicyCommitment[];
        } catch (error) {
            const apiError = toApiError(error);
            return rejectWithValue(apiError.message);
        }
    }
);

// Fetch active/overdue commitments
export const fetchActiveCommitments = createAsyncThunk<
    PolicyCommitment[],
    void,
    { rejectValue: string }
>(
    'policy/fetchActive',
    async (_, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('policy_commitments')
                .select('*')
                .in('status', ['active', 'overdue'])
                .order('deadline', { ascending: true });

            if (error) throw error;
            return (data || []) as PolicyCommitment[];
        } catch (error) {
            const apiError = toApiError(error);
            return rejectWithValue(apiError.message);
        }
    }
);

const policySlice = createSlice({
    name: 'policy',
    initialState,
    reducers: {
        clearPolicyError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchPolicyCommitments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPolicyCommitments.fulfilled, (state, action) => {
                state.loading = false;
                state.commitments = action.payload;
            })
            .addCase(fetchPolicyCommitments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch policy commitments';
            })
            // Fetch by state
            .addCase(fetchPolicyCommitmentsByState.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPolicyCommitmentsByState.fulfilled, (state, action) => {
                state.loading = false;
                state.commitments = action.payload;
            })
            .addCase(fetchPolicyCommitmentsByState.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch policy commitments';
            })
            // Fetch by category
            .addCase(fetchPolicyCommitmentsByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPolicyCommitmentsByCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.commitments = action.payload;
            })
            .addCase(fetchPolicyCommitmentsByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch policy commitments';
            })
            // Fetch active
            .addCase(fetchActiveCommitments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActiveCommitments.fulfilled, (state, action) => {
                state.loading = false;
                state.commitments = action.payload;
            })
            .addCase(fetchActiveCommitments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch policy commitments';
            });
    },
});

export const { clearPolicyError } = policySlice.actions;
export default policySlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabase';
import { Feedback, FeedbackStatus, ReportPriority } from '../../types';
import { toApiError } from '../../types/supabase';

interface FeedbackState {
    feedback: Feedback[];
    loading: boolean;
    error: string | null;
}

const initialState: FeedbackState = {
    feedback: [],
    loading: false,
    error: null,
};

// Fetch all feedback (for admin)
export const fetchAllFeedback = createAsyncThunk<
    Feedback[],
    void,
    { rejectValue: string }
>(
    'feedback/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('feedback')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return (data || []) as Feedback[];
        } catch (error) {
            const apiError = toApiError(error);
            return rejectWithValue(apiError.message);
        }
    }
);

// Fetch user's own feedback
export const fetchUserFeedback = createAsyncThunk<
    Feedback[],
    string,
    { rejectValue: string }
>(
    'feedback/fetchUser',
    async (userId, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('feedback')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return (data || []) as Feedback[];
        } catch (error) {
            const apiError = toApiError(error);
            return rejectWithValue(apiError.message);
        }
    }
);

interface SubmitFeedbackParams {
    user_id: string;
    facility_name: string;
    category: string;
    description: string;
    priority: ReportPriority;
    state: string;
}

// Submit new feedback
export const submitFeedback = createAsyncThunk<
    Feedback,
    SubmitFeedbackParams,
    { rejectValue: string }
>(
    'feedback/submit',
    async (feedbackData, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('feedback')
                .insert({
                    user_id: feedbackData.user_id,
                    facility_name: feedbackData.facility_name,
                    category: feedbackData.category,
                    description: feedbackData.description,
                    priority: feedbackData.priority,
                    state: feedbackData.state,
                    status: 'pending',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (error) throw error;
            if (!data) throw new Error('Failed to submit feedback');

            return data as Feedback;
        } catch (error) {
            const apiError = toApiError(error);
            return rejectWithValue(apiError.message);
        }
    }
);

interface UpdateFeedbackStatusParams {
    feedbackId: string;
    status: FeedbackStatus;
}

// Update feedback status (admin only)
export const updateFeedbackStatus = createAsyncThunk<
    Feedback,
    UpdateFeedbackStatusParams,
    { rejectValue: string }
>(
    'feedback/updateStatus',
    async ({ feedbackId, status }, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('feedback')
                .update({
                    status,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', feedbackId)
                .select()
                .single();

            if (error) throw error;
            if (!data) throw new Error('Failed to update feedback');

            return data as Feedback;
        } catch (error) {
            const apiError = toApiError(error);
            return rejectWithValue(apiError.message);
        }
    }
);

const feedbackSlice = createSlice({
    name: 'feedback',
    initialState,
    reducers: {
        clearFeedbackError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all feedback
            .addCase(fetchAllFeedback.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllFeedback.fulfilled, (state, action) => {
                state.loading = false;
                state.feedback = action.payload;
            })
            .addCase(fetchAllFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch feedback';
            })
            // Fetch user feedback
            .addCase(fetchUserFeedback.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserFeedback.fulfilled, (state, action) => {
                state.loading = false;
                state.feedback = action.payload;
            })
            .addCase(fetchUserFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch feedback';
            })
            // Submit feedback
            .addCase(submitFeedback.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitFeedback.fulfilled, (state, action) => {
                state.loading = false;
                state.feedback.unshift(action.payload);
            })
            .addCase(submitFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to submit feedback';
            })
            // Update status
            .addCase(updateFeedbackStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateFeedbackStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.feedback.findIndex(f => f.id === action.payload.id);
                if (index !== -1) {
                    state.feedback[index] = action.payload;
                }
            })
            .addCase(updateFeedbackStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update feedback';
            });
    },
});

export const { clearFeedbackError } = feedbackSlice.actions;
export default feedbackSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabase';
import { toApiError } from '../../types/supabase';

// Notification type
export interface Notification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    is_read: boolean;
    related_entity_type?: string;
    related_entity_id?: string;
    created_at: string;
}

interface NotificationsState {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: NotificationsState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
};

// Fetch user notifications
export const fetchNotifications = createAsyncThunk<
    Notification[],
    string,
    { rejectValue: string }
>(
    'notifications/fetch',
    async (userId, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            return (data || []) as Notification[];
        } catch (error) {
            const apiError = toApiError(error);
            return rejectWithValue(apiError.message);
        }
    }
);

// Mark notification as read
export const markNotificationRead = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>(
    'notifications/markRead',
    async (notificationId, { rejectWithValue }) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notificationId);

            if (error) throw error;
            return notificationId;
        } catch (error) {
            const apiError = toApiError(error);
            return rejectWithValue(apiError.message);
        }
    }
);

// Mark all notifications as read
export const markAllNotificationsRead = createAsyncThunk<
    void,
    string,
    { rejectValue: string }
>(
    'notifications/markAllRead',
    async (userId, { rejectWithValue }) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', userId)
                .eq('is_read', false);

            if (error) throw error;
        } catch (error) {
            const apiError = toApiError(error);
            return rejectWithValue(apiError.message);
        }
    }
);

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        clearNotificationsError: (state) => {
            state.error = null;
        },
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.notifications.unshift(action.payload);
            if (!action.payload.is_read) {
                state.unreadCount += 1;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter(n => !n.is_read).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch notifications';
            })
            .addCase(markNotificationRead.fulfilled, (state, action) => {
                const notification = state.notifications.find(n => n.id === action.payload);
                if (notification && !notification.is_read) {
                    notification.is_read = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            .addCase(markAllNotificationsRead.fulfilled, (state) => {
                state.notifications.forEach(n => { n.is_read = true; });
                state.unreadCount = 0;
            });
    },
});

export const { clearNotificationsError, addNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;

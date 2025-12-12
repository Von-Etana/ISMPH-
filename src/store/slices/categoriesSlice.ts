import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabase';
import { toApiError } from '../../types/supabase';

// Thematic Category type
export interface ThematicCategory {
    id: string;
    name: string;
    description?: string;
    parent_category?: string;
    priority: number;
    is_active: boolean;
    created_at: string;
}

interface CategoriesState {
    categories: ThematicCategory[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoriesState = {
    categories: [],
    loading: false,
    error: null,
};

// Fetch all active categories
export const fetchCategories = createAsyncThunk<
    ThematicCategory[],
    void,
    { rejectValue: string }
>(
    'categories/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('thematic_categories')
                .select('*')
                .eq('is_active', true)
                .order('priority', { ascending: true });

            if (error) throw error;
            return (data || []) as ThematicCategory[];
        } catch (error) {
            const apiError = toApiError(error);
            return rejectWithValue(apiError.message);
        }
    }
);

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clearCategoriesError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch categories';
            });
    },
});

export const { clearCategoriesError } = categoriesSlice.actions;
export default categoriesSlice.reducer;

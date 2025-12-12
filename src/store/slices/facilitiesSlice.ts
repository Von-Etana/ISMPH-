import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabase';
import { toApiError } from '../../types/supabase';

// PHC Facility type
export interface PHCFacility {
    id: string;
    name: string;
    state: string;
    lga: string;
    ward?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
    email?: string;
    services: string[];
    capacity?: number;
    status: 'active' | 'inactive' | 'under_maintenance';
    created_at: string;
    updated_at: string;
}

interface FacilitiesState {
    facilities: PHCFacility[];
    selectedFacility: PHCFacility | null;
    loading: boolean;
    error: string | null;
}

const initialState: FacilitiesState = {
    facilities: [],
    selectedFacility: null,
    loading: false,
    error: null,
};

// Fetch all facilities
export const fetchFacilities = createAsyncThunk<
    PHCFacility[],
    void,
    { rejectValue: string }
>(
    'facilities/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('phc_facilities')
                .select('*')
                .eq('status', 'active')
                .order('name', { ascending: true });

            if (error) throw error;
            return (data || []) as PHCFacility[];
        } catch (error) {
            const apiError = toApiError(error);
            return rejectWithValue(apiError.message);
        }
    }
);

// Fetch facilities by state
export const fetchFacilitiesByState = createAsyncThunk<
    PHCFacility[],
    string,
    { rejectValue: string }
>(
    'facilities/fetchByState',
    async (state, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('phc_facilities')
                .select('*')
                .eq('state', state)
                .eq('status', 'active')
                .order('name', { ascending: true });

            if (error) throw error;
            return (data || []) as PHCFacility[];
        } catch (error) {
            const apiError = toApiError(error);
            return rejectWithValue(apiError.message);
        }
    }
);

// Fetch single facility by ID
export const fetchFacilityById = createAsyncThunk<
    PHCFacility,
    string,
    { rejectValue: string }
>(
    'facilities/fetchById',
    async (facilityId, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('phc_facilities')
                .select('*')
                .eq('id', facilityId)
                .single();

            if (error) throw error;
            if (!data) throw new Error('Facility not found');
            return data as PHCFacility;
        } catch (error) {
            const apiError = toApiError(error);
            return rejectWithValue(apiError.message);
        }
    }
);

// Search facilities
export const searchFacilities = createAsyncThunk<
    PHCFacility[],
    string,
    { rejectValue: string }
>(
    'facilities/search',
    async (searchTerm, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('phc_facilities')
                .select('*')
                .or(`name.ilike.%${searchTerm}%,lga.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`)
                .eq('status', 'active')
                .order('name', { ascending: true })
                .limit(20);

            if (error) throw error;
            return (data || []) as PHCFacility[];
        } catch (error) {
            const apiError = toApiError(error);
            return rejectWithValue(apiError.message);
        }
    }
);

const facilitiesSlice = createSlice({
    name: 'facilities',
    initialState,
    reducers: {
        clearFacilitiesError: (state) => {
            state.error = null;
        },
        clearSelectedFacility: (state) => {
            state.selectedFacility = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchFacilities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFacilities.fulfilled, (state, action) => {
                state.loading = false;
                state.facilities = action.payload;
            })
            .addCase(fetchFacilities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch facilities';
            })
            // Fetch by state
            .addCase(fetchFacilitiesByState.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFacilitiesByState.fulfilled, (state, action) => {
                state.loading = false;
                state.facilities = action.payload;
            })
            .addCase(fetchFacilitiesByState.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch facilities';
            })
            // Fetch by ID
            .addCase(fetchFacilityById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFacilityById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedFacility = action.payload;
            })
            .addCase(fetchFacilityById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch facility';
            })
            // Search
            .addCase(searchFacilities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchFacilities.fulfilled, (state, action) => {
                state.loading = false;
                state.facilities = action.payload;
            })
            .addCase(searchFacilities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to search facilities';
            });
    },
});

export const { clearFacilitiesError, clearSelectedFacility } = facilitiesSlice.actions;
export default facilitiesSlice.reducer;

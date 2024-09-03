import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCarOwnerProfile, updateCarOwnerProfile, CarOwnerProfile } from './carprofileapicaller';

interface ProfileState {
  profile: CarOwnerProfile | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  status: 'idle',
  error: null,
};

export const fetchCarProfile = createAsyncThunk(
  'carOwnerProfile/fetchProfile',
  async (id: string, { rejectWithValue }) => {
    try {
      const profile = await fetchCarOwnerProfile(id);
      if (!profile) {
        return rejectWithValue('Profile not found');
      }
      return profile;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateCarProfile = createAsyncThunk(
  'carOwnerProfile/updateProfile',
  async ({ id, profileData }: { id: string; profileData: CarOwnerProfile }, { rejectWithValue }) => {
    try {
      const updatedProfile = await updateCarOwnerProfile(id, profileData);
      return updatedProfile;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const carOwnerProfileSlice = createSlice({
  name: 'carOwnerProfile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCarProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchCarProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateCarProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCarProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(updateCarProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default carOwnerProfileSlice.reducer;

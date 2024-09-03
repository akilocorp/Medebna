import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchEventOwnerProfile, updateEventOwnerProfile, EventOwnerProfile } from './eventprofileapicaller';

interface ProfileState {
  profile: EventOwnerProfile | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  status: 'idle',
  error: null,
};

export const fetchProfile = createAsyncThunk(
  'eventOwnerProfile/fetchProfile',
  async (id: string, { rejectWithValue }) => {
    try {
      const profile = await fetchEventOwnerProfile(id);
      if (!profile) {
        return rejectWithValue('Profile not found');
      }
      return profile;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'eventOwnerProfile/updateProfile',
  async ({ id, profileData }: { id: string; profileData: EventOwnerProfile }, { rejectWithValue }) => {
    try {
      const updatedProfile = await updateEventOwnerProfile(id, profileData);
      return updatedProfile;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const eventOwnerProfileSlice = createSlice({
  name: 'eventOwnerProfile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default eventOwnerProfileSlice.reducer;

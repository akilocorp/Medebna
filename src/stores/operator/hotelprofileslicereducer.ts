import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchHotelOwnerProfile, updateHotelOwnerProfile } from './hotelprofileapicaller';

interface Facilities {
  popularFacilities: string[];
  roomAmenities: string[];
  outdoorFacilities: string[];
  kitchenFacilities: string[];
  mediaTech: string[];
  foodDrink: string[];
  transportFacilities: string[];
  receptionServices: string[];
  cleaningServices: string[];
  businessFacilities: string[];
  safetyFacilities: string[];
  generalFacilities: string[];
  accessibility: string[];
  wellnessFacilities: string[];
  languages: string[];
}

interface CheckInOut {
  time: string;
  description: string;
}

interface HouseRules {
  checkIn: CheckInOut;
  checkOut: CheckInOut;
  cancellationPrepayment: string;
  childrenAndBeds: string;
  cribsAndExtraBedPolicies: string;
  noAgeRestriction: string;
  pets: string;
  acceptedPaymentMethods: string;
}

interface HotelProfile {
  _id: string;
  address: string;
  zipCode: string;
  city: string;
  companyImage: string;
  description: string;
  rating: number;
  facilities: Facilities;
  houseRules: HouseRules;
  createdBy: string;
}

interface ApiResponse {
  status: string;
  data: {
    hotelProfile: HotelProfile;
  };
}

export const fetchProfile = createAsyncThunk(
    'hotelProfile/fetchProfile',
    async (id: string, { rejectWithValue }) => {
      try {
        const data = await fetchHotelOwnerProfile(id);
        
        if (data && data.data) {
          return data.data.hotelProfile; // Return the hotelProfile if data exists
        } else {
          return rejectWithValue('No data found');
        }
      } catch (error) {
        return rejectWithValue((error as Error).message);
      }
    }
  );
  
  export const updateProfile = createAsyncThunk(
    'hotelProfile/updateProfile',
    async ({ id, profileData }: { id: string, profileData: HotelProfile }, { rejectWithValue }) => {
      try {
        const data = await updateHotelOwnerProfile(id, profileData);
        
        if (data && data.data) {
          return data.data.hotelProfile; // Return the hotelProfile if data exists
        } else {
          return rejectWithValue('No data found');
        }
      } catch (error) {
        return rejectWithValue((error as Error).message);
      }
    }
  );
  
 
  

  interface HotelProfileState {
    profile: HotelProfile | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }
  
  const initialState: HotelProfileState = {
    profile: null,
    status: 'idle',
    error: null,
  };
  
  const hotelProfileSlice = createSlice({
    name: 'hotelProfile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchProfile.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchProfile.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.profile = action.payload || null; // Adjusted to handle direct profile data
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
          state.profile = action.payload || null; // Adjusted to handle direct profile data
        })
        .addCase(updateProfile.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload as string;
        });
    },
  });
  
  export default hotelProfileSlice.reducer;
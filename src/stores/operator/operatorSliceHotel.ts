import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Room {
  roomNumber: string;
  status: string;
}

interface RoomType {
  type: string;
  price: number;
  image: string;
  description: string;
  numberOfGuests: number;
  rooms: Room[];
}

export interface Hotel {
  id?: string;
  roomTypes: RoomType[];
  createdBy?: string;
}

interface HotelState {
  hotels: Hotel[];
}

const initialState: HotelState = {
  hotels: [],
};

const hotelSlice = createSlice({
  name: 'hotel',
  initialState,
  reducers: {
    setHotels: (state, action: PayloadAction<Hotel[]>) => {
      state.hotels = action.payload;
    },
    addHotel: (state, action: PayloadAction<Hotel>) => {
      state.hotels.push(action.payload);
    },
    deleteHotel: (state, action: PayloadAction<string>) => {
      state.hotels = state.hotels.filter(hotel => hotel.id !== action.payload);
    },
    updateHotel: (state, action: PayloadAction<Hotel>) => {
      const index = state.hotels.findIndex(hotel => hotel.id === action.payload.id);
      if (index !== -1) {
        state.hotels[index] = action.payload;
      }
    }
  },
});

export const { setHotels, addHotel, deleteHotel, updateHotel } = hotelSlice.actions;
export default hotelSlice.reducer;

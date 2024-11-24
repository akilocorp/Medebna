import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookProduct } from './apiCaller';

export const bookItem = createAsyncThunk('booking/bookItem', async (formData: any) => {
  return await bookProduct(formData);
});

interface BookingState {
  loading: boolean;
  error: string | null; // Allow error to be either a string or null
}

const initialState: BookingState = {
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bookItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookItem.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(bookItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error occurred'; 
      });
  },
});

export default bookingSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addEventToCart } from './carapicaller';

export const addEventCartItem = createAsyncThunk(
  'cart/addEventCartItem',
  async ({ eventId, productType, eventTypeId, numberOfTickets }: { eventId: string; productType: string; eventTypeId: string; numberOfTickets: number }, { rejectWithValue }) => {
    try {
      const response = await addEventToCart(eventId, productType, eventTypeId, numberOfTickets);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

interface CartState {
  items: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CartState = {
  items: [],
  status: 'idle',
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addEventCartItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addEventCartItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addEventCartItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default cartSlice.reducer;

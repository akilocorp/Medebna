// SliceReducer.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addToCart } from './carapicaller';

export const addCartItem = createAsyncThunk(
  'cart/addCartItem',
  async ({ productId, productType, roomId }: { productId: string; productType: string; roomId: string }, { rejectWithValue }) => {
    try {
      const response = await addToCart(productId, productType, roomId);
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
      .addCase(addCartItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default cartSlice.reducer;

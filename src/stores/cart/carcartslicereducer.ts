// cartSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addToCartcar, getCartCount } from '@/stores/cart/carapicaller';

interface CartState {
  items: any[];
  count: number;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: CartState = {
  items: [],
  count: 0,
  status: 'idle',
  error: null,
};

// Async thunk for adding an item to the cart
export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async (cartData: any, { rejectWithValue }) => {
    try {
      const response = await addToCartcar(cartData.id, cartData.productType, cartData.roomId, cartData.carTypeId, cartData.carColorId, cartData.numberOfTickets);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for getting cart count
export const fetchCartCount = createAsyncThunk(
  'cart/fetchCartCount',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const response = await getCartCount(sessionId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Reducer to handle direct updates to the cart
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemToCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items.push(action.payload);
        state.count += 1; // Increment cart count
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchCartCount.fulfilled, (state, action) => {
        state.count = action.payload;
      });
  },
});

export default cartSlice.reducer;
export const { actions: cartActions } = cartSlice;

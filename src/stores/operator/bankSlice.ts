// bankSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBankList } from '@/stores/operator/ApiCaller';

export const fetchBanks = createAsyncThunk('banks/fetchBanks', async () => {
  const banks = await fetchBankList();
  return banks;
});

interface BankState {
  bankList: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BankState = {
  bankList: [],
  loading: false,
  error: null,
};

const bankSlice = createSlice({
  name: 'banks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanks.fulfilled, (state, action) => {
        state.loading = false;
        state.bankList = action.payload;
      })
      .addCase(fetchBanks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch banks';
      });
  },
});

export default bankSlice.reducer;

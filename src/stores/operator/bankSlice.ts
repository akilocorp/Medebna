// bankSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBankList, fetchAccountData } from '@/stores/operator/ApiCaller';

export const fetchBanks = createAsyncThunk('banks/fetchBanks', async () => {
  const banks = await fetchBankList();
  return banks;
});

export const fetchAccount = createAsyncThunk('banks/fetchAccount', async (userId: string) => {
  const accountData = await fetchAccountData(userId);
  return accountData;
});

interface BankState {
  bankList: any[];
  accountData: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: BankState = {
  bankList: [],
  loading: false,
  accountData: null,
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
      })
      .addCase(fetchAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accountData = action.payload;
      })
      .addCase(fetchAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch account data';
      });
  },
});

export default bankSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ListingState {
  listings: any[];
}

const initialState: ListingState = {
  listings: [],
};

const listingSlice = createSlice({
  name: 'listing',
  initialState,
  reducers: {
    setListings: (state, action: PayloadAction<any[]>) => {
      state.listings = action.payload;
    },
    addListing: (state, action: PayloadAction<any>) => {
      state.listings.push(action.payload);
    },
    deleteListing: (state, action: PayloadAction<string>) => {
      state.listings = state.listings.filter(listing => listing.id !== parseInt(action.payload));
    },
  },
});

export const { setListings, addListing, deleteListing } = listingSlice.actions;
export default listingSlice.reducer;

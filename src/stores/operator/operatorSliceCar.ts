import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Car {
  type: string;
  price: number;
  image: string;
  description: string;
  status: string;
}

interface CarDetails {
  details: string;
  rentalInfo: string;
  additionalInfo: string;
}

export interface CarRental {
  cars: Car[];
  carDetails: CarDetails;
  numberOfCars: number;
  id?: string;
}

interface CarRentalState {
  carRentals: CarRental[];
}

const initialState: CarRentalState = {
  carRentals: [],
};

const carRentalSlice = createSlice({
  name: 'carRental',
  initialState,
  reducers: {
    setCarRentals: (state, action: PayloadAction<CarRental[]>) => {
      state.carRentals = action.payload;
    },
    addCarRental: (state, action: PayloadAction<CarRental>) => {
      state.carRentals.push(action.payload);
    },
    updateCarRental: (state, action: PayloadAction<{ id: string; carRental: CarRental }>) => {
      const index = state.carRentals.findIndex(carRental => carRental.id === action.payload.id);
      if (index !== -1) {
        state.carRentals[index] = action.payload.carRental;
      }
    },
    deleteCarRental: (state, action: PayloadAction<string>) => {
      state.carRentals = state.carRentals.filter(carRental => carRental.id !== action.payload);
    },
  },
});

export const { setCarRentals, addCarRental, updateCarRental, deleteCarRental } = carRentalSlice.actions;
export default carRentalSlice.reducer;

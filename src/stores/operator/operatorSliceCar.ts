import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Car {
  numberOfCars: number;
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
  language: string;
}

interface RentalRules {
  rentalDuration: string;
  cancellationPolicy: string;
  prepayment: boolean;
  noAgeRestriction: boolean;
  additionalInfo: string;
  acceptedPaymentMethods: string;
}

export interface CarRental {
  rating: number;
  cars: Car[];
  carDetails: CarDetails;
  rentalRules: RentalRules;
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
    deleteCarRental: (state, action: PayloadAction<string>) => {
      state.carRentals = state.carRentals.filter(carRental => carRental.id !== action.payload);
    },
  },
});

export const { setCarRentals, addCarRental, deleteCarRental } = carRentalSlice.actions;
export default carRentalSlice.reducer;

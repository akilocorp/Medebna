import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EventPrice {
  type: string;
  ticketAvailable: number;
  price: number;
}

interface EventDetails {
  details: string;
  ticketInfo: string;
  additionalInfo: string;
  foodAndDrink: string;
}

interface EventRules {
  checkIn: string;
  checkOut: string;
  cancellationPolicy: string;
  prepayment: boolean;
  noAgeRestriction: boolean;
  pets: boolean;
  additionalInfo: string;
  acceptedPaymentMethods: string;
}

export interface Event {
  rating: number;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  image: string;
  description: string;
  status: string;
  eventPrices: EventPrice[];
  eventDetails: EventDetails;
  eventRules: EventRules;
  id?: string;
}

interface EventState {
  events: Event[];
}

const initialState: EventState = {
  events: [],
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
  },
});

export const { setEvents, addEvent, deleteEvent } = eventSlice.actions;
export default eventSlice.reducer;

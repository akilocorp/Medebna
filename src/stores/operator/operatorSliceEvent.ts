import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EventDetails {
  details: string;
  ticketInfo: string;
  additionalInfo: string;
  foodAndDrink: string;
}

interface EventPrice {
  type: string;
  ticketAvailable: number;
  price: number;
}

interface EventData {
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  image: string;
  description: string;
  status: string;
}

export interface Event {
  events: EventData;
  eventPrices: EventPrice[];
  eventDetails: EventDetails;
  _id?: string; // Assuming this is the unique identifier for the event
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
    updateEvent: (state, action: PayloadAction<{ id: string; event: Event }>) => {
      const index = state.events.findIndex(event => event._id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload.event;
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event._id !== action.payload);
    },
  },
});

export const { setEvents, addEvent, updateEvent, deleteEvent } = eventSlice.actions;
export default eventSlice.reducer;


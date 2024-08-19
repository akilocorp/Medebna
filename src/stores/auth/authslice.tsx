// src/stores/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  userType: string | null;
}

const getInitialState = (): AuthState => {
  if (typeof window !== "undefined") { // Check if we're in the browser
    return {
      isAuthenticated: !!localStorage.getItem('token'),
      user: null,
      userType: localStorage.getItem('userType'), 
    };
  } else {
    // Default initial state for SSR
    return {
      isAuthenticated: false,
      user: null,
      userType: null,
    };
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(), // Use the function to initialize state
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: any, userType: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.userType = action.payload.userType;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.userType = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
      }
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;

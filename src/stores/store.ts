import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import signupReducerAdmin from '@/stores/admin/registerSliceReducerAdmin';
import hotelReducer from '@/stores/operator/operatorSliceHotel'; // Update with the correct path to your slice
import authReducer from '@/stores/auth/authslice';

const rootReducer = combineReducers({
  form: formReducer,
  register: signupReducerAdmin,
  auth: authReducer,
  hotels: hotelReducer, // Add the hotel reducer here
});

export type RootState = ReturnType<typeof rootReducer>;


export default rootReducer;

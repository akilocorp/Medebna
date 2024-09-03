import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import signupReducerAdmin from '@/stores/admin/registerSliceReducerAdmin';
import hotelReducer from '@/stores/operator/operatorSliceHotel'; // Update with the correct path to your slice
import authReducer from '@/stores/auth/authslice';
import carOwnerProfileReducer from '@/stores/operator/carprofileslicereducer'
import eventOwnerProfileReducer from '@/stores/operator/eventprofileslicereducer'; 

const rootReducer = combineReducers({
  form: formReducer,
  register: signupReducerAdmin,
  carOwnerProfile: carOwnerProfileReducer,
  auth: authReducer,
  eventOwnerProfile: eventOwnerProfileReducer,
  hotels: hotelReducer, 
});

export type RootState = ReturnType<typeof rootReducer>;



export default rootReducer;

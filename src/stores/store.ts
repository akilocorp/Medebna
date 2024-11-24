import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import signupReducerAdmin from '@/stores/admin/registerSliceReducerAdmin';
import hotelReducer from '@/stores/operator/operatorSliceHotel'; 
import eventReducer from '@/stores/operator/operatorSliceEvent';
import carReducer from '@/stores/operator/operatorSliceCar';
import authReducer from '@/stores/auth/authslice';
import hotelcartReducer from '@/stores/cart/cartslicereducer'
import carcartReducer from '@/stores/cart/carcartslicereducer'
import eventcartReducer from "@/stores/cart/eventcartslicereducer"
import hotelOwnerProfileReducer from '@/stores/operator/hotelprofileslicereducer'
import carOwnerProfileReducer from '@/stores/operator/carprofileslicereducer'
import eventOwnerProfileReducer from '@/stores/operator/eventprofileslicereducer'; 
import bookingReducer from '@/stores/book/bookingSlice'



const rootReducer = combineReducers({
  form: formReducer,
  register: signupReducerAdmin,
  carOwnerProfile: carOwnerProfileReducer,
  hotelOwnerProfile: hotelOwnerProfileReducer,
  eventOwnerProfile: eventOwnerProfileReducer,
  hotelcart: hotelcartReducer,
  carcart: carcartReducer,
  eventcart: eventcartReducer,
  auth: authReducer,
  events: eventReducer,
  cars: carReducer,  
  booking: bookingReducer,
  hotels: hotelReducer, 
});

export type RootState = ReturnType<typeof rootReducer>;



export default rootReducer;

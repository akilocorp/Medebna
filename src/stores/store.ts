import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import signupReducerAdmin from '@/stores/admin/registerSliceReducerAdmin';
import operatorReducer from '@/stores/operator/operatorSlice';
import authReducer from '@/stores/auth/authslice';

const rootReducer = combineReducers({
  form: formReducer,
  register: signupReducerAdmin,
  listing: operatorReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

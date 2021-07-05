import { combineReducers } from '@reduxjs/toolkit';
import { reducer as formReducer } from 'redux-form';
import { reducer as usersReducer } from 'src/slices/users';
import { reducer as invoicesReducer } from 'src/slices/invoices';

const rootReducer = combineReducers({
  form: formReducer,
  users: usersReducer,
  invoices: invoicesReducer
});

export default rootReducer;

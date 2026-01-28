// src/redux/store.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';

import bookingReducer from './reducers/bookingReducer';

const rootReducer = combineReducers({
  bookings: bookingReducer,
  // Add more reducers here later (e.g., servicesReducer, authReducer)
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
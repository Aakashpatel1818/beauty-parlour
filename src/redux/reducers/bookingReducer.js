// src/redux/reducers/bookingReducer.js
const initialState = {
  bookings: [],
  status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
  error: null
};

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'BOOKING_REQUEST':
      return { ...state, status: 'loading', error: null };
    case 'BOOKING_SUCCESS':
      return {
        ...state,
        status: 'success',
        bookings: [...state.bookings, action.payload],
        error: null
      };
    case 'BOOKING_FAIL':
      return { ...state, status: 'error', error: action.payload };
    case 'GET_BOOKINGS_SUCCESS':
      return { ...state, bookings: action.payload, status: 'success' };
    default:
      return state;
  }
};

export default bookingReducer;
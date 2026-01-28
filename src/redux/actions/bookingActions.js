// src/redux/actions/bookingActions.js
import axios from 'axios';

export const createBooking = (bookingData) => async (dispatch) => {
  dispatch({ type: 'BOOKING_REQUEST' });
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token') // If you have JWT auth
      }
    };
    const res = await axios.post('/api/bookings', bookingData, config);
    dispatch({ type: 'BOOKING_SUCCESS', payload: res.data });
  } catch (err) {
    dispatch({
      type: 'BOOKING_FAIL',
      payload: err.response?.data?.message || 'Booking failed'
    });
  }
};

export const getUserBookings = () => async (dispatch) => {
  try {
    const config = {
      headers: { 'x-auth-token': localStorage.getItem('token') }
    };
    const res = await axios.get('/api/bookings', config);
    dispatch({ type: 'GET_BOOKINGS_SUCCESS', payload: res.data });
  } catch (err) {
    console.error('Failed to fetch bookings:', err);
  }
};
// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to every request if logged in
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
      
      // Handle 401 Unauthorized (token expired)
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        // Optionally redirect to login
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ==================== BOOKING API CALLS ====================

/**
 * Get booked time slots for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise} Response with bookedSlots array
 */
export const getBookedSlots = async (date) => {
  try {
    const response = await api.get('/api/bookings/slots', {
      params: { date }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new booking (PUBLIC - no auth required)
 * @param {Object} bookingData - { name, phone, email, service, date, timeSlot, notes, price }
 * @returns {Promise} Created booking data
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/api/bookings', bookingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user's bookings (REQUIRES AUTH)
 * @returns {Promise} Array of user's bookings
 */
export const getMyBookings = async () => {
  try {
    const response = await api.get('/api/bookings/my-bookings');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all bookings with pagination and filters (ADMIN)
 * @param {Object} params - { page, limit, date, status }
 * @returns {Promise} Array of bookings with pagination info
 */
export const getAllBookings = async (params = {}) => {
  try {
    const response = await api.get('/api/bookings/all', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get single booking by ID (REQUIRES AUTH)
 * @param {string} bookingId - Booking ID
 * @returns {Promise} Booking data
 */
export const getBookingById = async (bookingId) => {
  try {
    const response = await api.get(`/api/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Cancel a booking (REQUIRES AUTH)
 * @param {string} bookingId - Booking ID
 * @returns {Promise} Success message
 */
export const cancelBooking = async (bookingId) => {
  try {
    const response = await api.patch(`/api/bookings/${bookingId}/cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update booking status (ADMIN)
 * @param {string} bookingId - Booking ID
 * @param {string} status - New status (pending, confirmed, cancelled, completed)
 * @returns {Promise} Updated booking data
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await api.patch(`/api/bookings/${bookingId}`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a booking (ADMIN)
 * @param {string} bookingId - Booking ID
 * @returns {Promise} Success message
 */
export const deleteBooking = async (bookingId) => {
  try {
    const response = await api.delete(`/api/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== EXPORT DEFAULT ====================

export default api;
// frontend/src/components/BookingForm.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimeSlot from './TimeSlot';
import { getBookedSlots, createBooking } from '../utils/api';
import '../styles/BookingPage.css';
import { 
  generateTimeSlots, 
  isSlotBooked, 
  formatDate,
  getDateDisplayText,
  validatePhone,
  validateName,
  isSlotInPast,
  getMinutesUntilSlotCloses
} from "../utils/validation.js";

const SERVICES = [
  'Facial Treatment',
  'Hair Styling',
  'Makeup Artistry',
  'Nail Care',
  'Spa & Massage',
  'Bridal Package'
];

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: new Date(),
    timeSlots: []
  });

  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());

  // Memoize time slots generation
  const allTimeSlots = useMemo(() => generateTimeSlots(), []);

  // Update current time every minute instead of every second (reduces re-renders)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Changed from 1000ms to 60000ms (1 minute)

    return () => clearInterval(timer);
  }, []);

  // Fetch booked slots when date changes
  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        setLoadingSlots(true);
        const dateStr = formatDate(formData.date);
        const response = await getBookedSlots(dateStr);
        setBookedSlots(response.bookedSlots || []);
      } catch (error) {
        console.error('Error fetching booked slots:', error);
        setBookedSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchBookedSlots();
  }, [formData.date]);

  // Clear selected time slots if they become unavailable (optimized with useCallback)
  useEffect(() => {
    if (formData.timeSlots.length > 0) {
      const validSlots = formData.timeSlots.filter(slot => {
        const slotBooked = isSlotBooked(slot, bookedSlots);
        const slotPassed = isSlotInPast(slot, formData.date, currentTime);
        return !slotBooked && !slotPassed;
      });

      if (validSlots.length !== formData.timeSlots.length) {
        setFormData(prev => ({ ...prev, timeSlots: validSlots }));
      }
    }
  }, [bookedSlots, formData.date]); // Removed currentTime and formData.timeSlots from dependencies

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    setErrors(prev => {
      if (prev[name]) {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const handleDateChange = useCallback((date) => {
    setFormData(prev => ({ ...prev, date, timeSlots: [] }));
    setMessage({ type: '', text: '' });
  }, []);

  const handleTimeSlotSelect = useCallback((timeSlot) => {
    setFormData(prev => {
      const isSelected = prev.timeSlots.includes(timeSlot);
      
      if (isSelected) {
        return {
          ...prev,
          timeSlots: prev.timeSlots.filter(slot => slot !== timeSlot)
        };
      } else {
        return {
          ...prev,
          timeSlots: [...prev.timeSlots, timeSlot].sort()
        };
      }
    });
    
    setErrors(prev => {
      if (prev.timeSlots) {
        const newErrors = { ...prev };
        delete newErrors.timeSlots;
        return newErrors;
      }
      return prev;
    });
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!validateName(formData.name)) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    if (formData.timeSlots.length === 0) {
      newErrors.timeSlots = 'Please select at least one time slot';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.name, formData.phone, formData.service, formData.timeSlots.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setMessage({ type: '', text: '' });

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Create bookings for all selected time slots
      const bookingPromises = formData.timeSlots.map(timeSlot => {
        const bookingData = {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          service: formData.service,
          date: formatDate(formData.date),
          timeSlot: timeSlot,
          status: 'confirmed'
        };
        return createBooking(bookingData);
      });

      await Promise.all(bookingPromises);

      // Show success message
      const slotsCount = formData.timeSlots.length;
      setMessage({
        type: 'success',
        text: `Successfully booked ${slotsCount} time slot${slotsCount > 1 ? 's' : ''}!`
      });

      // Store current date before resetting
      const currentDate = formData.date;

      // Reset form
      setFormData({
        name: '',
        phone: '',
        service: '',
        date: new Date(),
        timeSlots: []
      });

      // Refresh booked slots only if still on the same date
      const dateStr = formatDate(currentDate);
      const slotsResponse = await getBookedSlots(dateStr);
      setBookedSlots(slotsResponse.bookedSlots || []);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          'Failed to create booking. Please try again.';
      setMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  // Memoize isToday calculation
  const isToday = useMemo(() => 
    formatDate(formData.date) === formatDate(new Date()),
    [formData.date]
  );

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      {/* Success/Error Message */}
      {message.text && (
        <div className={`message message-${message.type}`} role="alert">
          <span className="message-icon">
            {message.type === 'success' ? '✓' : '⚠'}
          </span>
          <span className="message-text">{message.text}</span>
        </div>
      )}

      {/* Name Input */}
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Full Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`form-input ${errors.name ? 'error' : ''}`}
          placeholder="Enter your full name"
          disabled={loading}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      {/* Phone Input */}
      <div className="form-group">
        <label htmlFor="phone" className="form-label">
          Phone Number <span className="required">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className={`form-input ${errors.phone ? 'error' : ''}`}
          placeholder="10-digit mobile number"
          maxLength="10"
          disabled={loading}
        />
        {errors.phone && <span className="error-message">{errors.phone}</span>}
      </div>

      {/* Service Selection */}
      <div className="form-group">
        <label htmlFor="service" className="form-label">
          Select Service <span className="required">*</span>
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleInputChange}
          className={`form-select ${errors.service ? 'error' : ''}`}
          disabled={loading}
        >
          <option value="">Choose a service</option>
          {SERVICES.map(service => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
        {errors.service && <span className="error-message">{errors.service}</span>}
      </div>

      {/* Date Selection */}
      <div className="form-group">
        <label htmlFor="date" className="form-label">
          Select Date <span className="required">*</span>
        </label>
        <div className="date-display">
          {getDateDisplayText(formData.date)}
        </div>
        <DatePicker
          selected={formData.date}
          onChange={handleDateChange}
          minDate={new Date()}
          dateFormat="dd MMMM yyyy"
          className="form-input"
          disabled={loading}
          inline
        />
      </div>

      {/* Time Slot Selection */}
      <div className="form-group">
        <label className="form-label">
          Select Time Slot(s) <span className="required">*</span>
        </label>
        
        {isToday && (
          <div className="live-time-notice">
            <span className="live-indicator">🔴</span>
            <span>Current Time: {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}

        {formData.timeSlots.length > 0 && (
          <div className="selected-slots-info">
            <span className="info-icon">ℹ️</span>
            <span>{formData.timeSlots.length} slot{formData.timeSlots.length > 1 ? 's' : ''} selected</span>
          </div>
        )}
        
        {loadingSlots ? (
          <div className="loading-slots">
            <div className="spinner"></div>
            <p>Loading available time slots...</p>
          </div>
        ) : (
          <>
            <div className="time-slots-grid">
              {allTimeSlots.map(slot => {
                const slotBooked = isSlotBooked(slot, bookedSlots);
                const slotPassed = isSlotInPast(slot, formData.date, currentTime);
                const isSelected = formData.timeSlots.includes(slot);
                const minutesUntilClose = getMinutesUntilSlotCloses(slot, formData.date, currentTime);
                
                return (
                  <TimeSlot
                    key={slot}
                    time={slot}
                    isBooked={slotBooked}
                    isPast={slotPassed}
                    isSelected={isSelected}
                    minutesUntilClose={minutesUntilClose}
                    onClick={handleTimeSlotSelect}
                    isToday={isToday}
                  />
                );
              })}
            </div>
            {errors.timeSlots && <span className="error-message">{errors.timeSlots}</span>}
            
            <div className="slots-legend">
              <div className="legend-item">
                <span className="legend-color available"></span>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <span className="legend-color selected"></span>
                <span>Selected</span>
              </div>
              <div className="legend-item">
                <span className="legend-color booked"></span>
                <span>Booked/Closed</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="submit-btn"
        disabled={loading || loadingSlots}
      >
        {loading ? (
          <>
            <span className="spinner small"></span>
            Processing...
          </>
        ) : (
          `Confirm Booking${formData.timeSlots.length > 1 ? 's' : ''}`
        )}
      </button>
    </form>
  );
};

export default BookingForm;
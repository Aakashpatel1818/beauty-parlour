// frontend/src/pages/BookingPage.jsx

import React from 'react';
import BookingForm from '../components/BookingForm';
import '../styles/BookingPage.css';

const BookingPage = () => {
  return (
    <div className="booking-page">
      {/* Floating Decorative Shapes */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Header Section */}
      <div className="booking-header">
        <div className="booking-header-content">
          <span className="booking-subtitle">Reserve Your Spot</span>
          <h1 className="booking-title">Book Your Appointment</h1>
          <p className="booking-description">
            Select your preferred date and time for a luxurious beauty experience
          </p>
        </div>
      </div>

      {/* Booking Form Container */}
      <div className="booking-container">
        <div className="booking-card">
          <BookingForm />
        </div>

        {/* Help Section */}
        <div className="help-section">
          <div className="help-card">
            <span className="help-icon">💬</span>
            <h3>Need Assistance?</h3>
            <p>Our team is here to help you with your booking</p>
            <a 
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '1111111111'}?text=Hi!%20I%20need%20help%20with%20booking`}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
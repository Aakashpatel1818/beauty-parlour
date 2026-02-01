// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingReviews: 0,
    totalServices: 0,
    todayBookings: 0
  });

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [reviewFilter, setReviewFilter] = useState('all');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setErrors({});
    try {
      await Promise.all([
        fetchBookings(),
        fetchReviews(),
        fetchServices()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      console.log('Fetching bookings from /all endpoint');

      const response = await axios.get(`${API_URL}/api/bookings/all`);
      console.log('Response:', response.data);
      
      const bookingsData = response.data.bookings || [];
      console.log('Bookings data:', bookingsData);
      
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setErrors(prev => ({ ...prev, bookings: null }));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Failed to load bookings.';
      
      if (error.response?.status === 400) {
        errorMessage = `Bad request: ${error.response?.data?.message || 'Please check your request.'}`;
      } else if (!error.response) {
        errorMessage = 'Cannot connect to server. Make sure the backend is running on port 5000.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setErrors(prev => ({ ...prev, bookings: errorMessage }));
      setBookings([]);
    }
  };

  const fetchReviews = async () => {
    try {
      let response;
      try {
        response = await axios.get(`${API_URL}/api/reviews/all`);
      } catch (err) {
        if (err.response?.status === 404) {
          response = await axios.get(`${API_URL}/api/reviews`);
        } else {
          throw err;
        }
      }
      
      const reviewsData = response.data.reviews || response.data.data || response.data || [];
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      setErrors(prev => ({ ...prev, reviews: null }));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      
      if (error.response?.status === 404) {
        setErrors(prev => ({ 
          ...prev, 
          reviews: 'Reviews endpoint not found. Please add the review routes to your backend.' 
        }));
      } else {
        setErrors(prev => ({ ...prev, reviews: null }));
      }
      setReviews([]);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/services`);
      
      const servicesData = response.data.services || response.data.data || response.data || [];
      setServices(Array.isArray(servicesData) ? servicesData : []);
      setErrors(prev => ({ ...prev, services: null }));
    } catch (error) {
      console.error('Error fetching services:', error);
      
      if (error.response?.status === 404) {
        setErrors(prev => ({ ...prev, services: 'Services endpoint not found' }));
      }
      setServices([]);
    }
  };

  const calculateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    
    setStats({
      totalBookings: bookings.length,
      pendingReviews: reviews.filter(r => !r.approved).length,
      totalServices: services.length,
      todayBookings: bookings.filter(b => {
        const bookingDate = new Date(b.date).toISOString().split('T')[0];
        return bookingDate === today;
      }).length
    });
  };

  useEffect(() => {
    calculateStats();
  }, [bookings, reviews, services]);

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(`${API_URL}/api/bookings/${bookingId}`, { status });
      
      setBookings(bookings.map(b => 
        b._id === bookingId ? { ...b, status } : b
      ));
      
      alert('Booking status updated successfully!');
    } catch (error) {
      console.error('Error updating booking:', error);
      alert(error.response?.data?.message || 'Failed to update booking status');
    }
  };

  const markAsCompleted = async (bookingId) => {
    try {
      await axios.patch(`${API_URL}/api/bookings/${bookingId}`, { status: 'completed' });
      
      setBookings(bookings.map(b => 
        b._id === bookingId ? { ...b, status: 'completed' } : b
      ));
      
      alert('Booking marked as completed successfully!');
    } catch (error) {
      console.error('Error updating booking:', error);
      alert(error.response?.data?.message || 'Failed to mark booking as completed');
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    
    try {
      await axios.delete(`${API_URL}/api/bookings/${bookingId}`);
      
      setBookings(bookings.filter(b => b._id !== bookingId));
      alert('Booking deleted successfully!');
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert(error.response?.data?.message || 'Failed to delete booking');
    }
  };

  const approveReview = async (reviewId) => {
    try {
      await axios.put(`${API_URL}/api/reviews/${reviewId}/approve`, {});
      
      setReviews(reviews.map(r => 
        r._id === reviewId ? { ...r, approved: true } : r
      ));
      
      alert('Review approved successfully!');
    } catch (error) {
      console.error('Error approving review:', error);
      alert(error.response?.data?.message || 'Failed to approve review');
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await axios.delete(`${API_URL}/api/reviews/${reviewId}`);
      
      setReviews(reviews.filter(r => r._id !== reviewId));
      alert('Review deleted successfully!');
      calculateStats();
    } catch (error) {
      console.error('Error deleting review:', error);
      alert(error.response?.data?.message || 'Failed to delete review');
    }
  };

  const saveService = async (serviceData) => {
    try {
      if (editingService) {
        await axios.put(`${API_URL}/api/services/${editingService._id}`, serviceData);
        alert('Service updated successfully!');
      } else {
        await axios.post(`${API_URL}/api/services`, serviceData);
        alert('Service added successfully!');
      }
      
      setShowServiceModal(false);
      setEditingService(null);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      alert(error.response?.data?.message || 'Failed to save service');
    }
  };

  const deleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await axios.delete(`${API_URL}/api/services/${serviceId}`);
      
      setServices(services.filter(s => s._id !== serviceId));
      alert('Service deleted successfully!');
    } catch (error) {
      console.error('Error deleting service:', error);
      alert(error.response?.data?.message || 'Failed to delete service');
    }
  };

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter);

  const filteredReviews = reviewFilter === 'all'
    ? reviews
    : reviewFilter === 'pending'
    ? reviews.filter(r => !r.approved)
    : reviews.filter(r => r.approved);

  const renderStats = () => (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon bookings">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
            <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
            <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
            <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
          </svg>
        </div>
        <div className="stat-info">
          <div className="stat-number">{stats.totalBookings}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon reviews">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div className="stat-info">
          <div className="stat-number">{stats.pendingReviews}</div>
          <div className="stat-label">Pending Reviews</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon services">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
            <polyline points="12 6 12 12 16 14" strokeWidth="2"/>
          </svg>
        </div>
        <div className="stat-info">
          <div className="stat-number">{stats.totalServices}</div>
          <div className="stat-label">Active Services</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon today">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div className="stat-info">
          <div className="stat-number">{stats.todayBookings}</div>
          <div className="stat-label">Today's Bookings</div>
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="data-section">
      <div className="section-header">
        <h2>Manage Bookings</h2>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All ({bookings.length})
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending ({bookings.filter(b => b.status === 'pending').length})
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('confirmed')}
          >
            Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Completed ({bookings.filter(b => b.status === 'completed').length})
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setStatusFilter('cancelled')}
          >
            Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
          </button>
        </div>
      </div>

      {errors.bookings && (
        <div className="error-message" style={{ 
          padding: '1rem', 
          margin: '1rem 0', 
          backgroundColor: '#fee', 
          border: '1px solid #fcc',
          borderRadius: '8px',
          color: '#c33'
        }}>
          <div style={{ marginBottom: '0.5rem' }}>⚠️ {errors.bookings}</div>
          <div style={{ fontSize: '0.85rem', color: '#666' }}>
            Check browser console for detailed error information.
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#7a7a7a' }}>
                  {errors.bookings ? 'Unable to load bookings' : 'No bookings found'}
                </td>
              </tr>
            ) : (
              filteredBookings.map(booking => (
                <tr key={booking._id || booking.id}>
                  <td>
                    <div>
                      <strong>{booking.name}</strong>
                      {booking.email && <div style={{ fontSize: '0.85rem', color: '#7a7a7a' }}>{booking.email}</div>}
                    </div>
                  </td>
                  <td>{booking.phone}</td>
                  <td>{booking.service}</td>
                  <td>{new Date(booking.date).toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</td>
                  <td>{booking.timeSlot || booking.time}</td>
                  <td>
                    <select
                      value={booking.status}
                      onChange={(e) => updateBookingStatus(booking._id || booking.id, e.target.value)}
                      className={`status-badge ${booking.status}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {booking.status !== 'completed' && (
                        <button
                          onClick={() => markAsCompleted(booking._id || booking.id)}
                          className="action-btn complete"
                          title="Mark as completed"
                        >
                          Completed
                        </button>
                      )}
                      <button
                        onClick={() => deleteBooking(booking._id || booking.id)}
                        className="action-btn delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="data-section">
      <div className="section-header">
        <h2>Manage Reviews</h2>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${reviewFilter === 'all' ? 'active' : ''}`}
            onClick={() => setReviewFilter('all')}
          >
            All ({reviews.length})
          </button>
          <button 
            className={`filter-btn ${reviewFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setReviewFilter('pending')}
          >
            Pending ({reviews.filter(r => !r.approved).length})
          </button>
          <button 
            className={`filter-btn ${reviewFilter === 'approved' ? 'active' : ''}`}
            onClick={() => setReviewFilter('approved')}
          >
            Approved ({reviews.filter(r => r.approved).length})
          </button>
        </div>
      </div>

      {errors.reviews && (
        <div className="error-message" style={{ 
          padding: '1rem', 
          margin: '1rem 0', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffc107',
          borderRadius: '8px',
          color: '#856404'
        }}>
          ⚠️ {errors.reviews}
        </div>
      )}

      <div className="reviews-list">
        {filteredReviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#7a7a7a' }}>
            {errors.reviews ? 'Reviews feature not available' : 'No reviews found'}
          </div>
        ) : (
          filteredReviews.map(review => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <div>
                  <h3>{review.name}</h3>
                  <div className="stars">
                    {'⭐'.repeat(review.rating)}
                  </div>
                </div>
                <span className={`status-badge ${review.approved ? 'approved' : 'pending'}`}>
                  {review.approved ? 'Approved' : 'Pending'}
                </span>
              </div>
              <p className="review-comment">{review.comment}</p>
              <div className="review-meta">
                <span>{review.service}</span>
                <span>{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="review-actions">
                {!review.approved && (
                  <button
                    onClick={() => approveReview(review._id)}
                    className="action-btn approve"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => deleteReview(review._id)}
                  className="action-btn delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="data-section">
      <div className="section-header">
        <h2>Manage Services</h2>
        <button
          onClick={() => {
            setEditingService(null);
            setShowServiceModal(true);
          }}
          className="add-btn"
        >
          + Add Service
        </button>
      </div>

      {errors.services && (
        <div className="error-message" style={{ 
          padding: '1rem', 
          margin: '1rem 0', 
          backgroundColor: '#fee', 
          border: '1px solid #fcc',
          borderRadius: '8px',
          color: '#c33'
        }}>
          ⚠️ {errors.services}
        </div>
      )}

      <div className="services-grid">
        {services.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#7a7a7a' }}>
            No services found
          </div>
        ) : (
          services.map(service => (
            <div key={service._id} className="service-card">
              <h3>{service.name}</h3>
              <div className="service-details">
                <p><strong>Duration:</strong> {service.duration}</p>
                {service.price && <p><strong>Price:</strong> ₹{service.price}</p>}
                {service.description && <p><strong>Description:</strong> {service.description}</p>}
              </div>
              <div className="service-actions">
                <button
                  onClick={() => {
                    setEditingService(service);
                    setShowServiceModal(true);
                  }}
                  className="action-btn edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteService(service._id)}
                  className="action-btn delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderTimeSlots = () => (
    <div className="data-section">
      <div className="section-header">
        <h2>Time Slots Configuration</h2>
      </div>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p className="info-text">
          Time slots are automatically generated from 9:00 AM to 6:00 PM with 30-minute intervals.
        </p>
        <p className="info-text" style={{ marginTop: '1rem' }}>
          To customize business hours or block specific dates, please implement the timeslots API endpoint.
        </p>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your beauty parlour services, bookings, and reviews</p>
        </div>

        {renderStats()}

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
          <button
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
          <button
            className={`tab ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            Services
          </button>
          <button
            className={`tab ${activeTab === 'timeSlots' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeSlots')}
          >
            Time Slots
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'bookings' && renderBookings()}
            {activeTab === 'reviews' && renderReviews()}
            {activeTab === 'services' && renderServices()}
            {activeTab === 'timeSlots' && renderTimeSlots()}
          </>
        )}
      </div>

      {showServiceModal && (
        <ServiceModal
          service={editingService}
          onClose={() => {
            setShowServiceModal(false);
            setEditingService(null);
          }}
          onSave={saveService}
        />
      )}
    </div>
  );
};

const ServiceModal = ({ service, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    duration: service?.duration || '',
    price: service?.price || '',
    description: service?.description || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{service ? 'Edit Service' : 'Add New Service'}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Service Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Bridal Makeup"
            />
          </div>
          <div className="form-group">
            <label>Duration *</label>
            <input
              type="text"
              placeholder="e.g., 60 min"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              placeholder="e.g., 1500"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              placeholder="Brief description of the service"
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
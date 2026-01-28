import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import ServiceCard from '../components/ServiceCard.jsx';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('/api/services')
      .then(res => {
        // Handle different API response structures
        const servicesData = Array.isArray(res.data) 
          ? res.data 
          : (res.data.services || res.data.data || []);
        setServices(servicesData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching services:', err);
        setServices([]);
        setLoading(false);
      });
  }, []);

  const categories = ['all', 'facial', 'hair', 'makeup', 'nails', 'spa', 'bridal'];

  const filteredServices = Array.isArray(services) ? services.filter(service => {
    const matchesFilter = filter === 'all' || 
                         (service.category && service.category.toLowerCase() === filter);
    const matchesSearch = searchTerm === '' || 
                         (service.name && service.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  }) : [];

  return (
    <>
      <Helmet>
        <title>Our Services - Luxe Beauty Studio</title>
        <meta name="description" content="Explore our comprehensive range of luxury beauty treatments and services" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Helmet>

      <style>{`
        .services-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #faf8f5 0%, #ffffff 100%);
          font-family: 'Montserrat', sans-serif;
        }

        .services-header {
          background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
          color: white;
          padding: 8rem 2rem 4rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .services-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="2" fill="rgba(212,165,116,0.1)"/></svg>');
          opacity: 0.3;
        }

        .services-header-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
          animation: fadeInUp 1s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .services-subtitle {
          font-size: 0.9rem;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #d4a574;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .services-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 300;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .services-description {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.8);
          max-width: 600px;
          margin: 0 auto;
        }

        .services-controls {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2rem 2rem;
        }

        .search-bar {
          max-width: 500px;
          margin: 0 auto 2rem;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 1rem 1.5rem 1rem 3.5rem;
          border: 2px solid #f5e6d3;
          border-radius: 50px;
          font-size: 1rem;
          font-family: 'Montserrat', sans-serif;
          transition: all 0.3s ease;
          background: white;
        }

        .search-input:focus {
          outline: none;
          border-color: #d4a574;
          box-shadow: 0 5px 20px rgba(212, 165, 116, 0.2);
        }

        .search-icon {
          position: absolute;
          left: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: #d4a574;
          font-size: 1.2rem;
        }

        .filter-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .filter-btn {
          padding: 0.75rem 1.5rem;
          border: 2px solid #f5e6d3;
          background: white;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Montserrat', sans-serif;
          text-transform: capitalize;
          color: #2c2c2c;
        }

        .filter-btn:hover {
          border-color: #d4a574;
          transform: translateY(-2px);
        }

        .filter-btn.active {
          background: #d4a574;
          color: white;
          border-color: #d4a574;
        }

        .services-grid-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          animation: fadeIn 0.8s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 1.5rem;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid #f5e6d3;
          border-top-color: #d4a574;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-text {
          font-size: 1.1rem;
          color: #7a7a7a;
        }

        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          color: #7a7a7a;
        }

        .no-results-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .no-results-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #2c2c2c;
        }

        .no-results-text {
          font-size: 1rem;
        }

        .services-count {
          text-align: center;
          color: #7a7a7a;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }

        .services-count strong {
          color: #d4a574;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .services-header {
            padding: 6rem 1.5rem 3rem;
          }

          .services-title {
            font-size: 2rem;
          }

          .services-subtitle {
            font-size: 0.75rem;
            letter-spacing: 2px;
          }

          .services-controls {
            padding: 2rem 1rem 1rem;
          }

          .filter-buttons {
            gap: 0.5rem;
          }

          .filter-btn {
            padding: 0.6rem 1.2rem;
            font-size: 0.85rem;
          }

          .services-grid-container {
            padding: 1rem;
          }

          .services-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .search-input {
            font-size: 0.95rem;
          }
        }

        @media (max-width: 480px) {
          .services-header {
            padding: 5rem 1rem 2rem;
          }

          .search-bar {
            padding: 0 1rem;
          }

          .filter-buttons {
            padding: 0 1rem;
          }
        }
      `}</style>

      <div className="services-page">
        {/* Header Section */}
        <div className="services-header">
          <div className="services-header-content">
            <div className="services-subtitle">Discover Excellence</div>
            <h1 className="services-title">Our Services</h1>
            <p className="services-description">
              Explore our comprehensive range of luxury beauty treatments designed to bring out your natural radiance
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="services-controls">
          {/* Search Bar */}
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Buttons */}
          <div className="filter-buttons">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${filter === category ? 'active' : ''}`}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Services Count */}
          {!loading && filteredServices.length > 0 && (
            <div className="services-count">
              Showing <strong>{filteredServices.length}</strong> {filteredServices.length === 1 ? 'service' : 'services'}
            </div>
          )}
        </div>

        {/* Services Grid */}
        <div className="services-grid-container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="loading-text">Loading our services...</div>
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="services-grid">
              {filteredServices.map(service => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3 className="no-results-title">No Services Found</h3>
              <p className="no-results-text">
                Try adjusting your search or filter to find what you're looking for
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Services;
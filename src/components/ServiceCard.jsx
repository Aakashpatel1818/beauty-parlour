import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      textAlign: 'center'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
    }}
    >
      <img
        src={service.image || 'https://via.placeholder.com/400x300?text=Service'}
        alt={service.name}
        style={{ width: '100%', height: '220px', objectFit: 'cover' }}
        loading="lazy"
      />
      <div style={{ padding: '1.2rem' }}>
        <h3 style={{ color: '#FFB6C1', margin: '0.5rem 0' }}>{service.name}</h3>
        <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0.8rem' }}>
          {service.description || 'Professional service with premium products'}
        </p>
        <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#D4AF37' }}>
          ₹{service.price} • {service.duration} min
        </p>
        <Link to={`/booking?service=${service._id}`}>
          <button style={{
            backgroundColor: '#FFB6C1',
            color: 'white',
            border: 'none',
            padding: '0.8rem 2rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '0.8rem',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={e => e.target.style.backgroundColor = '#D4AF37'}
          onMouseOut={e => e.target.style.backgroundColor = '#FFB6C1'}
          >
            Book Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
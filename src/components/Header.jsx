import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{
      backgroundColor: '#F5F5DC',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <h1 style={{ color: '#FFB6C1', margin: 0, fontFamily: "'Playfair Display', serif" }}>GlamStudio</h1>
      <nav style={{ display: 'flex', gap: '1.5rem' }}>
        <Link to="/" style={navStyle}>Home</Link>
        <Link to="/services" style={navStyle}>Services</Link>
        <Link to="/booking" style={navStyle}>Book Now</Link>
        <Link to="/gallery" style={navStyle}>Gallery</Link>
        <Link to="/reviews" style={navStyle}>Reviews</Link>
        <Link to="/admin" style={navStyle}>Admin</Link>
      </nav>
    </header>
  );
};

const navStyle = {
  color: '#4B0082',
  textDecoration: 'none',
  fontWeight: 500,
  transition: 'color 0.3s'
};

export default Header;
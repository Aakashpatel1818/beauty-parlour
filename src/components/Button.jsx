import React from 'react';

const Button = ({ children, onClick, secondary = false, style = {} }) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: secondary ? 'transparent' : '#FFB6C1',
        color: secondary ? '#FFB6C1' : 'white',
        border: secondary ? '2px solid #D4AF37' : 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.3s',
        ...style
      }}
      onMouseOver={e => {
        if (!secondary) e.target.style.backgroundColor = '#D4AF37';
        else e.target.style.backgroundColor = '#FFB6C1';
      }}
      onMouseOut={e => {
        if (!secondary) e.target.style.backgroundColor = '#FFB6C1';
        else e.target.style.backgroundColor = 'transparent';
      }}
    >
      {children}
    </button>
  );
};

export default Button;
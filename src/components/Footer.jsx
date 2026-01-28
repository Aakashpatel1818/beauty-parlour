import React from 'react';

const Footer = () => {
  const whatsappNumber =import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';

  return (
    <footer
      style={{
        backgroundColor: '#F5F5DC',
        padding: '2rem 1rem',
        textAlign: 'center',
        marginTop: 'auto',
      }}
    >
      <p style={{ color: '#D4AF37', marginBottom: '1rem' }}>
        © {new Date().getFullYear()} GlamStudio Beauty Parlour. All Rights Reserved.
      </p>

      <a
        href={`https://wa.me/${whatsappNumber}?text=Hello%20GlamStudio!`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          backgroundColor: '#25D366',
          color: 'white',
          padding: '0.8rem 1.5rem',
          borderRadius: '30px',
          textDecoration: 'none',
          fontWeight: 'bold',
        }}
      >
        Chat with Us on WhatsApp
      </a>
    </footer>
  );
};

export default Footer;

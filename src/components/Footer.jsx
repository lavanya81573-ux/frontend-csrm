import React from 'react';

export const Footer = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '16px 24px',
      fontSize: '0.8rem',
      color: '#94a3b8',
      borderTop: '1px solid #e2e8f0',
      backgroundColor: '#ffffff',
      marginTop: 'auto'
    }}>
      Campus Smart Resource Management System (CSRM) &copy; {new Date().getFullYear()} &bull; Academic Enterprise Edition
    </footer>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedAccess = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '40px',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '4rem',
        marginBottom: '24px'
      }}>
        🔒
      </div>
      <h1 style={{
        fontSize: '2.5rem',
        color: '#1f2937',
        marginBottom: '16px',
        fontWeight: '700'
      }}>
        Access Restricted
      </h1>
      <p style={{
        fontSize: '1.125rem',
        color: '#6b7280',
        marginBottom: '32px',
        maxWidth: '500px',
        lineHeight: '1.6'
      }}>
        This page requires authentication. Please log in to access healthcare management features.
      </p>
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Link
          to="/login"
          style={{
            padding: '12px 24px',
            backgroundColor: '#2c5aa0',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
        >
          Login
        </Link>
        <Link
          to="/signup"
          style={{
            padding: '12px 24px',
            backgroundColor: 'transparent',
            color: '#2c5aa0',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            border: '2px solid #2c5aa0',
            transition: 'all 0.2s ease'
          }}
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2c5aa0',
    padding: '12px 24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  const logoStyle = {
    fontSize: '1.5rem',
    color: 'white',
    textDecoration: 'none',
    fontWeight: '700',
  };

  const linksContainerStyle = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  };

  const buttonStyle = {
    ...linkStyle,
    backgroundColor: 'transparent',
    border: '2px solid rgba(255,255,255,0.3)',
    cursor: 'pointer',
  };

  const primaryButtonStyle = {
    ...linkStyle,
    backgroundColor: '#ffffff',
    color: '#2c5aa0',
    fontWeight: '600',
    border: 'none',
  };

  const userInfoStyle = {
    color: 'white',
    fontSize: '0.9rem',
    marginRight: '16px',
    opacity: '0.9',
  };

  return (
    <nav style={navbarStyle}>
      <Link to="/" style={logoStyle}>HealthTech Solutions</Link>
      <div style={linksContainerStyle}>
        <Link 
          to="/home" 
          style={linkStyle} 
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'} 
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          Home
        </Link>
        <Link 
          to="/about" 
          style={linkStyle} 
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'} 
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          About
        </Link>
        
        {isAuthenticated ? (
          <>
            {user && (
              <span style={userInfoStyle}>
                Welcome, {user.username}
              </span>
            )}
            <button 
              onClick={handleLogout}
              style={primaryButtonStyle}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f1f5f9'} 
              onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              style={buttonStyle} 
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'} 
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              style={primaryButtonStyle} 
              onMouseOver={(e) => e.target.style.backgroundColor = '#f1f5f9'} 
              onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
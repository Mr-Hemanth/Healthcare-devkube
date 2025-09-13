import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const errors = {};
    
    if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setFieldErrors({});
    
    try {
      await axios.post('http://localhost:5002/api/signup', { 
        username,
        email,
        password,
      });
      
      setSuccessMessage('Account created successfully! Redirecting...');
      
      // Auto-login after successful signup
      const userData = {
        username,
        email,
        role: 'user'
      };
      
      login('user_token', userData);
      
      // Clear form
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      // Redirect to home after successful signup and login
      setTimeout(() => {
        navigate('/home');
      }, 1500);
      
    } catch (error) {
      console.error('Error signing up:', error);
      
      if (error.response && error.response.data) {
        const errorMsg = error.response.data.message;
        
        // Handle specific field errors
        if (errorMsg.includes('Username already taken')) {
          setFieldErrors({ username: 'This username is already taken' });
        } else if (errorMsg.includes('Email already in use')) {
          setFieldErrors({ email: 'This email is already registered' });
        } else {
          setErrorMessage(errorMsg);
        }
      } else {
        setErrorMessage('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Create Your Account</h2>
      <form onSubmit={handleSignup} style={formStyle}>
        <div style={fieldContainerStyle}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              ...inputStyle,
              borderColor: fieldErrors.username ? '#dc2626' : '#d1d5db'
            }}
          />
          {fieldErrors.username && (
            <span style={fieldErrorStyle}>{fieldErrors.username}</span>
          )}
        </div>

        <div style={fieldContainerStyle}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              ...inputStyle,
              borderColor: fieldErrors.email ? '#dc2626' : '#d1d5db'
            }}
          />
          {fieldErrors.email && (
            <span style={fieldErrorStyle}>{fieldErrors.email}</span>
          )}
        </div>

        <div style={fieldContainerStyle}>
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              ...inputStyle,
              borderColor: fieldErrors.password ? '#dc2626' : '#d1d5db'
            }}
          />
          {fieldErrors.password && (
            <span style={fieldErrorStyle}>{fieldErrors.password}</span>
          )}
        </div>

        <div style={fieldContainerStyle}>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              ...inputStyle,
              borderColor: fieldErrors.confirmPassword ? '#dc2626' : '#d1d5db'
            }}
          />
          {fieldErrors.confirmPassword && (
            <span style={fieldErrorStyle}>{fieldErrors.confirmPassword}</span>
          )}
        </div>

        <button 
          type="submit" 
          style={{
            ...buttonStyle,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        {successMessage && (
          <div style={successMessageStyle}>
            <span>✅ {successMessage}</span>
          </div>
        )}
        
        {errorMessage && (
          <div style={errorMessageStyle}>
            <span>❌ {errorMessage}</span>
          </div>
        )}

        <div style={loginLinkStyle}>
          Already have an account? <a href="/login" style={linkStyle}>Login here</a>
        </div>
      </form>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#fafbfc',
  padding: '20px',
};

const headingStyle = {
  marginBottom: '24px',
  fontSize: '2rem',
  color: '#1f2937',
  fontWeight: '700',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '400px',
  width: '100%',
  margin: '20px',
  padding: '32px',
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

const fieldContainerStyle = {
  marginBottom: '20px',
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '6px',
  border: '2px solid #d1d5db',
  fontSize: '16px',
  transition: 'border-color 0.2s ease',
  boxSizing: 'border-box',
};

const fieldErrorStyle = {
  display: 'block',
  color: '#dc2626',
  fontSize: '14px',
  marginTop: '4px',
  fontWeight: '500',
};

const buttonStyle = {
  padding: '14px 16px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: '#2c5aa0',
  color: 'white',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  marginBottom: '16px',
};

const successMessageStyle = {
  padding: '12px',
  backgroundColor: '#d1fae5',
  color: '#065f46',
  borderRadius: '6px',
  marginBottom: '16px',
  border: '1px solid #a7f3d0',
  textAlign: 'center',
};

const errorMessageStyle = {
  padding: '12px',
  backgroundColor: '#fef2f2',
  color: '#dc2626',
  borderRadius: '6px',
  marginBottom: '16px',
  border: '1px solid #fecaca',
  textAlign: 'center',
};

const loginLinkStyle = {
  textAlign: 'center',
  fontSize: '14px',
  color: '#6b7280',
};

const linkStyle = {
  color: '#2c5aa0',
  textDecoration: 'none',
  fontWeight: '600',
};

export default Signup;
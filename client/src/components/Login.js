import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Link, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Get the intended destination before login
  const from = location.state?.from?.pathname || '/home';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isAdminLogin) {
        if (adminUsername === 'admin' && adminPassword === 'admin123') {
          // Admin login
          const adminData = { username: 'admin', role: 'admin' };
          login('admin_token', adminData);
          navigate('/admin');
        } else {
          setError('Invalid admin credentials');
        }
      } else {
        const isEmail = identifier.includes('@');
        const payload = isEmail ? { email: identifier, password } : { username: identifier, password };
        
        const response = await axios.post('http://localhost:5002/api/login', payload);

        if (response.data.message === 'Login successful') {
          // Create user data object
          const userData = {
            username: isEmail ? response.data.username || identifier.split('@')[0] : identifier,
            email: isEmail ? identifier : response.data.email || '',
            role: 'user'
          };
          
          // Use AuthContext login
          login('user_token', userData);
          
          // Navigate to intended destination
          navigate(from, { replace: true });
        } else {
          setError('Invalid email/username or password');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email/username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      {location.state?.from && (
        <Box sx={{ 
          backgroundColor: '#fef3c7', 
          padding: '12px', 
          borderRadius: '6px', 
          marginBottom: '20px',
          border: '1px solid #f59e0b'
        }}>
          <Typography variant="body2" sx={{ color: '#92400e', textAlign: 'center' }}>
            Please log in to access {location.state.from.pathname.replace('/', '').replace('-', ' ')} page
          </Typography>
        </Box>
      )}
      
      <Typography variant="h4" align="center" gutterBottom>Login</Typography>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <TextField
          label="Email or Username"
          type="text"
          variant="outlined"
          fullWidth
          margin="normal"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <Typography color="error" textAlign="center">{error}</Typography>}
        
        <Button 
          variant="contained" 
          color="primary" 
          type="submit" 
          fullWidth 
          disabled={loading}
          sx={{ marginTop: '16px' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <FormControlLabel
        control={<Checkbox checked={isAdminLogin} onChange={() => setIsAdminLogin(!isAdminLogin)} />}
        label="Admin Login"
      />
      
      {isAdminLogin && (
        <Box style={{ marginTop: '20px' }}>
          <Typography variant="h6" align="center">Admin Login</Typography>
          <TextField
            label="Admin Username"
            type="text"
            variant="outlined"
            fullWidth
            margin="normal"
            value={adminUsername}
            onChange={(e) => setAdminUsername(e.target.value)}
            required
          />
          <TextField
            label="Admin Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            required
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit} 
            fullWidth 
            disabled={loading}
            sx={{ marginTop: '16px' }}
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </Button>
        </Box>
      )}

      <Typography variant="body2" align="center" sx={{ marginTop: '10px' }}>
        Don't have an account? 
        <Link href="/signup" sx={{ marginLeft: '5px' }}>Sign up here</Link>
      </Typography>
    </Box>
  );
};

export default Login;

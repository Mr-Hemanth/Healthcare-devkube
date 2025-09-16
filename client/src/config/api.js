// API Configuration
// This file centralizes all API endpoint configuration
// Supports different environments (development, production, Kubernetes)

import axios from 'axios';

const getApiBaseUrl = () => {
  // Priority order:
  // 1. Environment variable (set at build time)
  // 2. Window object (can be set by deployment)
  // 3. Relative path (for Kubernetes with ingress/proxy)
  // 4. Development fallback

  // Check for build-time environment variable
  if (process.env.REACT_APP_API_BASE_URL) {
    // If empty string, use relative paths (for ingress)
    if (process.env.REACT_APP_API_BASE_URL === '') {
      return '';
    }
    return process.env.REACT_APP_API_BASE_URL;
  }

  // Check for runtime configuration
  if (window.API_BASE_URL) {
    return window.API_BASE_URL;
  }

  // Check if we're in production/Kubernetes
  if (process.env.NODE_ENV === 'production') {
    // For local testing with port-forward, use localhost:8080
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8080';
    }
    // For ingress setup, use relative paths (no base URL)
    // This allows both /api/* and frontend routes to work through the same domain
    return '';
  }

  // Development fallback
  return 'http://localhost:5002';
};

// Export the base URL
export const API_BASE_URL = getApiBaseUrl();

// Export common API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/login',
  SIGNUP: '/api/signup',

  // User management
  USERS: '/api/users',

  // Healthcare endpoints
  APPOINTMENTS: '/api/appointments',
  RECORDS: '/api/records',
  BILLINGS: '/api/billings',

  // Health check
  HEALTH: '/health',
  METRICS: '/metrics'
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Export configured axios instance (optional)
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config?.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ API Response Error: ${error.response?.status} ${error.config?.url}`, error.message);
    return Promise.reject(error);
  }
);

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  buildApiUrl,
  apiClient
};
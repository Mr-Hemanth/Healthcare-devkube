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

    // For Kubernetes deployment, always use ingress IP for proper API routing
    // This ensures API calls go through the ingress which routes /api/* to backend
    return 'http://34.93.179.126';
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

// Add request interceptor for comprehensive debugging
apiClient.interceptors.request.use(
  (config) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`[${timestamp}] 🔧 Base URL: ${config.baseURL}`);
    console.log(`[${timestamp}] 📊 Headers:`, config.headers);

    if (config.data) {
      console.log(`[${timestamp}] 📤 Request Data:`, config.data);
    }

    return config;
  },
  (error) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ❌ API Request Error:`, error);
    console.error(`[${timestamp}] 🔧 Error Details:`, {
      message: error.message,
      code: error.code,
      config: error.config
    });
    return Promise.reject(error);
  }
);

// Add response interceptor for comprehensive debugging
apiClient.interceptors.response.use(
  (response) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ✅ API Response: ${response.status} ${response.config?.url}`);
    console.log(`[${timestamp}] 📥 Response Data:`, response.data);
    console.log(`[${timestamp}] ⏱️ Response Time: ${Date.now() - (response.config.metadata?.startTime || Date.now())}ms`);

    return response;
  },
  (error) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ❌ API Response Error: ${error.response?.status} ${error.config?.url}`);
    console.error(`[${timestamp}] 🔧 Error Details:`, {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });

    // Additional network error handling
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      console.error(`[${timestamp}] 🌐 Network Error: Unable to reach API server`);
      console.error(`[${timestamp}] 🔗 Check if backend is running and accessible`);
      console.error(`[${timestamp}] 🎯 Target URL: ${error.config?.baseURL}${error.config?.url}`);
    }

    return Promise.reject(error);
  }
);

// Add timing metadata to requests
apiClient.interceptors.request.use((config) => {
  config.metadata = { startTime: Date.now() };
  return config;
});

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  buildApiUrl,
  apiClient
};
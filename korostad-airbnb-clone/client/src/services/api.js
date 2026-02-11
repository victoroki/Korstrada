import axios from 'axios';

const isProduction = import.meta.env.PROD;
const PRODUCTION_URL = 'https://kor-victors-projects-110783d5.vercel.app/api';
let API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || (isProduction ? PRODUCTION_URL : 'http://localhost:5000/api');

// If we are in production and the URL still points to localhost, 
// it's likely a misconfiguration in the .env file.
if (isProduction && API_BASE_URL.includes('localhost')) {
  API_BASE_URL = PRODUCTION_URL;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for sending cookies
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
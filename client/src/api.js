import axios from 'axios';

// Create an axios instance that automatically picks the right URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

export default api;

// Deployment Fix v1
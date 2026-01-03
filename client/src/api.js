import axios from 'axios';

const api = axios.create({
  baseURL: 'https://daily-cosmos-1.onrender.com/api'
});

// 🛡️ THE INTERCEPTOR (The Fix)
// This code runs automatically before every single request.
// It grabs the token from storage and attaches it to the header.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

//baseURL: 'https://daily-cosmos-1.onrender.com/api' 
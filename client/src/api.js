import axios from 'axios';

// 1. Create the API instance pointing to Render
const api = axios.create({
  baseURL: 'https://daily-cosmos-1.onrender.com/api'
});

// 2. The "Universal" Interceptor
// We send the token in TWO different pockets to be 100% sure the server finds it.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Pocket 1: Standard MERN stack approach
      config.headers['x-auth-token'] = token;
      
      // Pocket 2: Standard Industry approach (Bearer)
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

//baseURL: 'https://daily-cosmos-1.onrender.com/api' 
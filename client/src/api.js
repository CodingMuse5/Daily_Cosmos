import axios from 'axios';

// FORCE the app to use the Render Cloud URL
// We are hardcoding it so it CANNOT fail to find it.
const api = axios.create({
  baseURL: 'https://daily-cosmos.onrender.com/api'
});

export default api;
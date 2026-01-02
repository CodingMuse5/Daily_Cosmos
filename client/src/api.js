import axios from 'axios';

// FORCE the app to use the Render Cloud URL
// We are hardcoding it so it CANNOT fail to find it.
const api = axios.create({
  // Update this line below with your NEW URL (daily-cosmos-1)
  baseURL: 'https://daily-cosmos-1.onrender.com/api' 
});

export default api;
import axios from 'axios';

// Follow a common RESTful API convention. 
// /api Common base path used to indicate that these routes are part of the application's API
// /auth specifies that the routes under this path are related to authentication
const API_URL = 'http://localhost:5001/api/auth';

// POST request to the backend to register a new user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/sign-up`, userData);
  return response.data;
};

// POST request to the backend to log in a user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

export default {
  register,
  login,
};

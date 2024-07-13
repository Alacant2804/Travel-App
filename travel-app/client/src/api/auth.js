import axios from 'axios';

// Follow a common RESTful API convention. 
// /api Common base path used to indicate that these routes are part of the application's API
// /auth specifies that the routes under this path are related to authentication

// Base URL for the authentication API
const API_URL = import.meta.env.VITE_API_URL;
// Register a new user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/sign-up`, userData, { withCredentials: true });
  return response.data;
};

// Log in a user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData, { withCredentials: true });
  return response.data;
};

// Log out a user
const logout = async () => {
  const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  return response.data;
};

export default {
  register,
  login,
  logout
};
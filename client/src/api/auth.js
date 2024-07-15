import axios from 'axios';

// Base URL for the authentication API
const API_URL = import.meta.env.VITE_API_URL;

// Register a new user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/sign-up`, userData, { withCredentials: true });
  return response.data;
};

// Log in a user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/login`, userData, { withCredentials: true });
  return response.data;
};

// Log out a user
const logout = async () => {
  const response = await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
  return response.data;
};

export default {
  register,
  login,
  logout
};
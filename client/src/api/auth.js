import axios from "../utils/axiosConfig.js";

// Register a new user
const register = async (userData) => {
  const response = await axios.post("/auth/sign-up", userData);
  return response.data;
};

// Log in a user
const login = async (userData) => {
  const response = await axios.post("/auth/login", userData);
  return response.data;
};

// Log out a user
const logout = async () => {
  localStorage.removeItem("token");
};

export default {
  register,
  login,
  logout,
};

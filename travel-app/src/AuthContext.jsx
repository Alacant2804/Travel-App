import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import authService from './api/auth';
import {useNavigate} from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('token', response.token);
      setUser(response.user);
      console.log('User logged in:', response.user); // Log the user data
      navigate('/');
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register({ username, email, password });
      await login(email, password); // Ensure the user is logged in after registration
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  // Fetch user function
  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://localhost:5001/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        logout();
      }
    }
  };

  // Fetch user on component mount
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
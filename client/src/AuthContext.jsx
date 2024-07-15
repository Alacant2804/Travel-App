import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import axios from 'axios';
import authService from './api/auth';
import { toast } from 'react-toastify';

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
      setUser(response.user);
      toast.success('Login successful!', {
        theme: "colored"
      });
      navigate('/');
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Login failed');
      toast.error(error.response ? error.response.data.message : 'Login failed', {
        theme: "colored"
      });
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
      toast.success('User signed up successfully!', {
        theme: "colored"
      });
      await login(email, password); // Logs in the user after registration
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Registration failed');
      toast.error(error.response ? error.response.data.message : 'Registration failed', {
        theme: "colored"
      });
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout({ withCredentials: true });
      setUser(null);
      navigate('/');
      toast.success('Logged out!', {
        theme: "colored"
      });
    } catch (error) {
      toast.error('Error during logout', {
        theme: "colored"
      });
    }
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/api/auth/user', { withCredentials: true });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      if (error.response && error.response.status === 401) {
        // Handle the case when user is not authenticated
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch user on component mount
  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    <Loading />;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
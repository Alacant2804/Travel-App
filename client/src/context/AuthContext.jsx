import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../styles/loader/Loading";
import axios from "axios";
import authService from "../api/auth";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Login function
  const login = async (email, password) => {
    console.log("Login function called");
    setLoading(true);
    setError(null);
    try {
      console.log("Try block started");
      const response = await authService.login({ email, password });
      console.log("Token:", response.token);
      localStorage.setItem("token", response.token);
      setUser(response.user);
      toast.success("Login successful!", {
        theme: "colored",
      });
      navigate("/");
    } catch (error) {
      setError(error.response ? error.response.data.message : "Login failed");
      toast.error(
        error.response ? error.response.data.message : "Login failed",
        {
          theme: "colored",
        }
      );
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
      toast.success("User signed up successfully!", {
        theme: "colored",
      });
      await login(email, password); // Logs in the user after registration
    } catch (error) {
      setError(
        error.response ? error.response.data.message : "Registration failed"
      );
      toast.error(
        error.response ? error.response.data.message : "Registration failed",
        {
          theme: "colored",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/");
      toast.success("Logged out!", {
        theme: "colored",
      });
    } catch (error) {
      toast.error("Error during logout", {
        theme: "colored",
      });
    }
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // If there's no token, the user is not logged in
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
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
    return <Loading />;
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

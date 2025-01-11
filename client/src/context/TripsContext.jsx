import { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { getToken } from '../util/util';

export const TripsContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const TripsProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchTrips = useCallback(async () => {
    if (!user) return;
    try {
      const token = getToken();
      const response = await axios.get(`${API_URL}/trips`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTrips(response.data.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return (
    <TripsContext.Provider
      value={{ trips, setTrips, fetchTrips }}
    >
      {children}
    </TripsContext.Provider>
  );
};

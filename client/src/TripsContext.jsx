import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

export const TripsContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const TripsProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchTrips = useCallback(async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${API_URL}/trips`, { withCredentials: true });
      setTrips(response.data);
      console.log('Fetched trips:', response.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const addTrip = async (tripData) => {
    try {
      const response = await axios.post(`${API_URL}/trips`, tripData, { withCredentials: true })
      setTrips([...trips, response.data]);
      toast.success('Trip added successfully!', {
        theme: "colored"
      });
    } catch (error) {
      toast.error('Error adding trip. Please try again.', {
        theme: "colored"
      });
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      const response = await axios.delete(`${API_URL}/trips/${tripId}`, { withCredentials: true });
      
      if (response.status === 200) {
        const updatedTrips = trips.filter(trip => trip._id !== tripId);
        setTrips(updatedTrips);
        toast.success('Trip deleted successfully!', {
          theme: 'colored'
        });
      } else {
        toast.error('Error deleting trip. Please try again.', {
          theme: "colored"
        });
      }
    } catch (error) {
      toast.error('Error deleting trip. Please try again.', {
        theme: "colored"
      });
      console.error('Error deleting trip:', error);
    }
  }

  return (
    <TripsContext.Provider value={{ trips, setTrips, fetchTrips, addTrip, deleteTrip }}>
      {children}
    </TripsContext.Provider>
  );
};

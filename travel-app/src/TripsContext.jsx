import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

export const TripsContext = createContext();

export const TripsProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchTrips = useCallback(async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/trips', {
        headers: { 'x-auth-token': token },
      });
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
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5001/api/trips', tripData, {
        headers: { 'x-auth-token': token },
      });
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

  return (
    <TripsContext.Provider value={{ trips, setTrips, fetchTrips, addTrip }}>
      {children}
    </TripsContext.Provider>
  );
};

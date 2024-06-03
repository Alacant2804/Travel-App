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
      console.log("Trip data: ", tripData)
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
    console.log('Deleting trip with ID:', tripId);
    try {
      const token = localStorage.getItem('token');
      const url = `http://localhost:5001/api/trips/${tripId}`;
      console.log('DELETE request URL:', url); // Log the URL

      const response = await axios.delete(url, {
        headers: { 'x-auth-token': token },
      });
      
      if (response.status === 200) {
        const updatedTrips = trips.filter(trip => { trip._id !== tripId});
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

import { useState, useCallback, useMemo, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TripFormModal from './TripFormModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Trips.css';
import { TripsContext } from './TripsContext';

export default function Trips() {
  const { trips, setTrips, fetchTrips } = useContext(TripsContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);

  // Fetch trips when the component mounts
  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleCreateTrip = useCallback(async (newTripData) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        },
      };

      if (newTripData.id) {
        // Editing existing trip
        const response = await axios.put(`http://localhost:5001/api/trips/${newTripData.id}`, newTripData, config);
        const updatedTrips = trips.map(trip => trip._id === newTripData.id ? response.data : trip);
        setTrips(updatedTrips);
        localStorage.setItem('trips', JSON.stringify(updatedTrips));
      } else {
        // Creating new trip
        const response = await axios.post('http://localhost:5001/api/trips', newTripData, config);
        const newTrip = response.data; // This should include the ID from the backend
        const updatedTrips = [...trips, newTrip];
        setTrips(updatedTrips);
        localStorage.setItem('trips', JSON.stringify(updatedTrips));
      }
    } catch (error) {
      toast.error('Error saving trip. Please try again.', {
        theme: "colored"
      });
      console.error('Error saving trip:', error);
    }
  }, [trips, setTrips, fetchTrips]);

  const handleDeleteTrip = useCallback(async (tripId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.delete(`http://localhost:5001/api/trips/${tripId}`, config);

      if (response.status === 200) {
        toast.success('Trip deleted successfully!');

        const updatedTrips = trips.filter(trip => trip._id !== tripId);
        setTrips(updatedTrips);
        localStorage.setItem('trips', JSON.stringify(updatedTrips));
        
        // Optionally, you can refetch trips to ensure state is up-to-date
        fetchTrips();
        
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
  }, [trips, setTrips, fetchTrips]);

  const renderedTrips = useMemo(() => (
    trips.map((trip) => {
      if (!trip.destinations || trip.destinations.length === 0) {
        return null;
      }
      return (
        <li key={trip._id} className="trip-card">
          <h3>{trip.tripName}</h3>
          <p><strong>Country:</strong> {trip.country}</p>
          <p><strong>Destination:</strong> {trip.destinations[0].name}</p>
          <p><strong>Start Date:</strong> {trip.destinations[0].startDate}</p>
          <p><strong>End Date:</strong> {trip.destinations[0].endDate}</p>
          <p><strong>Trip Duration:</strong> {trip.destinations[0].duration} days</p>
          <div className="trip-actions">
            <Link to={`/trips/${trip._id}`} className="trip-btn">View</Link>
            <button className="trip-btn edit" onClick={() => { setIsModalOpen(true); setEditingTrip(trip); }}>Edit</button>
            <button className="trip-btn delete" onClick={() => handleDeleteTrip(trip._id)}>Delete</button>
          </div>
        </li>
      );
    })
  ), [trips, handleDeleteTrip]);

  return (
    <div className="trips-page">
      <main className="trips-main">
        <h1>Your Trips</h1>
        <button className="create-trip-btn" onClick={() => { setIsModalOpen(true); setEditingTrip(null); }}>
          Create Trip
        </button>

        {trips.length === 0 ? (
          <p className="no-trips-message">There are no trips yet.</p>
        ) : (
          <ul className="trips-list">
            {renderedTrips}
          </ul>
        )}

        {isModalOpen && (
          <TripFormModal
            onRequestClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateTrip}
            trip={editingTrip}
          />
        )}
      </main>
    </div>
  );
}
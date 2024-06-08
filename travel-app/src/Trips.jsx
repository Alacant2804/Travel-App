import { useState, useCallback, useMemo, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TripFormModal from './TripFormModal';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Trips.css';
import { TripsContext } from './TripsContext';

export default function Trips() {
  const { trips, setTrips, fetchTrips, addTrip, deleteTrip } = useContext(TripsContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);

  const handleCreateTrip = useCallback(async (newTripData) => {
    try {
      if (editingTrip) {
        // Editing existing trip
        const response = await axios.put(`http://localhost:5001/api/trips/${editingTrip._id}`, newTripData, {withCredentials: true});
        const updatedTrips = trips.map(trip => trip._id === editingTrip._id ? response.data : trip);
        setTrips(updatedTrips);
        localStorage.setItem('trips', JSON.stringify(updatedTrips));
      } else {
        // Creating new trip
        await addTrip(newTripData);
        fetchTrips(); // Fetch trips after adding a new trip
      }
    } catch (error) {
      toast.error('Error saving trip. Please try again.', {
        theme: "colored"
      });
      console.error('Error saving trip:', error);
    }
  }, [trips, setTrips, addTrip, fetchTrips, editingTrip]);

  const handleDeleteTrip = useCallback(async (tripId) => {
    try {
      console.log('Attempting to delete trip with ID:', tripId);
      await deleteTrip(tripId);
      fetchTrips(); // Fetch trips after deleting a trip
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  }, [deleteTrip, fetchTrips]);

  const renderedTrips = useMemo(() => (
    trips.map((trip) => (
      <li key={trip._id} className="trip-card">
        <Link to={`/trips/${trip._id}`} className="trip-link">
        <h3>{trip.tripName}</h3>
        <p><strong>Country: </strong> {trip.country}</p>
        <p><strong>City: </strong> {trip.destinations[0].city}</p>
        <p><strong>Start Date: </strong> {trip.destinations[0].startDate.split('T')[0]}</p>
        <p><strong>End Date: </strong> {trip.destinations[0].endDate.split('T')[0]}</p>
        <p><strong>Duration: </strong> {trip.destinations[0]?.duration} days</p>
        </Link>
        <div className="trip-actions">
          <button className="trip-btn edit" onClick={() => { setIsModalOpen(true); setEditingTrip(trip); }}>Edit</button>
          <button className="trip-btn delete" onClick={() => handleDeleteTrip(trip._id)}>Delete</button>
        </div>
      </li>
    ))
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
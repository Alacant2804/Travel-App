import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import TripFormModal from './TripFormModal';
import './Trips.css';

export default function Trips({ trips, setTrips }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInMilliseconds = end - start;
    return Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24)); // convert to days
  };

  const handleCreateTrip = useCallback((newTripData) => {
    if (newTripData.id) {
      // Editing existing trip
      const updatedTrips = trips.map(trip => trip.id === newTripData.id ? {
        ...trip,
        tripName: newTripData.tripName,
        country: newTripData.country,
        destinations: [
          {
            name: newTripData.city,
            startDate: newTripData.startDate,
            endDate: newTripData.endDate,
            duration: calculateDuration(newTripData.startDate, newTripData.endDate),
            places: trip.destinations[0]?.places || []
          }
        ]
      } : trip);
      setTrips(updatedTrips);
      localStorage.setItem('trips', JSON.stringify(updatedTrips));
    } else {
      // Creating new trip
      const newTrip = {
        id: trips.length + 1,
        tripName: newTripData.tripName,
        country: newTripData.country,
        destinations: [
          {
            name: newTripData.city,
            startDate: newTripData.startDate,
            endDate: newTripData.endDate,
            duration: calculateDuration(newTripData.startDate, newTripData.endDate),
            places: []
          }
        ]
      };
      const updatedTrips = [...trips, newTrip];
      setTrips(updatedTrips);
      localStorage.setItem('trips', JSON.stringify(updatedTrips));
    }
  }, [trips, setTrips]);

  const handleDeleteTrip = useCallback((tripId) => {
    console.log('Deleting trip with ID:', tripId);
    const updatedTrips = trips.filter(trip => trip.id !== tripId);
    console.log('Updated trips after deletion:', updatedTrips);
    setTrips(updatedTrips);
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
  }, [trips, setTrips]);

  const renderedTrips = useMemo(() => (
    trips.map((trip) => {
      console.log('Rendering trip with ID:', trip.id);
      if (!trip.destinations || trip.destinations.length === 0) {
        return null;
      }
      return (
        <li key={trip.id} className="trip-card">
          <h3>{trip.tripName}</h3>
          <p><strong>Country:</strong> {trip.country}</p>
          <p><strong>Destination:</strong> {trip.destinations[0].name}</p>
          <p><strong>Start Date:</strong> {trip.destinations[0].startDate}</p>
          <p><strong>End Date:</strong> {trip.destinations[0].endDate}</p>
          <p><strong>Trip Duration:</strong> {trip.destinations[0].duration} days</p>
          <div className="trip-actions">
            <Link to={`/trips/${trip.id}`} className="trip-btn">View</Link>
            <button className="trip-btn edit" onClick={() => { setIsModalOpen(true); setEditingTrip(trip); }}>Edit</button>
            <button className="trip-btn delete" onClick={() => handleDeleteTrip(trip.id)}>Delete</button>
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
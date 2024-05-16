import { useState } from 'react';
import { Link } from 'react-router-dom';
import TripFormModal from './TripFormModal';
import './Trips.css';

export default function Trips({ trips, setTrips }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTrip = (newTripData) => {
    const newTrip = {
      ...newTripData,
      destinations: [
        {
          name: newTripData.destination || "New Destination",
          startDate: newTripData.startDate || "2024-01-01",
          endDate: newTripData.endDate || "2024-01-10",
          duration: calculateDuration(newTripData.startDate, newTripData.endDate),
          places: []
        }
      ]
    };
    setTrips([...trips, newTrip]);
    localStorage.setItem('trips', JSON.stringify([...trips, newTrip]));
  };  

  const handleDeleteTrip = (tripId) => {
      const updatedTrips = trips.filter(trip => trip.id !== tripId);
      setTrips(updatedTrips);
      localStorage.setItem('trips', JSON.stringify(updatedTrips));
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInMilliseconds = end - start;
    return Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24)); // convert milliseconds to days
  };

  return (
    <div className="trips-page">
      <main className="trips-main">
        <h1>Your Trips</h1>
        <button className="create-trip-btn" onClick={() => setIsModalOpen(true)}>
          Create Trip
        </button>

        {trips.length === 0 ? (
          <p className="no-trips-message">There are no trips yet.</p>
        ) : (
          <ul className="trips-list">
            {trips.map((trip) => {
              const duration = calculateDuration(trip.startDate, trip.endDate);
              return (
                <li key={trip.id} className="trip-card">
                  <h3>{trip.tripName}</h3>
                  <p><strong>Destination:</strong> {trip.destination}</p>
                  <p><strong>Start Date:</strong> {trip.startDate}</p>
                  <p><strong>End Date:</strong> {trip.endDate}</p>
                  <p><strong>Trip Duration:</strong> {duration} days</p>
                  <div className="trip-actions">
                    <Link to={`/trips/${trip.id}`} className="trip-btn">View</Link>
                    <button className="trip-btn delete" onClick={() => handleDeleteTrip(trip.id)}>Delete</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {isModalOpen && (
          <TripFormModal
            onRequestClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateTrip}
          />
        )}
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TripFormModal from './TripFormModal';
import './Trips.css';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load trips from localStorage on initial render
  useEffect(() => {
    const storedTrips = localStorage.getItem('trips');
    if (storedTrips) {
      const parsedTrips = JSON.parse(storedTrips);
      console.log('Loaded trips from localStorage:', parsedTrips);  // Debug: See what's being loaded
      setTrips(parsedTrips);
    }
  }, []);

  const handleCreateTrip = (newTrip) => {
    const tripWithId = { ...newTrip, id: trips.length + 1 };
    const newTripsList = [...trips, tripWithId];
    console.log('New trip added:', newTripsList);
    setTrips(newTripsList);
    localStorage.setItem('trips', JSON.stringify(newTripsList));
    setIsModalOpen(false);
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
            {trips.map((trip) => (
              <li key={trip.id}>
                <Link to={`/trips/${trip.id}`}>{trip.tripName}</Link>
              </li>
            ))}
          </ul>
        )}

        {isModalOpen && (
          <TripFormModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateTrip}
          />
        )}
      </main>
    </div>
  );
}

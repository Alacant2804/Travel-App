import { useState } from 'react';
import { Link } from 'react-router-dom';
import TripFormModal from './TripFormModal';
import './Trips.css';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTrip = (newTrip) => {
    const newId = trips.length + 1;
    setTrips([...trips, { id: newId, ...newTrip }]);
  };

  return (
    <div className="trips-page">
      <main className="trips-main">
        <h1>Your Trips</h1>
        <button onClick={() => setIsModalOpen(true)} className="create-trip-btn">
          Create Trip
        </button>

        {trips.length === 0 ? (
          <p className="no-trips-message">There are no trips yet.</p>
        ) : (
          <ul className="trips-list">
            {trips.map((trip) => (
              <li key={trip.id}>
                <Link to={`/trips/${trip.id}`}>{trip.tripName} - {trip.destination}</Link>
              </li>
            ))}
          </ul>
        )}

        <TripFormModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateTrip}
        />
      </main>
    </div>
  );
}
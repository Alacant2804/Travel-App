import React, { useState } from 'react';
import './Trips.css';

const initialTrips = [
  { id: 1, destination: 'Paris, France', date: '2024-06-15', description: 'A romantic getaway to the city of lights.' },
  { id: 2, destination: 'Kyoto, Japan', date: '2024-09-25', description: 'Exploring temples and experiencing Japanese culture.' },
  { id: 3, destination: 'New York City, USA', date: '2024-11-10', description: 'Visiting iconic landmarks and enjoying Broadway shows.' }
];

export default function Trips() {
  const [trips, setTrips] = useState(initialTrips);
  const [newTrip, setNewTrip] = useState({
    destination: '',
    date: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTrip({ ...newTrip, [name]: value });
  };

  const handleAddTrip = (e) => {
    e.preventDefault();
    if (newTrip.destination && newTrip.date) {
      const newTripData = {
        id: trips.length + 1,
        ...newTrip
      };
      setTrips([...trips, newTripData]);
      setNewTrip({
        destination: '',
        date: '',
        description: ''
      });
    }
  };

  return (
    <div className="trips-page">
      <h1>Trips</h1>
      <p>Welcome to the Trips Page. Here you can manage all your travel plans!</p>

      {/* Add New Trip Form */}
      <div className="new-trip-form">
        <h2>Add a New Trip</h2>
        <form onSubmit={handleAddTrip}>
          <label>
            Destination:
            <input
              type="text"
              name="destination"
              value={newTrip.destination}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={newTrip.date}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={newTrip.description}
              onChange={handleInputChange}
            ></textarea>
          </label>
          <button type="submit">Add Trip</button>
        </form>
      </div>

      {/* Display List of Trips */}
      <div className="trip-list">
        <h2>Your Trips</h2>
        {trips.length > 0 ? (
          trips.map((trip) => (
            <div className="trip-card" key={trip.id}>
              <h3>{trip.destination}</h3>
              <p><strong>Date:</strong> {trip.date}</p>
              <p>{trip.description}</p>
            </div>
          ))
        ) : (
          <p>No trips available. Add some trips to start planning your adventures!</p>
        )}
      </div>
    </div>
  );
}

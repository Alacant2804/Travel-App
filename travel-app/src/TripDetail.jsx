import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './TripDetail.css';

export default function TripDetail({ trips }) {
  const { tripId } = useParams();
  const trip = trips.find((t) => t.id === parseInt(tripId, 10));

  const [places, setPlaces] = useState([]);
  const [placeInput, setPlaceInput] = useState('');

  if (!trip) {
    return <p>Trip not found!</p>;
  }

  const addPlace = () => {
    if (placeInput.trim()) {
      setPlaces([...places, placeInput]);
      setPlaceInput('');
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    addPlace();
  };

  return (
    <div className="trip-detail-container">
      <h1 className="trip-title">{trip.tripName}</h1>
      <div className="trip-info">
          <h2>{trip.destination}</h2>
          <p><strong>Start Date:</strong> {trip.startDate}</p>
          <p><strong>End Date:</strong> {trip.endDate}</p>
          <p><strong>Duration:</strong> {trip.duration} days</p>
      </div>
      <form onSubmit={handleFormSubmit} className="place-add-form">
        <input
          type="text"
          value={placeInput}
          onChange={(e) => setPlaceInput(e.target.value)}
          placeholder="Add a place to visit"
          className="place-input"
        />
        <button type="submit" className="add-place-button">Add Place</button>
      </form>
      <ul className="places-to-visit">
        {places.map((place, index) => (
          <li key={index}>{place}</li>
        ))}
      </ul>
    </div>
  );
}

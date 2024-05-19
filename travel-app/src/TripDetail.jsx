import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Destination from './Destination';
import './TripDetail.css';

export default function TripDetail({ trips }) {
  const { tripId } = useParams();
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const trip = trips.find(t => t.id === parseInt(tripId, 10));
    if (trip && trip.destinations) {
      setDestinations(trip.destinations);
    } else {
      console.error("Trip not found or no destinations available!");
    }
  }, [tripId, trips]);

  const handleAddDestination = () => {
    const newDestination = {
      name: "New Destination",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      duration: "Calculate duration",
      places: []
    };
    setDestinations(prev => [...prev, newDestination]);
  };

  const trip = trips.find(t => t.id === parseInt(tripId, 10));
  if (!trip) {
    return <p>Trip not found!</p>;
  }

  return (
    <div className="trip-detail-page">
      <h1 className="trip-title">{trip.tripName}</h1>
      <div className="trip-info-row">
        <p><strong>Destination:</strong> {trip.destinations[0].name}</p>
        <p><strong>Start Date:</strong> {trip.destinations[0].startDate}</p>
        <p><strong>End Date:</strong> {trip.destinations[0].endDate}</p>
        <p><strong>Duration:</strong> {trip.destinations[0].duration} days</p>
      </div>
      <div className="destinations">
        {destinations.length > 0 ? (
          destinations.map((destination, index) => (
            <Destination key={index} initialData={destination} onSave={(updatedData) => console.log(updatedData)} />
          ))
        ) : (
          <p>No destinations found for this trip.</p>
        )}
      </div>
      <button className="add-destination-button" onClick={handleAddDestination}>Add New Destination</button>
    </div>
  );
}
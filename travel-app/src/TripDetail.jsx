import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Destination from './Destination';
import './TripDetail.css';

export default function TripDetail({ trips }) {
  const { tripId } = useParams();
  const trip = trips.find(t => t.id === parseInt(tripId, 10));

  const [destinations, setDestinations] = useState(trip ? trip.destinations : []);

  const handleAddDestination = () => {
    const newDestination = {
      name: "",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      duration: "Calculate duration",
      places: []
    };
    setDestinations(prev => [...prev, newDestination]);
  };

  if (!trip) {
    return <p>Trip not found!</p>;
  }

  return (
    <>
      <h1 className="trip-title">{trip.tripName}</h1>
      {destinations.map((destination, index) => (
        <Destination key={index} initialData={destination} onSave={(updatedData) => console.log(updatedData)} />
      ))}
      <button onClick={handleAddDestination}>Add New Destination</button>
    </>
  );
}

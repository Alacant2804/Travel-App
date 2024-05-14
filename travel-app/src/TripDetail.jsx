import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Destination from './Destination.jsx';
import './TripDetail.css';

export default function TripDetail({ trips }) {
  const { tripId } = useParams();
  const trip = trips.find(t => t.id === parseInt(tripId, 10));

  const [destinations, setDestinations] = useState(trip.destinations || []);

  const handleAddDestination = () => {
    const newDestination = {
      name: "",
      startDate: new Date().toISOString().slice(0, 10),  // Current date in YYYY-MM-DD format
      endDate: new Date().toISOString().slice(0, 10),
      places: []
    };
    setDestinations([...destinations, newDestination]);
  };
  

  if (!trip) {
    return <p>Trip not found!</p>;
  }

  return (
    <>
      <h1 className="trip-title">{trip.tripName}</h1>
      {destinations.map((destination, index) => (
        <Destination key={index} destination={destination} onSave={(place) => console.log(place)} />
      ))}
      <button onClick={handleAddDestination}>Add New Destination</button>
    </>
  );
}

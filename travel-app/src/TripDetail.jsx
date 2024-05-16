import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Destination from './Destination';
import './TripDetail.css';

export default function TripDetail({ trips }) {
  const { tripId } = useParams();
  const [destinations, setDestinations] = useState([]);
  console.log("Received tripId:", tripId);

  useEffect(() => {
    const trip = trips.find(t => t.id === parseInt(tripId, 10));
    console.log(trip)
    if (trip && trip.destinations) {
      setDestinations(trip.destinations);
    } else {
      console.error("Trip not found or no destinations available!");
    }
  }, [tripId, trips]);
  

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

  return (
    <>
      <h1 className="trip-title">{trips.find(t => t.id === parseInt(tripId, 10))?.tripName || "Trip not found"}</h1>
      {destinations.length > 0 ? (
        destinations.map((destination, index) => (
          <Destination key={index} initialData={destination} onSave={(updatedData) => console.log(updatedData)} />
        ))
      ) : (
        <p>No destinations found for this trip.</p>
      )}
      <button onClick={handleAddDestination}>Add New Destination</button>
    </>
  );
}
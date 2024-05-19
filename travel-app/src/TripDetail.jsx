import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Destination from './Destination';
import MapComponent from './MapComponent';
import './TripDetail.css';

export default function TripDetail({ trips }) {
  const { tripId } = useParams();
  const [destinations, setDestinations] = useState([]);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const trip = trips.find(t => t.id === parseInt(tripId, 10));
    if (trip && trip.destinations) {
      setDestinations(trip.destinations);
      const allPlaces = trip.destinations.flatMap(destination => destination.places.map(place => ({
        ...place,
        coordinates: getCoordinates(place.name, destination.name, trip.country) // Add logic to get coordinates
      })));
      setPlaces(allPlaces);
    } else {
      console.error("Trip not found or no destinations available!");
    }
  }, [tripId, trips]);

  const getCoordinates = (place, city, country) => {
    // Implement logic to get coordinates based on place, city, and country.
    // For now, returning dummy coordinates for the example.
    return [51.505, -0.09];
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInMilliseconds = end - start;
    return Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24)); // convert milliseconds to days
  };

  const handleAddDestination = () => {
    const startDate = new Date().toISOString().slice(0, 10);
    const endDate = new Date().toISOString().slice(0, 10);
    const newDestination = {
      name: "New Destination",
      startDate: startDate,
      endDate: endDate,
      duration: calculateDuration(startDate, endDate),
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
        <p><strong>Country:</strong> {trip.country}</p>
        <p><strong>Start Date:</strong> {trip.destinations[0].startDate}</p>
        <p><strong>End Date:</strong> {trip.destinations[0].endDate}</p>
        <p><strong>Duration:</strong> {trip.destinations[0].duration} days</p>
      </div>
      <div className="destinations">
        {destinations.length > 0 ? (
          destinations.map((destination, index) => (
            <Destination 
              key={index} 
              initialData={destination} 
              calculateDuration={calculateDuration}
              onSave={(updatedData) => {
                const updatedDestinations = destinations.map((dest, idx) => 
                  idx === index ? { ...updatedData, duration: calculateDuration(updatedData.startDate, updatedData.endDate) } : dest
                );
                setDestinations(updatedDestinations);
              }} 
            />
          ))
        ) : (
          <p>No destinations found for this trip.</p>
        )}
      </div>
      <button className="add-destination-button" onClick={handleAddDestination}>Add New Destination</button>
      <MapComponent places={places} />
    </div>
  );
}

import React, { useState } from 'react';

function Destination({ initialData = {}, onSave }) {
  const [destination, setDestination] = useState(initialData.name || 'New Destination');
  const [startDate, setStartDate] = useState(initialData.startDate || '');
  const [endDate, setEndDate] = useState(initialData.endDate || '');
  const [places, setPlaces] = useState(initialData.places || []);

  const handleAddPlace = (event) => {
    event.preventDefault();
    const placeInput = event.target.elements.placeInput.value.trim();
    if (placeInput) {
      const newPlaces = [...places, placeInput];
      setPlaces(newPlaces);
      onSave({...initialData, name: destination, startDate, endDate, places: newPlaces});
    }
    event.target.reset();
  };

  return (
    <div className="trip-detail-container">
      <div className="trip-info">
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          onBlur={() => onSave({...initialData, name: destination, startDate, endDate, places})}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <p><strong>Duration:</strong> {/* Compute duration based on dates or display if given */}
          {initialData.duration || "Calculate duration"} days
        </p>
      </div>
      <form onSubmit={handleAddPlace} className="place-add-form">
        <input
          name="placeInput"
          type="text"
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

export default Destination;

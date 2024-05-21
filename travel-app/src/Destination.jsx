import { useState, useEffect } from 'react';
import './Destination.css';

export default function Destination({ initialData = {}, onSave, calculateDuration }) {
  const [destination, setDestination] = useState(initialData.name || 'New Destination');
  const [startDate, setStartDate] = useState(initialData.startDate || '');
  const [endDate, setEndDate] = useState(initialData.endDate || '');
  const [places, setPlaces] = useState(initialData.places || []);
  const [duration, setDuration] = useState(calculateDuration(startDate, endDate));
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editPlaceValue, setEditPlaceValue] = useState('');

  useEffect(() => {
    setDuration(calculateDuration(startDate, endDate));
  }, [startDate, endDate, calculateDuration]);

  const handleAddPlace = (event) => {
    event.preventDefault();
    const placeInput = event.target.elements.placeInput.value.trim();
    const priceInput = parseFloat(event.target.elements.priceInput.value.trim());
    const price = isNaN(priceInput) ? 0 : priceInput;

    if (placeInput) {
      const newPlaces = [...places, { name: placeInput, price }];
      setPlaces(newPlaces);
      onSave({ name: destination, startDate, endDate, places: newPlaces, duration });
    }
    event.target.reset();
  };

  const handleEditPlace = (index) => {
    setEditingIndex(index);
    setEditPlaceValue(places[index]);
  };

  const handleSaveEditPlace = () => {
    const updatedPlaces = places.map((place, idx) =>
      idx === editingIndex ? editPlaceValue : place
    );
    setPlaces(updatedPlaces);
    onSave({ name: destination, startDate, endDate, places: updatedPlaces, duration });
    setEditingIndex(-1);
    setEditPlaceValue('');
  };

  const handleDeletePlace = (index) => {
    const updatedPlaces = places.filter((_, idx) => idx !== index);
    setPlaces(updatedPlaces);
    onSave({ name: destination, startDate, endDate, places: updatedPlaces, duration });
  };

  return (
    <div className="trip-detail-container">
      <div className="trip-info">
        <input
          type="text"
          className="destination-input"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          onBlur={() => onSave({ name: destination, startDate, endDate, places, duration })}
        />
        <div className="breaker"></div>
        <div className="date-info">
          <p>
            <strong>Start Date:</strong>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onBlur={() => onSave({ name: destination, startDate, endDate, places, duration })}
            />
          </p>
          <p>
            <strong>End Date:</strong>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onBlur={() => onSave({ name: destination, startDate, endDate, places, duration })}
            />
          </p>
          <p>
            <strong>Duration:</strong> {duration} days
          </p>
        </div>
      </div>
      <ul className="places-to-visit">
        {places.map((place, index) => (
          <li key={index}>
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editPlaceValue.name}
                  onChange={(e) => setEditPlaceValue({ ...editPlaceValue, name: e.target.value })}
                />
                <input
                  type="number"
                  value={editPlaceValue.price}
                  onChange={(e) => setEditPlaceValue({ ...editPlaceValue, price: parseFloat(e.target.value) })}
                  step="0.01"
                  min="0"
                />
                <button onClick={handleSaveEditPlace}>Save</button>
                <button onClick={() => setEditingIndex(-1)}>Cancel</button>
              </>
            ) : (
              <>
                {place.name} - ${place.price.toFixed(2)}
                <button onClick={() => handleEditPlace(index)}>Edit</button>
                <button onClick={() => handleDeletePlace(index)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddPlace} className="place-add-form">
        <div className='form-input'>
        <input
          name="placeInput"
          type="text"
          placeholder="Add a place to visit"
          className="place-input"
        />
        <input
          name="priceInput"
          type="number"
          placeholder="Price"
          step="0.01"
          min="0"
          className="place-input"
        />
        </div>
        <button type="submit" className="add-place-button">Add Place</button>
      </form>
    </div>
  );
}

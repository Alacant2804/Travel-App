import { useState, useEffect } from 'react';
import './Destination.css';
import AccommodationModal from './AccommodationModal';
import axios from 'axios';
import accommodationIcon from './assets/accommodation-icon.png';
import deleteIcon from './assets/delete-icon.png';
import editIcon from './assets/edit-icon.png';


const fetchCoordinates = async (place, destination) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: `${place}, ${destination}`,
        format: 'json',
        limit: 1
      }
    });
    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    } else {
      console.error("No coordinates found for the provided place.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};

export default function Destination({ initialData = {}, onSave, calculateDuration }) {
  const [destination, setDestination] = useState(initialData.name || 'New Destination');
  const [startDate, setStartDate] = useState(initialData.startDate || '');
  const [endDate, setEndDate] = useState(initialData.endDate || '');
  const [places, setPlaces] = useState(initialData.places || []);
  const [duration, setDuration] = useState(calculateDuration(startDate, endDate));
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editPlaceValue, setEditPlaceValue] = useState({ name: '', price: 0 });
  const [showAccommodationModal, setShowAccommodationModal] = useState(false);
  const [accommodation, setAccommodation] = useState(initialData.accommodation || null);

  useEffect(() => {
    setDuration(calculateDuration(startDate, endDate));
  }, [startDate, endDate, calculateDuration]);

  const handleAddPlace = async (event) => {
    event.preventDefault();
    const placeInput = event.target.elements.placeInput.value.trim();
    const priceInput = event.target.elements.priceInput.value.trim();
    if (placeInput) {
      const coordinates = await fetchCoordinates(placeInput, destination);
      const newPlace = { name: placeInput, price: parseFloat(priceInput) || 0, coordinates };
      const newPlaces = [...places, newPlace];
      setPlaces(newPlaces);
      onSave({ name: destination, startDate, endDate, places: newPlaces, duration, accommodation });
    }
    event.target.reset();
  };

  const handleSaveEditPlace = async () => {
    const coordinates = await fetchCoordinates(editPlaceValue.name, destination);
    const updatedPlaces = places.map((place, idx) =>
      idx === editingIndex ? { ...editPlaceValue, coordinates } : place
    );
    setPlaces(updatedPlaces);
    onSave({ name: destination, startDate, endDate, places: updatedPlaces, duration, accommodation });
    setEditingIndex(-1);
    setEditPlaceValue({ name: '', price: 0, coordinates: null });
  };

  const handleEditPlace = (index) => {
    setEditingIndex(index);
    setEditPlaceValue(places[index]);
  };

  const handleDeletePlace = (index) => {
    const updatedPlaces = places.filter((_, idx) => idx !== index);
    setPlaces(updatedPlaces);
    onSave({ name: destination, startDate, endDate, places: updatedPlaces, duration, accommodation });
  };

  const totalPlaces = places.length;
  const totalPrice = places.reduce((sum, place) => sum + place.price, 0);

  const handleSaveAccommodation = (accommodationData) => {
    setAccommodation(accommodationData);
    setShowAccommodationModal(false);
    onSave({ name: destination, startDate, endDate, places, duration, accommodation: accommodationData });
  };

  return (
    <div className="trip-detail-container">
      <div className="trip-info">
        <input
          type="text"
          className="destination-input"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          onBlur={() => onSave({ name: destination, startDate, endDate, places, duration, accommodation })}
        />
        <div className="breaker"></div>
        <div className="date-info">
          <p>
            <strong>Start Date:</strong>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onBlur={() => onSave({ name: destination, startDate, endDate, places, duration, accommodation })}
            />
          </p>
          <p>
            <strong>End Date:</strong>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onBlur={() => onSave({ name: destination, startDate, endDate, places, duration, accommodation })}
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
              <div className="edit-mode">
                <input
                  type="text"
                  value={editPlaceValue.name}
                  onChange={(e) => setEditPlaceValue({ ...editPlaceValue, name: e.target.value })}
                  className="place-input"
                />
                <input
                  type="number"
                  value={editPlaceValue.price}
                  onChange={(e) => setEditPlaceValue({ ...editPlaceValue, price: parseFloat(e.target.value) })}
                  step="0.01"
                  min="0"
                  className="place-input"
                />
                <button onClick={handleSaveEditPlace} className="add-place-button">Save</button>
                <button onClick={() => setEditingIndex(-1)} className="add-place-button">Cancel</button>
              </div>
            ) : (
              <div className="places-list">
                {place.name} - ${place.price.toFixed(2)}
                <div className="action-buttons">
                  <button className="button-icon" onClick={() => handleEditPlace(index)}>
                    <img src={editIcon} alt="edit" className="edit-icon" />
                  </button>
                  <button className="button-icon" onClick={() => handleDeletePlace(index)}>
                    <img src={deleteIcon} alt="delete" className="delete-icon" />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddPlace} className="place-add-form">
        <div className="place-input-fields">
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
      <div className='destination-details'>
        <div className="totals">
          <p className='total-places'><strong>Total Places to Visit:</strong> {totalPlaces}</p>
          <p className='total-price'><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
        </div>
        <button className="accommodation-button" data-title="Add Accommodation" onClick={() => setShowAccommodationModal(true)}>
          <img src={accommodationIcon} alt='accommodation' className='accommodation-icon'/>
        </button>
        {showAccommodationModal && (
          <AccommodationModal
            accommodation={accommodation}
            onSave={handleSaveAccommodation}
            onClose={() => setShowAccommodationModal(false)}
          />
        )}
      </div>
    </div>
  );
}
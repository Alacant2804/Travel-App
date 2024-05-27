import { useState, useEffect } from 'react';
import './Destination.css';
import AccommodationModal from './AccommodationModal';
import accommodationIcon from './assets/accommodation-icon.png';
import deleteIcon from './assets/delete-icon.png';
import editIcon from './assets/edit-icon.png';

export default function Destination({ initialData = {}, onSave, calculateDuration, onAddPlace, onEditPlace, onDeletePlace }) {
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

  useEffect(() => {
    console.log('Current places after update: ', places);
  }, [places]);

  const handleAddPlace = (event) => {
    event.preventDefault();
    const placeInput = event.target.elements.placeInput.value.trim();
    const priceInput = event.target.elements.priceInput.value.trim();
    if (placeInput) {
      onAddPlace(placeInput, priceInput);
      setPlaces(prev => [...prev, { name: placeInput, price: parseFloat(priceInput) || 0 }]);
    }
    event.target.reset();
  };

  const handleSaveEditPlace = () => {
    onEditPlace(editingIndex, editPlaceValue.name, editPlaceValue.price);
    setPlaces(places.map((place, idx) =>
      idx === editingIndex ? { ...editPlaceValue } : place
    ));
    setEditingIndex(-1);
    setEditPlaceValue({ name: '', price: 0 });
  };

  const handleEditPlace = (index) => {
    setEditingIndex(index);
    setEditPlaceValue(places[index]);
  };

  const handleDeletePlace = (index) => {
    onDeletePlace(index);
    setPlaces(places.filter((_, idx) => idx !== index));
  };  

  const handleSaveAccommodation = (accommodationData) => {
    setAccommodation(accommodationData);
    setShowAccommodationModal(false);
    onSave({ name: destination, startDate, endDate, places, duration, accommodation: accommodationData });
  };

  const totalPlaces = places.length;
  const totalPrice = places.reduce((sum, place) => sum + place.price, 0);

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
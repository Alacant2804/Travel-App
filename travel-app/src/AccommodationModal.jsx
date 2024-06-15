import { useState, useEffect } from 'react';
import './AccommodationModal.css';
import axios from 'axios';

export default function AccommodationModal({ accommodation, onSave, onClose }) {
  const [address, setAddress] = useState(accommodation?.address || '');
  const [startDate, setStartDate] = useState(accommodation?.startDate || '');
  const [endDate, setEndDate] = useState(accommodation?.endDate || '');
  const [bookingLink, setBookingLink] = useState(accommodation?.bookingLink || '');
  const [isEditing, setIsEditing] = useState(!accommodation);
  const [price, setPrice] = useState(accommodation?.price || 0);

  useEffect(() => {
    if (accommodation) {
      setAddress(accommodation.address);
      setStartDate(accommodation.startDate);
      setEndDate(accommodation.endDate);
      setBookingLink(accommodation.bookingLink);
      setPrice(accommodation.price || 0);
    }
  }, [accommodation]);

  const fetchCoordinates = async (address) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: address,
          format: 'json',
          limit: 1
        }
      });
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      } else {
        console.error("No coordinates found for the provided address.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  const handleSave = async () => {
    const coordinates = await fetchCoordinates(address);
    onSave({ address, startDate, endDate, bookingLink, price, coordinates });
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Accommodation Details</h2>
        {accommodation && !isEditing ? (
          <div className="accommodation-info">
            <p><strong>Address:</strong> {address}</p>
            <p><strong>From:</strong> {startDate}</p>
            <p><strong>To:</strong> {endDate}</p>
            <p><strong>Price:</strong> ${price.toFixed(2)}</p>
            {bookingLink && (
              <p><strong>Booking Link:</strong> <a href={bookingLink} target="_blank" rel="noopener noreferrer">{bookingLink}</a></p>
            )}
            <div className="modal-actions">
              <button className="modal-btn close-btn" onClick={onClose}>Close</button>
              <button className="modal-btn edit-btn" onClick={handleEdit}>Edit</button>
            </div>
          </div>
        ) : (
          <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <input
              type="text"
              placeholder="Address (without country name)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-input"
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-input"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-input"
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className="form-input"
              step="0.01"
              min="0"
            />
            <input
              type="url"
              placeholder="Booking Link"
              value={bookingLink}
              onChange={(e) => setBookingLink(e.target.value)}
              className="form-input"
            />
            <div className="modal-actions">
              <button type="button" className="modal-btn cancel-btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="modal-btn submit-btn">Save</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

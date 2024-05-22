import { useState } from 'react';
import './AccommodationModal.css';

export default function AccommodationModal({ accommodation, onSave, onClose }) {
  const [address, setAddress] = useState(accommodation?.address || '');
  const [startDate, setStartDate] = useState(accommodation?.startDate || '');
  const [endDate, setEndDate] = useState(accommodation?.endDate || '');
  const [bookingLink, setBookingLink] = useState(accommodation?.bookingLink || '');
  const [isEditing, setIsEditing] = useState(!accommodation);
  const [price, setPrice] = useState(accommodation?.price || '');

  const handleSave = () => {
    onSave({ address, startDate, endDate, price, bookingLink });
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
            {price && (<p><strong>Price:</strong> ${parseFloat(price).toFixed(2)}</p>)}
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
              placeholder="Address"
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
              onChange={(e) => setPrice(e.target.value)}
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
import { useState } from 'react';
import './TripFormModal.css';

export default function TripFormModal({ onRequestClose, onSubmit }) {
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = () => {
    if (tripName && destination && startDate && endDate) {
      onSubmit({ tripName, destination, startDate, endDate });
      setTripName('');
      setDestination('');
      setStartDate('');
      setEndDate('');
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onRequestClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create a New Trip</h2>
        <form className="modal-form">
          <input
            type="text"
            placeholder="Trip Name"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            className="form-input"
            required
          />
          <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="form-input"
            required
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-input"
            required
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-input"
            required
          />
          <div className="modal-actions">
            <button onClick={onRequestClose} className="modal-btn cancel-btn">Cancel</button>
            <button onClick={handleSubmit} className="modal-btn submit-btn">Create Trip</button>
          </div>
        </form>
      </div>
    </div>
  );
}

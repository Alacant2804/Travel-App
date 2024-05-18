import { useState } from 'react';
import './TripFormModal.css';

export default function TripFormModal({ onRequestClose, onSubmit }) {
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!tripName || !destination || !startDate || !endDate) {
      alert('Please fill out all fields.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      alert('The start date cannot be after the end date. Please select valid dates.');
      return;
    }

    onSubmit({ tripName, destination, startDate, endDate });

    setTripName('');
    setDestination('');
    setStartDate('');
    setEndDate('');
    onRequestClose();
  };

  return (
    <div className="modal-overlay" onClick={onRequestClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create a New Trip</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
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
            <button type="button" onClick={onRequestClose} className="modal-btn cancel-btn">Cancel</button>
            <button type="submit" className="modal-btn submit-btn">Create Trip</button>
          </div>
        </form>
      </div>
    </div>
  );
}

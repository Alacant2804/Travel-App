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
    // Wrapping the modal with an overlay for background click close functionality
    <div className="modal-overlay" onClick={onRequestClose}>
      {/* Prevent clicks inside the modal from closing it */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create a New Trip</h2>
        <input
          type="text"
          placeholder="Trip Name"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder='Start Date'
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder='End Date'
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <div className="modal-actions">
          <button onClick={handleSubmit} className="modal-btn">Create Trip</button>
          <button onClick={onRequestClose} className="modal-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
}

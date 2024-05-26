import { useState, useEffect } from 'react';
import './TripFormModal.css';

export default function TripFormModal({ onRequestClose, onSubmit, trip }) {
  const [tripName, setTripName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (trip) {
      const { tripName, country, destinations } = trip;
      const { name, startDate, endDate } = destinations[0] || {};
      setTripName(tripName);
      setCountry(country);
      setCity(name || '');
      setStartDate(startDate || '');
      setEndDate(endDate || '');
    }
  }, [trip]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!tripName || !country || !city || !startDate || !endDate) {
      alert('Please fill out all fields.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      alert('The start date cannot be after the end date. Please select valid dates.');
      return;
    }

    onSubmit({ id: trip?.id, tripName, country, city, startDate, endDate });

    setTripName('');
    setCountry('');
    setCity('');
    setStartDate('');
    setEndDate('');
    onRequestClose();
  };

  return (
    <div className="modal-overlay" onClick={onRequestClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{trip ? 'Edit Trip' : 'Create a New Trip'}</h2>
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
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="form-input"
            required
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
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
            <button type="submit" className="modal-btn submit-btn">{trip ? 'Save Changes' : 'Create Trip'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
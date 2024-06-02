import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
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
      const { city, startDate, endDate } = destinations[0] || {};
      setTripName(tripName);
      setCountry(country);
      setCity(city || '');
      setStartDate(startDate ? startDate.split('T')[0] : '');
      setEndDate(endDate ? endDate.split('T')[0] : '');
    }
  }, [trip]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!tripName || !country || !city || !startDate || !endDate) {
      toast.error('Please fill out all fields.', {
        theme: "colored"
      });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      toast.error('The start date cannot be after the end date. Please select valid dates.', {
        theme: "colored"
      });
      return;
    }

    const tripData = { tripName, country, destinations: [{ city, startDate, endDate }] };

    onSubmit(tripData);

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
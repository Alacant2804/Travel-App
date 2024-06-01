import { useState, useEffect, useContext } from 'react';
import { TripsContext } from './TripsContext';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import './TripFormModal.css';

export default function TripFormModal({ onRequestClose, onSubmit, trip }) {
  const [tripName, setTripName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { user } = useContext(AuthContext);
  const { fetchTrips } = useContext(TripsContext);

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

    const tripData = { tripName, country, destinations: [{ name: city, startDate, endDate }] };

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        },
      };
      if (trip) {
        // Update existing trip
        console.log('Sending update request:', tripData); // Log request
        await axios.put(`http://localhost:5001/api/trips/${trip._id}`, tripData, config);
        toast.success('Trip updated successfully!');
      } else {
        // Create new trip
        console.log('Sending create request:', tripData); // Log request
        await axios.post('http://localhost:5001/api/trips', tripData, config);
        toast.success('Trip created successfully!');
      }
      fetchTrips();
    } catch (error) {
      console.error('Error saving trip:', error.response ? error.response.data : error.message); // Log detailed error
      toast.error(`Error saving trip: ${error.response ? error.response.data.message : error.message}`);
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
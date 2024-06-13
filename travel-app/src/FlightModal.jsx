import { useState, useEffect } from 'react';
import axios from 'axios';
import './FlightModal.css';

export default function FlightModal({ tripId, flight, onSave, onClose }) {
  const [departureAirport, setDepartureAirport] = useState(flight?.departureAirport || '');
  const [arrivalAirport, setArrivalAirport] = useState(flight?.arrivalAirport || '');
  const [departureDate, setDepartureDate] = useState(flight?.departureDate || '');
  const [arrivalDate, setArrivalDate] = useState(flight?.arrivalDate || '');
  const [bookingLink, setBookingLink] = useState(flight?.bookingLink || '');
  const [price, setPrice] = useState(flight?.price || 0);
  const [isEditing, setIsEditing] = useState(!!flight);

  useEffect(() => {
    if (flight) {
      setDepartureAirport(flight.departureAirport || '');
      setArrivalAirport(flight.arrivalAirport || '');
      setDepartureDate(flight.departureDate || '');
      setArrivalDate(flight.arrivalDate || '');
      setBookingLink(flight.bookingLink || '');
      setPrice(flight.price || 0);
      setIsEditing(true);
    } else {
      // Reset to default values if there is no flight
      setDepartureAirport('');
      setArrivalAirport('');
      setDepartureDate('');
      setArrivalDate('');
      setBookingLink('');
      setPrice(0);
      setIsEditing(false);
    }
  }, [flight]);

  const handleSave = async () => {
    const flightData = {
      departureAirport,
      arrivalAirport,
      departureDate,
      arrivalDate,
      bookingLink,
      price,
      _id: flight?._id // Include the _id if it exists
    };

    console.log('Saving flight with data:', flightData); // Log flightData to verify

    try {
      const url = isEditing && flight?._id
        ? `http://localhost:5001/api/trips/${tripId}/flights/${flight._id}`
        : `http://localhost:5001/api/trips/${tripId}/flights`;
      const response = await axios[isEditing && flight?._id ? 'put' : 'post'](url, flightData, { withCredentials: true });
      onSave(response.data);
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error('Error saving flight:', error);
    }
  };

  const handleEdit = () => setIsEditing(true);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Flight Details</h2>
        {flight && !isEditing ? (
          <div className="flight-info">
            <p><strong>Departure Airport:</strong> {departureAirport}</p>
            <p><strong>Arrival Airport:</strong> {arrivalAirport}</p>
            <p><strong>Departure Date:</strong> {departureDate}</p>
            <p><strong>Arrival Date:</strong> {arrivalDate}</p>
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
              placeholder="Departure Airport"
              value={departureAirport}
              onChange={(e) => setDepartureAirport(e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Arrival Airport"
              value={arrivalAirport}
              onChange={(e) => setArrivalAirport(e.target.value)}
              className="form-input"
            />
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="form-input"
            />
            <input
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
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

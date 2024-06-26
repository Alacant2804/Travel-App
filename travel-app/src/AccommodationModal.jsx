import { useState, useEffect } from 'react';
import './AccommodationModal.css';
import axios from 'axios';

export default function AccommodationModal({ tripId, destinationId, accommodation, onSave, onClose }) {
  const [address, setAddress] = useState(accommodation?.address || '');
  const [startDate, setStartDate] = useState(accommodation?.startDate || '');
  const [endDate, setEndDate] = useState(accommodation?.endDate || '');
  const [bookingLink, setBookingLink] = useState(accommodation?.bookingLink || '');
  const [price, setPrice] = useState(accommodation?.price || 0);

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/trips/${tripId}/destinations/${destinationId}/accommodation`, {
          withCredentials: true
        });
        const fetchedAccommodation = response.data;
        setAddress(fetchedAccommodation.address);
        setStartDate(fetchedAccommodation.startDate);
        setEndDate(fetchedAccommodation.endDate);
        setBookingLink(fetchedAccommodation.bookingLink);
        setPrice(fetchedAccommodation.price);
      } catch (error) {
        console.error("Error fetching accommodation:", error);
      }
    };

    if (!accommodation) {
      fetchAccommodation();
    }
  }, [tripId, destinationId, accommodation]);

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
    if (!tripId || !destinationId) {
      console.error("Missing tripId or destinationId.");
      return;
    }
    const coordinates = await fetchCoordinates(address);
    const accommodationData = { 
      address, 
      startDate, 
      endDate, 
      bookingLink, 
      price, 
      coordinates,
      _id: accommodation?._id
    };

    console.log("tripId:", tripId);
    console.log("destinationId:", destinationId);
    console.log("Accommodation Data:", accommodationData);

    try {
      let response;
      if (accommodation?._id) {
        // Updating existing accommodation
        response = await axios.put(
          `http://localhost:5001/api/trips/${tripId}/destinations/${destinationId}/accommodation/${accommodation._id}`,
          accommodationData,
          { withCredentials: true }
        );
      } else {
        // Creating new accommodation
        response = await axios.post(
          `http://localhost:5001/api/trips/${tripId}/destinations/${destinationId}/accommodation`,
          accommodationData,
          { withCredentials: true }
        );
      }
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Error saving accommodation:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Accommodation Details</h2>
        <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            placeholder="Address (without country name)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="form-input"
          />
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-input"
          />
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-input"
          />
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="form-input"
            step="0.01"
            min="0"
          />
          <label htmlFor="bookingLink">Booking Link</label>
          <input
            type="url"
            id="bookingLink"
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
      </div>
    </div>
  );
}

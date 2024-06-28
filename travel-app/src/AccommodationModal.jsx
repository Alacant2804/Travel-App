import { useState, useEffect } from 'react';
import Loading from './Loading';
import './AccommodationModal.css';
import axios from 'axios';

export default function AccommodationModal({ tripId, destinationId, accommodation, onSave, onClose }) {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingLink, setBookingLink] = useState('');
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/trips/${tripId}/destinations/${destinationId}/accommodation`, {
          withCredentials: true
        });
        const fetchedAccommodation = response.data;
        console.log("Fetched accommodation data:", fetchedAccommodation);
        if (fetchedAccommodation) {
          setAddress(fetchedAccommodation[0].address || '');
          setStartDate(fetchedAccommodation[0].startDate ? fetchedAccommodation[0].startDate.split('T')[0] : '');
          setEndDate(fetchedAccommodation[0].endDate ? fetchedAccommodation[0].endDate.split('T')[0] : '');
          setBookingLink(fetchedAccommodation[0].bookingLink || '');
          setPrice(parseFloat(fetchedAccommodation[0].price) || 0);
        } else {
          console.log("No accommodation data received.");
        }
      } catch (error) {
        console.error("Error fetching accommodation:", error);
      } finally {
        setLoading(false);
      }
    };

    console.log("Fetching accommodation data...");
    fetchAccommodation();
  }, [destinationId, accommodation]);

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
      price: parseFloat(price), // Ensure price is a number
      coordinates,
      _id: accommodation?._id // Ensure this is included for updates
    };

    try {
      let response;
      if (accommodation?._id) {
        // Use PUT for updating existing accommodation
        response = await axios.put(
          `http://localhost:5001/api/trips/${tripId}/destinations/${destinationId}/accommodation/${accommodation._id}`,
          accommodationData,
          { withCredentials: true }
        );
      } else {
        // Use POST for creating new accommodation
        response = await axios.post(
          `http://localhost:5001/api/trips/${tripId}/destinations/${destinationId}/accommodation`,
          accommodationData,
          { withCredentials: true }
        );
      }
      onSave(response.data); // Ensure the parent component state is updated
      setIsEditing(false); // Exit edit mode after saving
    } catch (error) {
      console.error("Error saving accommodation:", error);
    }
  };

  if (loading) {
    return <Loading />
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Accommodation Details</h2>
        {isEditing || !accommodation ? (
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
        ) : (
          <div className="accommodation-details">
            <p><strong>Address:</strong> {address}</p>
            <p><strong>Start Date:</strong> {startDate}</p>
            <p><strong>End Date:</strong> {endDate}</p>
            <p><strong>Booking Link:</strong> <a href={bookingLink} target="_blank" rel="noopener noreferrer">{bookingLink}</a></p>
            <p><strong>Price:</strong> ${parseFloat(price).toFixed(2)}</p>
            <div className="modal-actions">
              <button type="button" className="modal-btn edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
              <button type="button" className="modal-btn close-btn" onClick={onClose}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

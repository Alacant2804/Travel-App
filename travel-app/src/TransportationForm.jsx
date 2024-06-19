import { useState, useEffect } from 'react';

export default function TransportationForm({ details, onSave, onClose }) {
  const [pickupPlace, setPickupPlace] = useState('');
  const [dropoffPlace, setDropoffPlace] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState(0);
  const [bookingLink, setBookingLink] = useState('');

  useEffect(() => {
    if (details) {
      setPickupPlace(details.pickupPlace || '');
      setDropoffPlace(details.dropoffPlace || '');
      setPickupDate(details.pickupDate?.split('T')[0] || '');
      setDropoffDate(details.dropoffDate?.split('T')[0] || '');
      setDuration(details.duration || '');
      setPrice(details.price || 0);
      setBookingLink(details.bookingLink || '');
    }
  }, [details]);

  const handleSave = (e) => {
    e.preventDefault();
    onSave({
      pickupPlace,
      dropoffPlace,
      pickupDate,
      dropoffDate,
      duration,
      price: parseFloat(price),
      bookingLink,
      _id: details?._id
    });
  };

  return (
    <form className="modal-form" onSubmit={handleSave}>
      <label htmlFor="pickupPlace">Pick-Up Place</label>
      <input
        type="text"
        id="pickupPlace"
        placeholder="Pick-Up Place"
        value={pickupPlace}
        onChange={(e) => setPickupPlace(e.target.value)}
        className="form-input"
      />
      <label htmlFor="dropoffPlace">Drop-Off Place</label>
      <input
        type="text"
        id="dropoffPlace"
        placeholder="Drop-Off Place"
        value={dropoffPlace}
        onChange={(e) => setDropoffPlace(e.target.value)}
        className="form-input"
      />
      <label htmlFor="pickupDate">Pick-Up Date</label>
      <input
        type="date"
        id="pickupDate"
        value={pickupDate}
        onChange={(e) => setPickupDate(e.target.value)}
        className="form-input"
      />
      <label htmlFor="dropoffDate">Drop-Off Date</label>
      <input
        type="date"
        id="dropoffDate"
        value={dropoffDate}
        onChange={(e) => setDropoffDate(e.target.value)}
        className="form-input"
      />
      <label htmlFor="duration">Duration (days)</label>
      <input
        type="number"
        id="duration"
        placeholder="Duration"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
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
  );
}

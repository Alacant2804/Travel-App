import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function FlightForm({ flight, type, setType, onSave, onClose }) {
  const [departureAirport, setDepartureAirport] = useState(flight?.departureAirport || '');
  const [arrivalAirport, setArrivalAirport] = useState(flight?.arrivalAirport || '');
  const [departureDate, setDepartureDate] = useState(flight?.departureDate ? new Date(flight.departureDate).toISOString().split('T')[0] : '');
  const [bookingLink, setBookingLink] = useState(flight?.bookingLink || '');
  const [price, setPrice] = useState(flight?.price || 0);
  const [isEditingOutbound, setIsEditingOutbound] = useState(true);

  useEffect(() => {
    console.log("Type: ", type);
  }, [type]);

  useEffect(() => {
    if (flight) {
      setDepartureAirport(flight.departureAirport || '');
      setArrivalAirport(flight.arrivalAirport || '');
      setDepartureDate(flight.departureDate ? new Date(flight.departureDate).toISOString().split('T')[0] : '');
      setBookingLink(flight.bookingLink || '');
      setPrice(flight?.price || 0);
      if (isEditingOutbound) {
        setType('outbound');
      } else {
        setType('inbound');
      }
    }
  }, [flight]);

  const handleSave = (e) => {
    e.preventDefault();
    if (isNaN(parseFloat(price))) {
      toast.error("Invalid price, please try again", {theme: 'colored'});
      return;
    }
    onSave({
      departureAirport,
      arrivalAirport,
      departureDate,
      bookingLink,
      price: parseFloat(price),
      _id: flight?._id,
      type
    });
  };

  return (
    <form className="modal-form" onSubmit={handleSave}>
      <div className="modal-tabs">
          <button
            type='button'
            className={`tab-btn ${isEditingOutbound ? 'active' : ''}`}
            onClick={() => {
              setIsEditingOutbound(true);
              setType('outbound');
            }}
          >
            Outbound
          </button>
          <button
            type='button'
            className={`tab-btn ${!isEditingOutbound ? 'active' : ''}`}
            onClick={() => {
              setIsEditingOutbound(false);
              setType('inbound');
            }}
          >
            Inbound
          </button>
        </div>
      <div className="form-scroll">
      <label htmlFor="departureAirport">Departure Airport</label>
      <input
        type="text"
        id="departureAirport"
        placeholder="Departure Airport"
        value={departureAirport}
        onChange={(e) => setDepartureAirport(e.target.value)}
        className="form-input"
      />
      <label htmlFor="arrivalAirport">Arrival Airport</label>
      <input
        type="text"
        id="arrivalAirport"
        placeholder="Arrival Airport"
        value={arrivalAirport}
        onChange={(e) => setArrivalAirport(e.target.value)}
        className="form-input"
      />
      <label htmlFor="departureDate">Departure Date</label>
      <input
        type="date"
        id="departureDate"
        value={departureDate}
        onChange={(e) => setDepartureDate(e.target.value)}
        className="form-input"
      />
      <label htmlFor="price">Price</label>
      <input
        type="number"
        id='price'
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
      </div>
    </form>
  );
}

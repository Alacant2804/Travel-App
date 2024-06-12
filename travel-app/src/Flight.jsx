import {useState} from 'react';

export default function Flights({flight, onSave, onClose}) {
    const [departureAirport, setDepartureAirport] = useState(flight?.departureAirport || '');
    const [arrivalAirport, setArrivalAirport] = useState(flight?.arrivalAirport || '');
    const [departureDate, setDepartureDate] = useState(flight?.departureDate || '');
    const [arrivalDate, setArrivalDate] = useState(flight?.arrivalDate || '');
    const [bookingLink, setBookingLink] = useState(flight?.bookingLink || '');
    const [isEditing, setIsEditing] = useState(!flight);
    const [price, setPrice] = useState(flight?.price || 0);

    useEffect(() => {
        if (flight) {
            setDepartureAirport(flight.departureAirport);
            setArrivalAirport(flight.arrivalAirport);
            departureDate(flight.departureDate);
            arrivalDate(flight.arrivalDate);
            setBookingLink(flight.bookingLink);
            setPrice(flight.price || 0);
        }
    }, [flight]);

    return (
    <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2>Accommodation Details</h2>
      {flight && !isEditing ? (
        <div className="accommodation-info">
          <p><strong>Departure Airport:</strong> {departureAirport}</p>
          <p><strong>Arrival Airport:</strong> {arrivalAirport}</p>
          <p><strong>Departure Date:</strong> {departureDate}</p>
          <p><strong>Departure Date:</strong> {arrivalDate}</p>
          <p><strong>Price:</strong> ${price.toFixed(2)}</p>
          {bookingLink && (
            <p><strong>Booking Link:</strong> <a href={bookingLink} target="_blank" rel="noopener noreferrer">{bookingLink}</a></p>
          )}
          <p>Upload Tickets</p>
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
};
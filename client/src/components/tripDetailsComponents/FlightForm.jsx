import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function FlightForm({ flight, type, setType, onSave, onClose }) {
  const [departureAirport, setDepartureAirport] = useState(
    flight?.departureAirport || ""
  );
  const [arrivalAirport, setArrivalAirport] = useState(
    flight?.arrivalAirport || ""
  );
  const [departureDate, setDepartureDate] = useState(
    flight?.departureDate
      ? new Date(flight.departureDate).toISOString().split("T")[0]
      : ""
  );
  const [bookingLink, setBookingLink] = useState(flight?.bookingLink || "");
  const [price, setPrice] = useState(flight?.price || 0);

  useEffect(() => {
    if (flight) {
      setDepartureAirport(flight.departureAirport || "");
      setArrivalAirport(flight.arrivalAirport || "");
      setDepartureDate(
        flight.departureDate
          ? new Date(flight.departureDate).toISOString().split("T")[0]
          : ""
      );
      setBookingLink(flight.bookingLink || "");
      setPrice(flight?.price || 0);
    }
  }, [flight]);

  const handleSave = (e) => {
    e.preventDefault();

    // Front end form validation
    if (!type || (type !== "outbound" && type !== "inbound")) {
      toast.error("Type is required. Please select a valid type.", {
        theme: "colored",
      });
      return;
    }
    if (!departureAirport) {
      toast.error("Departure airport is required.", {
        theme: "colored",
      });
      return;
    }

    if (typeof departureAirport !== "string" || /\d/.test(departureAirport)) {
      toast.error("Departure airport cannot be a number.", {
        theme: "colored",
      });
      return;
    }

    if (!arrivalAirport) {
      toast.error("Arrival airport is required.", {
        theme: "colored",
      });
      return;
    }

    if (typeof arrivalAirport !== "string" || /\d/.test(arrivalAirport)) {
      toast.error("Arrival airport cannot be a number.", {
        theme: "colored",
      });
      return;
    }

    if (departureAirport === arrivalAirport) {
      toast.error("Departure and arrival airports cannot be the same.", {
        theme: "colored",
      });
      return;
    }

    if (!departureDate) {
      toast.error("Please provide a valid departure date.", {
        theme: "colored",
      });
      return;
    }

    if (!price || isNaN(parseFloat(price)) || price < 0) {
      toast.error("Invalid price. Price must be a valid positive number.", {
        theme: "colored",
      });
      return;
    }

    onSave({
      departureAirport,
      arrivalAirport,
      departureDate,
      bookingLink,
      price: parseFloat(price),
      _id: flight?._id,
      type,
    });
  };

  return (
    <form className="modal-form" onSubmit={handleSave}>
      <div className="modal-tabs">
        <button
          type="button"
          className={`tab-btn ${type === "outbound" ? "active" : ""}`}
          onClick={() => setType("outbound")}
        >
          Outbound
        </button>
        <button
          type="button"
          className={`tab-btn ${type === "inbound" ? "active" : ""}`}
          onClick={() => setType("inbound")}
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
          <button
            type="button"
            className="modal-btn cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="modal-btn submit-btn">
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

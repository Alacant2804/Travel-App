import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./TransportationForm.css";

export default function TransportationForm({ details, onSave, onClose }) {
  const [pickupPlace, setPickupPlace] = useState("");
  const [dropoffPlace, setDropoffPlace] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState(0);
  const [bookingLink, setBookingLink] = useState("");

  useEffect(() => {
    if (details) {
      setPickupPlace(details.pickupPlace || "");
      setDropoffPlace(details.dropoffPlace || "");
      setPickupDate(details.pickupDate?.split("T")[0] || "");
      setDropoffDate(details.dropoffDate?.split("T")[0] || "");
      setDuration(details.duration || "");
      setPrice(details.price || 0);
      setBookingLink(details.bookingLink || "");
    }
  }, [details]);

  const handleSave = (e) => {
    e.preventDefault();

    // Front end form validation
    if (!pickupPlace.trim()) {
      toast.error("Please provide a pick up place.", { theme: "colored" });
      return;
    }

    if (typeof pickupPlace !== "string" || !/[a-zA-Z]/.test(pickupPlace)) {
      toast.error("Pick up place cannot be a number.", { theme: "colored" });
      return;
    }

    if (!dropoffPlace.trim()) {
      toast.error("Please provide a drop off place.", { theme: "colored" });
      return;
    }

    if (typeof dropoffPlace !== "string" || !/[a-zA-Z]/.test(dropoffPlace)) {
      toast.error("Drop off place cannot be a number.", { theme: "colored" });
      return;
    }

    if (!pickupDate) {
      toast.error("Please provide pick up date.", {
        theme: "colored",
      });
      return;
    }

    if (!pickupDate || !dropoffDate) {
      toast.error("Please provide drop off date.", {
        theme: "colored",
      });
      return;
    }

    if (new Date(pickupDate) > new Date(dropoffDate)) {
      toast.error("End date cannot be earlier than the start date.", {
        theme: "colored",
      });
      return;
    }

    if (price == null || price < 0 || isNaN(price)) {
      toast.error("Invalid price. Price must be a valid positive number.", {
        theme: "colored",
      });
      return;
    }

    // Save transportation data
    onSave({
      pickupPlace,
      dropoffPlace,
      pickupDate,
      dropoffDate,
      duration,
      price: parseFloat(price),
      bookingLink,
      _id: details?._id,
    });
  };

  return (
    <form className="modal-form" onSubmit={handleSave}>
      <div className="form-scroll">
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
      </div>
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
    </form>
  );
}

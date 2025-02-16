import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { calculateDuration, getToken } from "../../util/util";
import {
  getCoordinates,
  fetchAccommodationData,
} from "../../services/tripService";
import "./AccommodationModal.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function AccommodationModal({
  tripId,
  destinationId,
  accommodation,
  onSave,
  onClose,
  setLoading,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState(0);
  const [bookingLink, setBookingLink] = useState("");
  const [price, setPrice] = useState(0);

  // Fetch accommodation data & set state
  useEffect(() => {
    setLoading(true);
    fetchAccommodationData(tripId, destinationId)
      .then((fetchedAccommodation) => {
        if (fetchedAccommodation) {
          setAddress(fetchedAccommodation[0]?.address || "");
          setStartDate(
            fetchedAccommodation[0]?.startDate
              ? fetchedAccommodation[0].startDate.split("T")[0]
              : ""
          );
          setEndDate(
            fetchedAccommodation[0]?.endDate
              ? fetchedAccommodation[0].endDate.split("T")[0]
              : ""
          );
          setBookingLink(fetchedAccommodation[0]?.bookingLink || "");
          setPrice(parseFloat(fetchedAccommodation[0]?.price) || 0);
        } else {
          console.log("No accommodation data received.");
        }
      })
      .catch((error) => console.error("Error fetching accommodation", error))
      .finally(() => setLoading(false));
  }, [tripId, destinationId]);

  // Calculate duration
  useEffect(() => {
    if (startDate && endDate) {
      setDuration(calculateDuration(startDate, endDate));
    }
  }, [startDate, endDate]);

  // Save accommodation data
  const handleSave = async () => {
    if (!tripId || !destinationId) {
      console.error("Missing tripId or destinationId.");
      return;
    }

    // Front end form validation
    if (!address || typeof address !== "string") {
      toast.error(
        "Invalid address. Address must be a string containing letters only.",
        { theme: "colored" }
      );
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please provide start and end dates.", { theme: "colored" });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be earlier than the start date.",
      });
    }

    if (!price || price < 0 || isNaN(price)) {
      toast.error("Invalid price. Price must be a valid positive number.", {
        theme: "colored",
      });
      return;
    }

    const coordinates = await getCoordinates(address);

    const accommodationData = {
      address,
      startDate,
      endDate,
      bookingLink,
      price: parseFloat(price),
      coordinates,
      _id: accommodation?._id,
    };

    try {
      const token = getToken();
      let url = `${API_URL}/trips/accommodation/${tripId}/destinations/${destinationId}`;
      const method = accommodation && accommodation._id ? "put" : "post";

      if (method === "put") {
        url = `${API_URL}/trips/accommodation/${tripId}/destinations/${destinationId}/${accommodation._id}`;
      }

      const response = await axios({
        method,
        url,
        data: accommodationData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onSave(response.data.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving accommodation:", error);
      console.log(error.response.data);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message, { theme: "colored" });
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Accommodation Details</h2>
        {isEditing || !accommodation ? (
          <form
            className="modal-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
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
        ) : (
          <div className="accommodation-details">
            <p>
              <strong>Address:</strong> {address}
            </p>
            <p>
              <strong>Start Date:</strong> {startDate}
            </p>
            <p>
              <strong>End Date:</strong> {endDate}
            </p>
            <p>
              <strong>Duration:</strong>{" "}
              {duration === 1 ? duration + " day" : duration + " days"}
            </p>
            <p>
              <strong>Booking Link:</strong>{" "}
              <a href={bookingLink} target="_blank" rel="noopener noreferrer">
                {bookingLink}
              </a>
            </p>
            <p>
              <strong>Price:</strong> ${parseFloat(price).toFixed(2)}
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn edit-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                type="button"
                className="modal-btn close-btn"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

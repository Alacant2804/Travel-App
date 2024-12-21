import { useState, useEffect } from "react";
import Loading from "../../styles/loader/Loading";
import "./AccommodationModal.css";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function AccommodationModal({
  tripId,
  destinationId,
  accommodation,
  onSave,
  onClose,
}) {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState(0);
  const [bookingLink, setBookingLink] = useState("");
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_URL}/trips/${tripId}/destinations/${destinationId}/accommodation`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const fetchedAccommodation = response.data;
        console.log("Fetched accommodation data:", fetchedAccommodation);
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
      } catch (error) {
        console.error("Error fetching accommodation:", error);
      } finally {
        setLoading(false);
      }
    };

    console.log("Fetching accommodation data...");
    fetchAccommodation();
  }, [destinationId, accommodation]);

  useEffect(() => {
    if (startDate && endDate) {
      setDuration(calculateDuration(startDate, endDate));
    }
  }, [startDate, endDate]);

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate); // Convert startDate string to Date object
    const end = new Date(endDate); // Convert endDate string to Date object
    const durationInMilliseconds = end - start; // Calculate the difference in milliseconds
    return Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24)); // Convert to days and round up
  };

  const fetchCoordinates = async (address) => {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: address,
            format: "json",
            limit: 1,
          },
        }
      );
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
      price: parseFloat(price),
      coordinates,
      _id: accommodation?._id,
    };

    try {
      const token = localStorage.getItem("token");
      let response;
      if (accommodation?._id) {
        // Use PUT for updating existing accommodation
        response = await axios.put(
          `${API_URL}/trips/${tripId}/destinations/${destinationId}/accommodation/${accommodation._id}`,
          accommodationData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Use POST for creating new accommodation
        response = await axios.post(
          `${API_URL}/trips/${tripId}/destinations/${destinationId}/accommodation`,
          accommodationData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      onSave(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving accommodation:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

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

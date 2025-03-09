import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./TripFormModal.css";

export default function TripFormModal({ onRequestClose, onSubmit, trip }) {
  const [tripName, setTripName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (trip) {
      setTripName((prev) => (prev !== trip.tripName ? trip.tripName : prev));
      setCountry((prev) => (prev !== trip.country ? trip.country : prev));

      const { city, startDate, endDate } = trip.destinations[0] || {};
      setCity((prev) => (prev !== city ? city : prev));
      setStartDate((prev) =>
        prev !== startDate ? startDate?.split("T")[0] : prev
      );
      setEndDate((prev) => (prev !== endDate ? endDate?.split("T")[0] : prev));
    }
  }, [trip]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!tripName.trim()) {
      toast.error("Trip name is required", {
        theme: "colored",
      });
      return;
    }

    if (!country.trim()) {
      toast.error("Please provide a valid country name.", {
        theme: "colored",
      });
      return;
    }

    if (typeof country !== "string" || !/[a-zA-Z]/.test(country)) {
      toast.error("Country name cannot be a number.", {
        theme: "colored",
      });
      return;
    }

    if (!city.trim()) {
      toast.error("Please provide a valid city name.", {
        theme: "colored",
      });
      return;
    }

    if (typeof city !== "string" || !/[a-zA-Z]/.test(city)) {
      toast.error("City cannot be a number.", {
        theme: "colored",
      });
      return;
    }

    if (!startDate) {
      toast.error("Please provide a valid start date.", {
        theme: "colored",
      });
      return;
    }

    if (!endDate) {
      toast.error("Please provide a valid end date.", {
        theme: "colored",
      });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error(
        "The start date cannot be after the end date. Please select valid dates.",
        {
          theme: "colored",
        }
      );
      return;
    }

    const tripData = {
      tripName,
      country,
      destinations: [{ city, startDate, endDate }],
    };

    onSubmit(tripData);

    setTripName("");
    setCountry("");
    setCity("");
    setStartDate("");
    setEndDate("");
    onRequestClose();
  };

  return (
    <div className="modal-overlay" onClick={onRequestClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{trip ? "Edit Trip" : "Create a New Trip"}</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Trip Name"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="form-input"
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="form-input"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-input"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-input"
          />
          <div className="modal-actions">
            <button
              type="button"
              onClick={onRequestClose}
              className="modal-btn cancel-btn"
            >
              Cancel
            </button>
            <button type="submit" className="modal-btn submit-btn">
              {trip ? "Save Changes" : "Create Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

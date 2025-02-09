import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./FlightModal.css";
import FlightForm from "./FlightForm";
import { getToken } from "../../util/util";
import { fetchFlightData } from "../../services/tripService";

const API_URL = import.meta.env.VITE_API_URL;

export default function FlightModal({
  tripId,
  outboundFlight,
  setOutboundFlight,
  setInboundFlight,
  inboundFlight,
  onClose,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [type, setType] = useState("outbound");
  const [selectedType, setSelectedType] = useState("outbound");

  const selectedFlight =
    selectedType === "outbound" ? outboundFlight : inboundFlight;

  // Save flight details
  const handleSaveFlight = async (flightData) => {
    try {
      const token = getToken();
      let url = `${API_URL}/trips/flights/${tripId}/flights`;
      const method = flightData._id ? "put" : "post";

      if (method === "put") {
        url = `${API_URL}/trips/flights/${tripId}/flights/${flightData.type}`;
      }

      const response = await axios({
        method,
        url,
        data: flightData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response: ", response.data.data);
      // Update specific flight state based on type
      fetchFlightData(tripId).then((updatedFlightData) => {
        const outbound =
          updatedFlightData.find((f) => f.type === "outbound") || {};
        const inbound =
          updatedFlightData.find((f) => f.type === "inbound") || {};

        setOutboundFlight(outbound);
        setInboundFlight(inbound);
      });

      onClose(); // Close the modal after successful save
    } catch (error) {
      console.error("Error saving flight:", error);
      toast.error("Couldn't save the flight. Please try again later.", {
        theme: "colored",
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Flight Details</h2>
        {isEditing ? (
          <FlightForm
            flight={type === "outbound" ? outboundFlight : inboundFlight}
            type={type}
            setType={setType}
            onSave={handleSaveFlight}
            onClose={() => setIsEditing(false)}
          />
        ) : (
          <div>
            <h3>
              {selectedType === "outbound"
                ? "Outbound Flight"
                : "Inbound Flight"}
            </h3>
            <div className="modal-tabs">
              <button
                type="button"
                className={`tab-btn ${
                  selectedType === "outbound" ? "active" : ""
                }`}
                onClick={() => setSelectedType("outbound")}
              >
                Outbound
              </button>
              <button
                type="button"
                className={`tab-btn ${
                  selectedType === "inbound" ? "active" : ""
                }`}
                onClick={() => setSelectedType("inbound")}
              >
                Inbound
              </button>
            </div>
            <table className="flight-info-table">
              <tbody>
                <tr>
                  <td>
                    <strong>Departure Airport:</strong>
                  </td>
                  <td>{selectedFlight?.departureAirport || "N/A"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Arrival Airport:</strong>
                  </td>
                  <td>{selectedFlight?.arrivalAirport || "N/A"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Departure Date:</strong>
                  </td>
                  <td>
                    {selectedFlight?.departureDate?.split("T")[0] || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Price:</strong>
                  </td>
                  <td>${selectedFlight?.price?.toFixed(2) || "0.00"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Booking Link:</strong>
                  </td>
                  <td>
                    {selectedFlight?.bookingLink ? (
                      <a
                        href={selectedFlight.bookingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedFlight.bookingLink}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="modal-actions">
              <button
                className="modal-btn edit-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button className="modal-btn close-btn" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

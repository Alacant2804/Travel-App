import { useState, useEffect } from "react";
import axios from "axios";
import "./FlightModal.css";
import FlightForm from "./FlightForm";
import { getToken } from "../../utils/util";
import { fetchFlightData } from "../../services/tripService";
import errorHandler from "../../utils/errorHandler";

const API_URL = import.meta.env.VITE_API_URL;

export default function FlightModal({
  tripId,
  outboundFlight,
  setOutboundFlight,
  setInboundFlight,
  inboundFlight,
  onClose,
}) {
  const [type, setType] = useState("outbound");
  const [isEditing, setIsEditing] = useState(false);
  const [editingType, setEditingType] = useState(null); // Store the type being edited
  const [flightToEdit, setFlightToEdit] = useState(null); // Store the actual flight data to edit

  const handleEdit = (type) => {
    setEditingType(type);
    setFlightToEdit(type === "outbound" ? outboundFlight : inboundFlight);
    setIsEditing(true);
  };

  // Save flight details
  const handleSaveFlight = async (flightData) => {
    try {
      const token = getToken();
      let url = `${API_URL}/trips/flights/${tripId}/flights`;
      const method = flightData._id ? "put" : "post";

      if (method === "put") {
        url = `${API_URL}/trips/flights/${tripId}/flights/${flightData.type}`;
      }

      await axios({
        method,
        url,
        data: flightData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
      errorHandler(error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Flight Details</h2>
        {isEditing ? (
          <FlightForm
            flight={editingType === "outbound" ? outboundFlight : inboundFlight}
            type={editingType}
            setType={setEditingType}
            onSave={handleSaveFlight}
            onClose={() => {
              setIsEditing(false);
              setEditingType(null);
              setFlightToEdit(null);
            }}
          />
        ) : (
          <div>
            <h3>
              {type === "outbound" ? "Outbound Flight" : "Inbound Flight"}
            </h3>
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
            <table className="flight-info-table">
              <tbody>
                <tr>
                  <td>
                    <strong>Departure Airport:</strong>
                  </td>
                  <td>
                    {type === "outbound"
                      ? outboundFlight?.departureAirport
                      : inboundFlight?.departureAirport || ""}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Arrival Airport:</strong>
                  </td>
                  <td>
                    {type === "outbound"
                      ? outboundFlight?.arrivalAirport
                      : inboundFlight?.arrivalAirport || ""}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Departure Date:</strong>
                  </td>
                  <td>
                    {type === "outbound"
                      ? outboundFlight?.departureDate?.split("T")[0]
                      : inboundFlight?.departureDate?.split("T")[0] || ""}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Price:</strong>
                  </td>
                  <td>
                    $
                    {type === "outbound"
                      ? outboundFlight?.price?.toFixed(2)
                      : inboundFlight?.price?.toFixed(2) || 0}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Booking Link:</strong>
                  </td>
                  <td>
                    {type === "outbound" ? (
                      outboundFlight?.bookingLink ? (
                        <a
                          href={outboundFlight.bookingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {outboundFlight.bookingLink}
                        </a>
                      ) : (
                        ""
                      )
                    ) : inboundFlight?.bookingLink ? (
                      <a
                        href={inboundFlight.bookingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {inboundFlight.bookingLink}
                      </a>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="modal-actions">
              <button
                className="modal-btn edit-btn"
                onClick={() => handleEdit(type)}
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

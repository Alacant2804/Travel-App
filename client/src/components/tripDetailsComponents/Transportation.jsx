import { useState } from "react";
import axios from "axios";
import { getToken, calculateDuration } from "../../util/util";
import TransportationForm from "./TransportationForm";
import "./Transportation.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function TransportationModal({
  tripId,
  transportationDetails,
  setTransportationDetails,
  onClose,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveTransportation = async (transportationData) => {
    try {
      const token = getToken();
      const url = `${API_URL}/trips/transportation/${tripId}/transportation`;
      const method = transportationData._id ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: transportationData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransportationDetails(response.data.data[0]);
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error("Error saving transportation:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Transportation Details</h2>
        {isEditing ? (
          <TransportationForm
            details={transportationDetails}
            onSave={handleSaveTransportation}
            onClose={() => setIsEditing(false)}
          />
        ) : (
          <div>
            <table className="transportation-info-table">
              <tbody>
                <tr>
                  <td>
                    <strong>Pick-Up Place:</strong>
                  </td>
                  <td>{transportationDetails?.pickupPlace || "N/A"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Drop-Off Place:</strong>
                  </td>
                  <td>{transportationDetails?.dropoffPlace || "N/A"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Pick-Up Date:</strong>
                  </td>
                  <td>
                    {transportationDetails?.pickupDate?.split("T")[0] || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Drop-Off Date:</strong>
                  </td>
                  <td>
                    {transportationDetails?.dropoffDate?.split("T")[0] || "N/A"}
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Price:</strong>
                  </td>
                  <td>${transportationDetails?.price?.toFixed(2) || "N/A"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Booking Link:</strong>
                  </td>
                  <td>
                    {transportationDetails?.bookingLink ? (
                      <a
                        href={transportationDetails.bookingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {transportationDetails.bookingLink}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Duration:</strong>
                  </td>
                  <td>
                    {transportationDetails?.pickupDate &&
                    transportationDetails?.dropoffDate
                      ? (() => {
                          const duration = calculateDuration(
                            transportationDetails.pickupDate,
                            transportationDetails.dropoffDate
                          );
                          return duration > 0
                            ? `${duration} ${duration === 1 ? "day" : "days"}`
                            : "N/A";
                        })()
                      : "N/A"}
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

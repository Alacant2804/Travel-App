import { useState, useEffect } from 'react';
import axios from 'axios';
import './FlightModal.css';
import FlightForm from './FlightForm';

const API_URL = import.meta.env.VITE_API_URL;

export default function FlightModal({ tripId, onSave, onClose }) {
  const [outboundFlight, setOutboundFlight] = useState({});
  const [inboundFlight, setInboundFlight] = useState({});
  const [isEditingOutbound, setIsEditingOutbound] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchFlightData = async () => {
      try {
        const response = await axios.get(`${API_URL}/trips/${tripId}/flights`, { withCredentials: true });
        const flights = response.data;

        const outbound = flights.find(f => f.type === 'outbound') || {};
        const inbound = flights.find(f => f.type === 'inbound') || {};

        console.log("Fetched Outbound Flight: ", outbound);
        console.log("Fetched Inbound Flight: ", inbound);

        setOutboundFlight(outbound);
        setInboundFlight(inbound);
      } catch (error) {
        console.error('Error fetching flight data:', error);
      }
    };

    fetchFlightData();
  }, [tripId]);

  const handleSaveFlight = async (flightData) => {
    try {
      if (flightData._id) {
        await axios.put(
          `${API_URL}/trips/${tripId}/flights/${flightData._id}`,
          flightData,
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${API_URL}/trips/${tripId}/flights`,
          { ...flightData, type: isEditingOutbound ? 'outbound' : 'inbound' },
          { withCredentials: true }
        );
      }
      
      const response = await axios.get(`${API_URL}/trips/${tripId}/flights`, { withCredentials: true });
      const flights = response.data;

      setOutboundFlight(flights.find(f => f.type === 'outbound') || {});
      setInboundFlight(flights.find(f => f.type === 'inbound') || {});

      onSave(flightData);
      onClose();
    } catch (error) {
      console.error("Error saving flight:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Flight Details</h2>
        <div className="modal-tabs">
          <button
            className={`tab-btn ${isEditingOutbound ? 'active' : ''}`}
            onClick={() => setIsEditingOutbound(true)}
          >
            Outbound
          </button>
          <button
            className={`tab-btn ${!isEditingOutbound ? 'active' : ''}`}
            onClick={() => setIsEditingOutbound(false)}
          >
            Inbound
          </button>
        </div>
        {isEditing ? (
          <FlightForm
            flight={isEditingOutbound ? outboundFlight : inboundFlight}
            onSave={handleSaveFlight}
            onClose={() => setIsEditing(false)}
          />
        ) : (
          <div>
            <h3>{isEditingOutbound ? 'Outbound Flight' : 'Inbound Flight'}</h3>
            <table className="flight-info-table">
              <tbody>
                <tr>
                  <td><strong>Departure Airport:</strong></td>
                  <td>{isEditingOutbound ? outboundFlight.departureAirport : inboundFlight.departureAirport}</td>
                </tr>
                <tr>
                  <td><strong>Arrival Airport:</strong></td>
                  <td>{isEditingOutbound ? outboundFlight.arrivalAirport : inboundFlight.arrivalAirport}</td>
                </tr>
                <tr>
                  <td><strong>Departure Date:</strong></td>
                  <td>{isEditingOutbound ? outboundFlight.departureDate?.split('T')[0] : inboundFlight.departureDate?.split('T')[0]}</td>
                </tr>
                <tr>
                  <td><strong>Price:</strong></td>
                  <td>${(isEditingOutbound ? outboundFlight.price : inboundFlight.price)?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>Booking Link:</strong></td>
                  <td><a href={isEditingOutbound ? outboundFlight.bookingLink : inboundFlight.bookingLink} target="_blank" rel="noopener noreferrer">{isEditingOutbound ? outboundFlight.bookingLink : inboundFlight.bookingLink}</a></td>
                </tr>
              </tbody>
            </table>
            <div className="modal-actions">
              <button className="modal-btn edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
              <button className="modal-btn close-btn" onClick={onClose}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

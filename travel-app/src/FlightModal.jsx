import { useState, useEffect } from 'react';
import axios from 'axios';
import './FlightModal.css';
import FlightForm from './FlightForm';

export default function FlightModal({ tripId, onSave, onClose }) {
  const [outboundFlight, setOutboundFlight] = useState({});
  const [inboundFlight, setInboundFlight] = useState({});
  const [isEditingOutbound, setIsEditingOutbound] = useState(true);

  useEffect(() => {
    const fetchFlightData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/trips/${tripId}/flights`, { withCredentials: true });
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
          `http://localhost:5001/api/trips/${tripId}/flights/${flightData._id}`,
          flightData,
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `http://localhost:5001/api/trips/${tripId}/flights`,
          { ...flightData, type: isEditingOutbound ? 'outbound' : 'inbound' },
          { withCredentials: true }
        );
      }

      const response = await axios.get(`http://localhost:5001/api/trips/${tripId}/flights`, { withCredentials: true });
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
        <FlightForm
          flight={isEditingOutbound ? outboundFlight : inboundFlight}
          onSave={handleSaveFlight}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

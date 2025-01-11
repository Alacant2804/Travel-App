import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import './FlightModal.css';
import FlightForm from './FlightForm';
import { getToken } from '../../util/util';

const API_URL = import.meta.env.VITE_API_URL;

export default function FlightModal({ tripId, onClose }) {
  const [outboundFlight, setOutboundFlight] = useState({});
  const [inboundFlight, setInboundFlight] = useState({});
  const [isEditingOutbound, setIsEditingOutbound] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (tripId) { // Only fetch if tripId is available
        try {
          const token = getToken();
          const response = await axios.get(`${API_URL}/trips/flights/${tripId}/flights`, { 
            headers: {
            'Authorization': `Bearer ${token}`
          } });
          const flights = response.data;
  
          const outbound = flights.find(f => f.type === 'outbound') || {};
          const inbound = flights.find(f => f.type === 'inbound') || {};
  
          setOutboundFlight(outbound);
          setInboundFlight(inbound);
        } catch (error) {
          console.error('Error fetching flight data:', error);
          toast.error("Couldn't fetch the flight data. Please try again later.", {theme: 'colored'}); 
        }
      }
    };
  
    fetchData();
  }, [tripId]); // Fetch only if tripId changes

  // Save flight details
  const handleSaveFlight = async (flightData) => {
    try {
      const token = getToken();
      const url = `${API_URL}/trips/flights/${tripId}/flights/${flightData._id || ''}`;
  
      const method = flightData._id ? 'put' : 'post';  // PUT for updates, POST for new flights
      const response = await axios({
        method,
        url,
        data: flightData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      // Update specific flight state based on type
      if (flightData.type === 'outbound') {
        setOutboundFlight(response.data);
      } else {
        setInboundFlight(response.data);
      }
  
      onClose(); // Close the modal after successful save
    } catch (error) {
      console.error("Error saving flight:", error);
      toast.error("Couldn't save the flight. Please try again later.", {theme: 'colored'}); 
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

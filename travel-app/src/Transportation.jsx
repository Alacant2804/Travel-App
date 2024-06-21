import { useState, useEffect } from 'react';
import axios from 'axios';
import TransportationForm from './TransportationForm';
import './Transportation.css';

export default function Transportation({ tripId, onSave, onClose }) {
  const [transportationDetails, setTransportationDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch transportation data for the trip
  useEffect(() => {
    const fetchTransportationData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/trips/${tripId}/transportation`, { withCredentials: true });
        const details = response.data;
        console.log("Fetched Transportation Details: ", details);

        setTransportationDetails(details[0]); // Set the fetched details
      } catch (error) {
        console.error('Error fetching transportation data:', error);
      }
    };

    fetchTransportationData();
  }, [tripId]);

  const handleSaveTransportation = async (transportationData) => {
    try {
      if (transportationData._id) {
        await axios.put(
          `http://localhost:5001/api/trips/${tripId}/transportation/${transportationData._id}`,
          transportationData,
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `http://localhost:5001/api/trips/${tripId}/transportation`,
          transportationData,
          { withCredentials: true }
        );
      }
      
      console.log("Saved Transportation Data: ", transportationData);

      setTransportationDetails(transportationData);
      onSave(transportationData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving transportation:", error);
    }
  };

  if (transportationDetails === null) {
    return <p>Loading...</p>; // Display a loading state if data is still being fetched
  }

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
                  <td><strong>Pick-Up Place:</strong></td>
                  <td>{transportationDetails.pickupPlace}</td>
                </tr>
                <tr>
                  <td><strong>Drop-Off Place:</strong></td>
                  <td>{transportationDetails.dropoffPlace}</td>
                </tr>
                <tr>
                  <td><strong>Pick-Up Date:</strong></td>
                  <td>{transportationDetails.pickupDate?.split('T')[0]}</td>
                </tr>
                <tr>
                  <td><strong>Drop-Off Date:</strong></td>
                  <td>{transportationDetails.dropoffDate?.split('T')[0]}</td>
                </tr>
                <tr>
                  <td><strong>Duration:</strong></td>
                  <td>{transportationDetails.duration} days</td>
                </tr>
                <tr>
                  <td><strong>Price:</strong></td>
                  <td>${transportationDetails.price?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>Booking Link:</strong></td>
                  <td><a href={transportationDetails.bookingLink} target="_blank" rel="noopener noreferrer">{transportationDetails.bookingLink}</a></td>
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

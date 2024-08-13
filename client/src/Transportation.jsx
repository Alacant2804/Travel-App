import { useState, useEffect } from 'react';
import axios from 'axios';
import TransportationForm from './TransportationForm';
import './Transportation.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function TransportationModal({ tripId, transportation, onSave, onClose }) {
  const [transportationDetails, setTransportationDetails] = useState({
    pickupPlace: '',
    dropoffPlace: '',
    pickupDate: '',
    dropoffDate: '',
    duration: '',
    price: 0,
    bookingLink: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTransportationData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (transportation && transportation._id) {
          const response = await axios.get(`${API_URL}/trips/${tripId}/transportation/${transportation._id}`,  { 
            headers: {
            'Authorization': `Bearer ${token}`
          } });
          setTransportationDetails(response.data);
        } else {
          const response = await axios.get(`${API_URL}/trips/${tripId}/transportation`,  { 
            headers: {
            'Authorization': `Bearer ${token}`
          } });
          setTransportationDetails(response.data[0] || {});
        }
      } catch (error) {
        console.error('Error fetching transportation data:', error);
      }
    };

    fetchTransportationData();
  }, [tripId, transportation]);

  const handleSaveTransportation = async (transportationData) => {
    try {
      const token = localStorage.getItem('token');
      if (transportationData._id) {
        await axios.put(
          `${API_URL}/trips/${tripId}/transportation/${transportationData._id}`,
          transportationData,
          { 
            headers: {
            'Authorization': `Bearer ${token}`
          } }
        );
      } else {
        await axios.post(
          `${API_URL}/trips/${tripId}/transportation`,
          transportationData,
          { 
            headers: {
            'Authorization': `Bearer ${token}`
          } }
        );
      }
      
      setTransportationDetails(transportationData);
      onSave(transportationData);
      setIsEditing(false);
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
                  <td>{transportationDetails.duration === 1 ? transportationDetails.duration + " day" : transportationDetails.duration + " days"} </td>
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

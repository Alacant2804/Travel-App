import { useState } from 'react';
import Modal from 'react-modal';
import './TripFormModal.css';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
  },
};

export default function TripFormModal({ isOpen, onRequestClose, onSubmit }) {
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = () => {
    if (tripName && destination && date) {
      onSubmit({ tripName, destination, date });
      setTripName('');
      setDestination('');
      setDate('');
      onRequestClose();
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Create a New Trip"
    >
      <h2>Create a New Trip</h2>
      <input
        type="text"
        placeholder="Name of the trip"
        value={tripName}
        onChange={(e) => setTripName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button onClick={handleSubmit} className="modal-btn">Create Trip</button>
      <button onClick={onRequestClose} className="modal-btn">Cancel</button>
    </Modal>
  );
}

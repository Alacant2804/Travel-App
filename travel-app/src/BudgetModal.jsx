import { useState, useEffect } from 'react';
import axios from 'axios';
import './BudgetModal.css';

export default function BudgetModal({ tripId, onSave, onClose }) {
  const [budgetItems, setBudgetItems] = useState([]);
  const [editItemId, setEditItemId] = useState(null);
  const [editedItem, setEditedItem] = useState({ category: '', amount: '', _id: null });
  const [newItem, setNewItem] = useState({ category: '', amount: '' });

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/trips/${tripId}`, { withCredentials: true });
        const trip = response.data;

        const flightsTotal = trip.flights.reduce((sum, flight) => sum + flight.price, 0);
        const transportationTotal = trip.transportation.reduce((sum, transport) => sum + transport.price, 0);
        const placesTotal = trip.destinations.reduce((sum, destination) => {
          return sum + destination.places.reduce((placeSum, place) => placeSum + place.price, 0);
        }, 0);

        const defaultItems = [
          { category: 'Flights', amount: flightsTotal, type: 'flights', _id: 'flights' },
          { category: 'Transportation', amount: transportationTotal, type: 'transportation', _id: 'transportation' },
          { category: 'Places to Visit', amount: placesTotal, type: 'places', _id: 'places' }
        ];

        // Fetch additional budget items from the backend
        const responseBudget = await axios.get(`http://localhost:5001/api/trips/${tripId}/budget`, { withCredentials: true });
        const additionalItems = responseBudget.data.map(item => ({
          ...item,
          amount: parseFloat(item.amount), // Ensure amount is a number
        }));

        // Combine default items with additional items
        setBudgetItems([...defaultItems, ...additionalItems]);
      } catch (error) {
        console.error('Error fetching budget data:', error);
      }
    };

    fetchBudgetData();
  }, [tripId]);

  const handleEdit = (item) => {
    setEditItemId(item._id);
    setEditedItem({ category: item.category, amount: item.amount.toString(), _id: item._id });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedItem = { ...editedItem, amount: parseFloat(editedItem.amount) };

      if (updatedItem._id && !['flights', 'transportation', 'places'].includes(updatedItem._id)) {
        // Update existing budget item
        await axios.put(
          `http://localhost:5001/api/trips/${tripId}/budget/${updatedItem._id}`,
          updatedItem,
          { withCredentials: true }
        );
      }

      // Refetch and update budget items
      const response = await axios.get(`http://localhost:5001/api/trips/${tripId}/budget`, { withCredentials: true });
      const additionalItems = response.data.map(item => ({
        ...item,
        amount: parseFloat(item.amount), // Ensure amount is a number
      }));

      const defaultItems = budgetItems.filter(item => ['flights', 'transportation', 'places'].includes(item._id));

      setBudgetItems([...defaultItems, ...additionalItems]);
      setEditItemId(null);
      setEditedItem({ category: '', amount: '', _id: null });
      onSave();
    } catch (error) {
      console.error("Error saving budget item:", error);
    }
  };

  const handleSaveNew = async () => {
    try {
      const newBudgetItem = { ...newItem, amount: parseFloat(newItem.amount) };

      if (newBudgetItem.category && newBudgetItem.amount) {
        // Add new budget item
        const response = await axios.post(`http://localhost:5001/api/trips/${tripId}/budget`, newBudgetItem, { withCredentials: true });
        const createdItem = { ...response.data, amount: parseFloat(response.data.amount) };

        setBudgetItems([...budgetItems, createdItem]);
        setNewItem({ category: '', amount: '' });
        onSave();
      }
    } catch (error) {
      console.error("Error saving budget item:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/trips/${tripId}/budget/${id}`, { withCredentials: true });

      // Refetch budget items
      const response = await axios.get(`http://localhost:5001/api/trips/${tripId}/budget`, { withCredentials: true });
      const additionalItems = response.data.map(item => ({
        ...item,
        amount: parseFloat(item.amount), // Ensure amount is a number
      }));

      const defaultItems = budgetItems.filter(item => ['flights', 'transportation', 'places'].includes(item._id));

      setBudgetItems([...defaultItems, ...additionalItems]);
    } catch (error) {
      console.error("Error deleting budget item:", error);
    }
  };

  const handleEditChange = (e) => {
    setEditedItem({ ...editedItem, [e.target.name]: e.target.value });
  };

  const handleNewChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleCancelEdit = () => {
    setEditItemId(null);
    setEditedItem({ category: '', amount: '', _id: null });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Budget Details</h2>
        <table className="budget-info-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgetItems.map((item) => (
              <tr key={item._id}>
                {editItemId === item._id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="category"
                        value={editedItem.category}
                        onChange={handleEditChange}
                        readOnly={['flights', 'transportation', 'places'].includes(item._id)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="amount"
                        value={editedItem.amount}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <button className="save-btn" onClick={handleSaveEdit}>Save</button>
                      <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{item.category}</td>
                    <td>${item.amount.toFixed(2)}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                      {!['flights', 'transportation', 'places'].includes(item._id) && (
                        <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
            <tr>
              <td>
                <input
                  type="text"
                  name="category"
                  placeholder="New Category"
                  value={newItem.category}
                  onChange={handleNewChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={newItem.amount}
                  onChange={handleNewChange}
                />
              </td>
              <td>
                <button className="save-btn" onClick={handleSaveNew}>Save</button>
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ textAlign: 'right' }}><strong>Total:</strong></td>
              <td>${budgetItems.reduce((total, item) => total + parseFloat(item.amount), 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <div className="modal-actions">
          <button className="modal-btn close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import axios from 'axios';
import './BudgetModal.css';

export default function BudgetModal({ tripId, onSave, onClose }) {
  const [budgetItems, setBudgetItems] = useState([]);
  const [newItem, setNewItem] = useState({ category: '', amount: '' });

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/trips/${tripId}/budget`, { withCredentials: true });
        setBudgetItems(response.data);
      } catch (error) {
        console.error('Error fetching budget data:', error);
      }
    };

    fetchBudgetData();
  }, [tripId]);

  const handleSave = async () => {
    try {
      if (newItem._id) {
        await axios.put(`http://localhost:5001/api/trips/${tripId}/budget/${newItem._id}`, newItem, { withCredentials: true });
      } else {
        await axios.post(`http://localhost:5001/api/trips/${tripId}/budget`, newItem, { withCredentials: true });
      }

      setNewItem({ category: '', amount: '' });
      const response = await axios.get(`http://localhost:5001/api/trips/${tripId}/budget`, { withCredentials: true });
      setBudgetItems(response.data);
      onSave();
    } catch (error) {
      console.error("Error saving budget item:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/trips/${tripId}/budget/${id}`, { withCredentials: true });
      const response = await axios.get(`http://localhost:5001/api/trips/${tripId}/budget`, { withCredentials: true });
      setBudgetItems(response.data);
    } catch (error) {
      console.error("Error deleting budget item:", error);
    }
  };

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
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
                <td>{item.category}</td>
                <td>${item.amount.toFixed(2)}</td>
                <td>
                  <button className="edit-btn" onClick={() => setNewItem(item)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <input
                  type="text"
                  name="category"
                  placeholder="New Category"
                  value={newItem.category}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={newItem.amount}
                  onChange={handleChange}
                />
              </td>
              <td>
                <button className="save-btn" onClick={handleSave}>Save</button>
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ textAlign: 'right' }}><strong>Total:</strong></td>
              <td>${budgetItems.reduce((total, item) => total + item.amount, 0).toFixed(2)}</td>
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

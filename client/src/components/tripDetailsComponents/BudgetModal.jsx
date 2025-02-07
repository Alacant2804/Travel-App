import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./BudgetModal.css";
import { getToken } from "../../util/util";
import { fetchBudgetData } from "../../services/tripService";

const API_URL = import.meta.env.VITE_API_URL;

export default function BudgetModal({ tripId, onClose }) {
  const [budgetItems, setBudgetItems] = useState([]);
  const [editItemId, setEditItemId] = useState(null);
  const [editedItem, setEditedItem] = useState({
    category: "",
    amount: "",
    _id: null,
  });
  const [newItem, setNewItem] = useState({ category: "", amount: "" });

  // Fetch budget data
  useEffect(() => {
    if (!tripId) return;
    fetchBudgetData(tripId)
      .then((trip) => setBudgetItems(trip))
      .catch(() =>
        toast.error("Failed to fetch budget items:", { theme: "colored" })
      );
  }, [tripId]);

  // Handle editing item
  const handleEdit = (item) => {
    setEditItemId(item._id);
    setEditedItem({
      category: item.category,
      amount: item.amount.toString(),
      _id: item._id,
    });
  };

  // Save updated item
  const handleSaveEdit = async () => {
    try {
      const token = getToken();
      const updatedItem = {
        ...editedItem,
        amount: parseFloat(editedItem.amount),
      };

      await axios.put(
        `${API_URL}/trips/budget/${tripId}/${updatedItem._id}`,
        updatedItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setBudgetItems((prevItems) =>
        prevItems.map((item) =>
          item._id === updatedItem._id ? updatedItem : item
        )
      );

      // Reset the form
      setEditItemId(null);
      setEditedItem({ category: "", amount: "", _id: null });
      toast.success("Budget updated", { theme: "colored" });
    } catch (error) {
      console.error("Error saving budget item:", error);
      toast.error("Couldn't update budget item", { theme: "colored" });
    }
  };

  // Save new item
  const handleSaveNew = async () => {
    try {
      const token = getToken();
      const newBudgetItem = { ...newItem, amount: parseFloat(newItem.amount) };

      // Check if category and amount are provided
      if (newBudgetItem.category && newBudgetItem.amount) {
        const response = await axios.post(
          `${API_URL}/trips/budget/${tripId}`,
          newBudgetItem,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update local state with new budget item
        setBudgetItems((prevItems) => [...prevItems, response.data.data]);

        // Reset the form
        setNewItem({ category: "", amount: "" });
        toast.success("Budget updated", { theme: "colored" });
      }
    } catch (error) {
      console.error("Error saving budget item:", error);
      toast.error("Couldn't save new budget item", { theme: "colored" });
    }
  };

  // Delete budget item
  const handleDelete = async (id) => {
    try {
      const token = getToken();
      await axios.delete(`${API_URL}/trips/budget/${tripId}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBudgetItems((prevItems) =>
        prevItems.filter((item) => item._id !== id)
      );
      toast.success("Budget item deleted", { theme: "colored" });
    } catch (error) {
      console.error("Error deleting budget item:", error);
      toast.error("Couldn't delete budget item", { theme: "colored" });
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
    setEditedItem({ category: "", amount: "", _id: null });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Budget Details</h2>
        <div className="modal-scroll">
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
                  <td>
                    {editItemId === item._id ? (
                      <input
                        type="text"
                        name="category"
                        value={editedItem.category}
                        onChange={handleEditChange}
                        readOnly={[
                          "default-flights",
                          "default-transportation",
                          "default-places",
                          "default-accommodation",
                        ].includes(item._id)}
                      />
                    ) : (
                      item.category
                    )}
                  </td>
                  <td>
                    {editItemId === item._id ? (
                      <input
                        type="number"
                        name="amount"
                        value={editedItem.amount}
                        onChange={handleEditChange}
                      />
                    ) : (
                      `$${item.amount.toFixed(2)}`
                    )}
                  </td>
                  <td>
                    {editItemId === item._id ? (
                      <>
                        <button className="save-btn" onClick={handleSaveEdit}>
                          Save
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : ![
                        "default-flights",
                        "default-transportation",
                        "default-places",
                        "default-accommodation",
                      ].includes(item._id) ? (
                      <>
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </>
                    ) : null}
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
                  <button className="save-btn" onClick={handleSaveNew}>
                    Save
                  </button>
                </td>
              </tr>
              <tr>
                <td colSpan="2" style={{ textAlign: "right" }}>
                  <strong>Total:</strong>
                </td>
                <td>
                  $
                  {budgetItems
                    .reduce((total, item) => total + parseFloat(item.amount), 0)
                    .toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="modal-actions">
          <button className="modal-btn close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

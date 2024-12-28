import express from "express";
import auth from "../middleware/auth.js";
import Trip from "../models/Trip.js";

const router = express.Router();

// Get budget items for a trip
router.get("/:tripId/budget", auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId, "budget");
    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }
    res.status(200).json(trip.budget);
  } catch (error) {
    console.error("Error while fetching budget details:", error);
    res.status(500).send("Server error while fetching budget details");
  }
});

// Add a new budget item
router.post("/:tripId/budget", auth, async (req, res) => {
  const { tripId } = req.params;
  const { category, amount } = req.body;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    const newBudgetItem = { category, amount: parseFloat(amount) };

    trip.budget.push(newBudgetItem);
    await trip.save();
    res.status(201).json(newBudgetItem);
  } catch (error) {
    console.error("Error while creating the budget:", error);
    res.status(500).json({
      message: "Server error while creating the budget",
      error: error.message,
    });
  }
});

// Update an existing budget item
router.put("/:tripId/budget/:budgetId", auth, async (req, res) => {
  const { tripId, budgetId } = req.params;
  const { category, amount } = req.body;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    const budgetItem = trip.budget.id(budgetId);
    if (!budgetItem) {
      return res.status(404).json({ msg: "Budget item not found" });
    }

    budgetItem.category = category;
    budgetItem.amount = parseFloat(amount);

    await trip.save();
    res.json(budgetItem);
  } catch (error) {
    console.error("Error while updating the budget:", error);
    res.status(500).json({
      message: "Server error while updating the budget",
      error: error.message,
    });
  }
});

// Delete a budget item
router.delete("/:tripId/budget/:budgetId", auth, async (req, res) => {
  const { tripId, budgetId } = req.params;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    const budgetItemIndex = trip.budget.findIndex(
      (item) => item._id.toString() === budgetId
    );
    if (budgetItemIndex === -1) {
      return res.status(404).json({ msg: "Budget item not found" });
    }

    trip.budget.splice(budgetItemIndex, 1);
    await trip.save();

    res.json(trip.budget);
  } catch (error) {
    console.error("Error deleting budget item:", error);
    res.status(500).json({
      message: "Server error while deleting the budget item",
      error: error.message,
    });
  }
});

export default router;

import express from "express";
import auth from "../middleware/auth.js";
import { checkAccess } from "../middleware/checkAccess.js";

const router = express.Router();

// Get budget items for a trip
router.get("/:tripId/budget", auth, checkAccess, async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Budget details retrieved successfully', data: req.trip.budget });
  } catch (error) {
    next(error);
  }
});

// Add a new budget item
router.post("/:tripId/budget", auth, checkAccess, async (req, res, next) => {
  const { category, amount } = req.body;

  if (isNaN(amount)) {
    return res.status(400).json({ success: false, message: "Invalid amount provided" });
  }

  if (!category || typeof category !== "string") {
    return res.status(400).json({ success: false, message: "Invalid category provided" });
  }

  try {
    const newBudgetItem = { category, amount: parseFloat(amount) };

    // Immutably add new budget item
    req.trip.budget.push(newBudgetItem);
    await req.trip.save();

    const createdBudgetItem = req.trip.budget[req.trip.budget.length - 1];

    res.status(201).json({ success: true, message: 'Budget details created successfully', data: createdBudgetItem });
  } catch (error) {
    next(error);
  }
});

// Update an existing budget item
router.put("/:tripId/budget/:budgetId", auth, checkAccess, async (req, res, next) => {
  const { budgetId } = req.params;
  const { category, amount } = req.body;

  if (isNaN(amount)) {
    return res.status(400).json({ success: false, message: "Invalid amount provided" });
  }

  if (!category || typeof category !== "string") {
    return res.status(400).json({ success: false, message: "Invalid category provided" });
  }

  try {
    const budgetItem = req.trip.budget.id(budgetId);
    if (!budgetItem) {
      return res.status(404).json({ success: false, message: "Budget item not found" });
    }

    budgetItem.category = category;
    budgetItem.amount = parseFloat(amount);

    await req.trip.save();
    res.status(200).json({ success: true, message: 'Budget details updated successfully', data: budgetItem });
  } catch (error) {
    next(error);
  }  
});

// Delete a budget item
router.delete("/:tripId/budget/:budgetId", auth, checkAccess, async (req, res) => {
  const { budgetId } = req.params;

  try {
    const budgetItem = req.trip.budget.id(budgetId);
    if (!budgetItem) {
      return res.status(404).json({ success: false, message: "Budget item not found" });
    }

    budgetItem.deleteOne();
    await req.trip.save();

    res.status(200).json({ success: true, message: "Budget item deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;

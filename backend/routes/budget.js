import express from "express";
import auth from "../middleware/auth.js";
import { checkAccess } from "../middleware/checkAccess.js";
import { validateBudgetInput } from "../middleware/validateInput.js";

const router = express.Router();

router.get("/:tripId", auth, checkAccess, async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Budget details retrieved successfully",
      data: req.trip.budget,
    });
  } catch (error) {
    next(error);
  }
});

// Add a new budget item
router.post(
  "/:tripId",
  auth,
  checkAccess,
  validateBudgetInput,
  async (req, res, next) => {
    const { category, amount } = req.body;

    try {
      const newBudgetItem = { category, amount: parseFloat(amount) };

      // Add new budget item
      req.trip.budget.push(newBudgetItem);
      await req.trip.save();

      // Get new budget item from database with _id
      const createdBudgetItem = req.trip.budget[req.trip.budget.length - 1];

      res.status(201).json({
        success: true,
        message: "Budget details created successfully",
        data: createdBudgetItem,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update an existing budget item
router.put(
  "/:tripId/:budgetId",
  auth,
  checkAccess,
  validateBudgetInput,
  async (req, res, next) => {
    const { budgetId } = req.params;
    const { category, amount } = req.body;

    try {
      const budgetItem = req.trip.budget.id(budgetId);
      if (!budgetItem) {
        return res
          .status(404)
          .json({ success: false, message: "Budget item not found" });
      }

      budgetItem.category = category;
      budgetItem.amount = parseFloat(amount);

      await req.trip.save();
      res.status(200).json({
        success: true,
        message: "Budget details updated successfully",
        data: budgetItem,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete a budget item
router.delete("/:tripId/:budgetId", auth, checkAccess, async (req, res) => {
  const { budgetId } = req.params;

  try {
    const budgetItem = req.trip.budget.id(budgetId);
    if (!budgetItem) {
      return res
        .status(404)
        .json({ success: false, message: "Budget item not found" });
    }

    budgetItem.deleteOne();
    await req.trip.save();

    res
      .status(200)
      .json({ success: true, message: "Budget item deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;

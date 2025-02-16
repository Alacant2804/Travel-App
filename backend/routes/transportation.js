import express from "express";
import auth from "../middleware/auth.js";
import { checkAccess } from "../middleware/checkAccess.js";
import { validateTransportationInput } from "../middleware/validateInput.js";

const router = express.Router();

// Get transportation details
router.get(
  "/:tripId/transportation",
  auth,
  checkAccess,
  async (req, res, next) => {
    try {
      res.status(200).json({
        success: true,
        message: "Transportation details retrieved successfully",
        data: req.trip.transportation,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Add transportation details
router.post(
  "/:tripId/transportation",
  auth,
  checkAccess,
  validateTransportationInput,
  async (req, res, next) => {
    const {
      pickupPlace,
      dropoffPlace,
      pickupDate,
      dropoffDate,
      duration,
      price,
      bookingLink = null,
    } = req.body;

    try {
      const newTransportation = {
        pickupPlace,
        dropoffPlace,
        pickupDate,
        dropoffDate,
        duration,
        price: parseFloat(price),
        bookingLink,
      };

      // Create new transportation
      req.trip.transportation = newTransportation;
      await req.trip.save();

      const createdTransportation = req.trip.transportation;

      res.status(201).json({
        success: true,
        message: "Transportation details added successfully",
        data: createdTransportation,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update transportation details
router.put(
  "/:tripId/transportation",
  auth,
  checkAccess,
  validateTransportationInput,
  async (req, res, next) => {
    const {
      pickupPlace,
      dropoffPlace,
      pickupDate,
      dropoffDate,
      duration,
      price,
      bookingLink,
    } = req.body;

    try {
      // Access the single transportation object
      const transportation = req.trip.transportation;

      if (!transportation) {
        return res
          .status(404)
          .json({ success: false, message: "Transportation not found" });
      }

      // Update transportation details
      transportation[0].pickupPlace = pickupPlace;
      transportation[0].dropoffPlace = dropoffPlace;
      transportation[0].pickupDate = pickupDate;
      transportation[0].dropoffDate = dropoffDate;
      transportation[0].duration = duration;
      transportation[0].price = parseFloat(price);
      transportation[0].bookingLink = bookingLink;

      await req.trip.save();

      res.status(200).json({
        success: true,
        message: "Transportation details updated successfully",
        data: transportation,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

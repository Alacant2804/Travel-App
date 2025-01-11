import express from "express";
import auth from "../middleware/auth.js";
import { checkAccess } from "../middleware/checkAccess.js";
import { validateTransportationInput } from "../middleware/validateInput.js";

const router = express.Router();

// Get transportation details
router.get("/:tripId/transportation", auth, checkAccess, async (req, res, next) => {
  try {
    res.status(200).json( { success: true, message: "Transportation details retrieved successfully", data: req.trip.transportation });
  } catch (error) {
    next(error)
  }
});

// Add transportation details
router.post("/:tripId/transportation", auth, checkAccess, validateTransportationInput, async (req, res, next) => {
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

    res.status(201).json({
      success: true,
      message: "Transportation details added successfully",
      data: newTransportation,
    });
  } catch (error) {
    next(error)
  }
});

// Update transportation details
router.put("/:tripId/transportation", auth, checkAccess, validateTransportationInput, async (req, res, next) => {
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
      const transportation = req.trip.transportation

      if (!transportation) {
        return res.status(404).json({ success: false, message: 'Transportation not found' })
      }

      if (req.body.price < 0 && isNaN(req.body.price)) {
        return res.status(400).json({ success: false, message: "Price is not valid" })
      }

      // Update transportation details
      transportation.pickupPlace = pickupPlace;
      transportation.dropoffPlace = dropoffPlace;
      transportation.pickupDate = pickupDate;
      transportation.dropoffDate = dropoffDate;
      transportation.duration = duration;
      transportation.price = parseFloat(price);
      transportation.bookingLink = bookingLink;

      await req.trip.save();

      res.status(200).json({
        success: true,
        message: "Transportation details updated successfully",
        data: transportation,
      });
    } catch (error) {
      next(error)
    }
  }
);

export default router;

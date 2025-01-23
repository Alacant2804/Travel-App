import express from "express";
import auth from '../middleware/auth.js';
import { validateAccommodationInput } from "../middleware/validateInput.js";

const router = express.Router();

router.get(
  "/:tripId/destinations/:destinationId/accommodation", 
  auth, 
  async (req, res, next) => {
    try {
      const { destination } = await findTripAndDestination(req.params.tripId, req.params.destinationId);

      const accommodation = destination.accommodation;
      if (!accommodation) {
        return res.status(404).json({ success: false, message: "Accommodation not found" });
      }

      res.status(200).json({ success: true, message: "Accommodation retrieved successfully", data: accommodation });
    } catch (error) {
      next(error)
    }
  }
);

router.post(
  "/:tripId/destinations/:destinationId/accommodation",
  auth, 
  validateAccommodationInput,
  async (req, res, next) => {
    try {      
      const { trip, destination } = await findTripAndDestination(req.params.tripId, req.params.destinationId);

      destination.accommodation = req.body;

      if (destination.accommodation) {
        return res.status(400).json({ success: false, message: "Accommodation already exists" });
      }
      
      await trip.save();

      const createdAccommodation = destination.accommodation;

      res.status(200).json({ success: true, message: "Accommodation created successfully", data: createdAccommodation });
    } catch (error) {
      next(error)
    }
  }
);

router.put(
  "/:tripId/destinations/:destinationId/accommodation/:accommodationId",
  auth, 
  validateAccommodationInput,
  async (req, res, next) => {
    try {
      const { trip, destination } = await findTripAndDestination(req.params.tripId, req.params.destinationId);

      const accommodation = destination.accommodation.id(req.params.accommodationId);
      if (!accommodation) {
        return res.status(404).json({ success: false, message: "Accommodation not found" });
      }

      accommodation.address = req.body.address,
      accommodation.startDate = req.body.startDate,
      accommodation.endDate = req.body.endDate,
      accommodation.price = parseFloat(req.body.price),
      accommodation.bookingLink = req.body.bookingLink

      await trip.save();

      res.status(200).json({ success: true, message: "Accommodation updated successfully", data: destination.accommodation });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
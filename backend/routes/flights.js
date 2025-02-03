import express from "express";
import auth from "../middleware/auth.js";
import { checkAccess } from "../middleware/checkAccess.js";
import { validateFlightInput } from "../middleware/validateInput.js";

const router = express.Router();

router.get("/:tripId/flights", auth, checkAccess, async (req, res, next) => {
  try {
    res
      .status(200)
      .json({
        success: true,
        message: "Flight details retrieved successfully",
        data: req.trip.flights,
      });
  } catch (error) {
    next(error);
  }
});

// Create flight details
router.post(
  "/:tripId/flights",
  auth,
  checkAccess,
  validateFlightInput,
  async (req, res, next) => {
    const {
      departureAirport,
      arrivalAirport,
      departureDate,
      bookingLink,
      price,
      type
    } = req.body;

    try {
      if (req.trip.flights.length >= 2) {
        return res.status(400).json({
          success: false,
          message: "You can only have one outbound and one inbound flight.",
        });
      }

      // Create new flight
      const newFlight = {
        departureAirport,
        arrivalAirport,
        departureDate,
        bookingLink,
        price: parseFloat(price),
        type
      };

      if (type === 'outbound') {
        req.trip.flights[0] = newFlight; // Set outbound flight
      } else if (type === 'inbound') {
        req.trip.flights[1] = newFlight; // Set inbound flight
      }

      await req.trip.save();

      res.status(201).json({
        success: true,
        message: "Flight details added successfully",
        data: req.trip.flights,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update flight details
router.put(
  "/:tripId/flights/:flightType",
  auth,
  checkAccess,
  validateFlightInput,
  async (req, res, next) => {
    const { flightType } = req.params;
    const {
      departureAirport,
      arrivalAirport,
      departureDate,
      bookingLink,
      price,
      type
    } = req.body;

    try {
      // Find the index for outbound or inbound flight
      const flightIndex = flightType === 'outbound' ? 0 : 1;
      const existingFlight = req.trip.flights[flightIndex];
      
      if (!existingFlight) {
        return res.status(400).json({
          success: false,
          message: `${flightType.charAt(0).toUpperCase() + flightType.slice(1)} flight not found.`,
        });
      }

      // Update the flight details
      req.trip.flights[flightIndex] = {
        ...existingFlight,
        departureAirport,
        arrivalAirport,
        departureDate,
        bookingLink,
        price: parseFloat(price),
        type
      };

      await req.trip.save();
      console.log(req.trip.flights[flightIndex]);

      res.status(200).json({
        success: true,
        message: "Flight details updated successfully",
        data: req.trip.flights[flightIndex],
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

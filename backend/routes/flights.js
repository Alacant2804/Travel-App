import express from "express";
import auth from "../middleware/auth.js";
import { checkAccess } from "../middleware/checkAccess.js";
import { validateFlightInput } from "../middleware/validateInput.js";

const router = express.Router();

router.get("/:tripId/flights", auth, checkAccess, async (req, res, next) => {
  try {
    res.status(200).json({
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
      type,
    } = req.body;

    try {
      if (req.trip.flights.some((flight) => flight.type === type)) {
        return res.status(400).json({
          success: false,
          message: `You can only have one ${type} flight.`,
        });
      }

      // Create new flight
      const newFlight = {
        departureAirport,
        arrivalAirport,
        departureDate,
        bookingLink,
        price: parseFloat(price),
        type,
      };

      // Remove old flight and add new one
      req.trip.flights = [
        ...req.trip.flights.filter((flight) => flight.type !== type),
        newFlight,
      ];

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
    const {
      departureAirport,
      arrivalAirport,
      departureDate,
      bookingLink,
      price,
      type,
    } = req.body;

    try {
      // Find the flight index
      let flightIndex = req.trip.flights.findIndex(
        (flight) => flight.type === type
      );

      if (flightIndex === -1) {
        return res.status(400).json({
          success: false,
          message: `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } flight not found.`,
        });
      }

      // Update the flight details
      req.trip.flights[flightIndex] = {
        ...req.trip.flights[flightIndex],
        departureAirport,
        arrivalAirport,
        departureDate,
        bookingLink,
        price: parseFloat(price),
        type,
      };

      await req.trip.save();

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

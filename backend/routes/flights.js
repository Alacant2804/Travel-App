import express from "express";
import auth from "../middleware/auth.js";
import Trip from "../models/Trip.js";
import { checkAccess } from "../middleware/checkAccess.js";

const router = express.Router();

router.get("/:tripId/flights", auth, checkAccess, async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Flight details retrieved successfully', data: req.trip.flights });
  } catch (error) {
    next(error);
  }
});

// Create flight details
router.post("/:tripId/flights", auth, checkAccess, async (req, res, next) => {
  const {
    departureAirport,
    arrivalAirport,
    departureDate,
    bookingLink,
    price,
    type,
  } = req.body;

  try {
    const newFlight = {
      departureAirport,
      arrivalAirport,
      departureDate,
      bookingLink,
      price: parseFloat(price),
      type,
    };

    // Add new flight in the array of flights
    req.trip.flights.push(newFlight);
    await req.trip.save();

    res.status(201).json({
      success: true,
      message: "Flight details added successfully",
      data: newFlight,
    });
  } catch (error) {
    next(error);
  }
});

// Update flight details
router.put("/:tripId/flights/:type", auth, checkAccess, async (req, res, next) => {
  const { type } = req.params;
  const {
    departureAirport,
    arrivalAirport,
    departureDate,
    bookingLink,
    price,
  } = req.body;

  try {
    // Find flight based on type
    const flight = req.trip.flights.find((flight) => flight.type === type);
    if (!flight) {
      return res.status(404).json({ success: false, message: "Flight not found" });
    }

    // Update flight details
    flight.departureAirport = departureAirport;
    flight.arrivalAirport = arrivalAirport;
    flight.departureDate = departureDate;
    flight.bookingLink = bookingLink;
    flight.price = parseFloat(price);

    await req.trip.save();

    res.status(200).json({
      success: true,
      message: "Flight details updated successfully",
      data: flight,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

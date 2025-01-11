import express from "express";
import auth from "../middleware/auth.js";
import Trip from "../models/Trip.js";
import { calculateDurationInDays } from "../utils/calculateDuration.js";
import { checkAccess } from "../middleware/checkAccess.js";


const router = express.Router();

// Get all trips for a user
router.get("/", auth, async (req, res, next) => {
  try {
    // Fetch trips from the database for the authenticated user
    const trips = await Trip.find({ userId: req.user.id });

    // If no trips are found, throw a 404 error
    if (!trips.length) {
      const error = new Error('Trip not found');
      error.statusCode = 404;
      throw error;
    }

    // Respond with the found trips
    res.status(200).json({ success: true, message: "Trips retrieved successfully", data: trips });
  } catch (error) {
    next(error); // Pass any unexpected errors to the errorHandler middleware
  }
});

// Add a new trip
router.post("/", auth, async (req, res, next) => {
  // Destructure variables from request
  const { tripName, country, destinations } = req.body;

  calculateDurationInDays(destinations);

  // Create and save new trip in database
  try {
    const newTrip = new Trip({
      userId: req.user.id,
      tripName,
      country,
      destinations,
    });

    const trip = await newTrip.save();
    res.status(201).json({ success: true, message: "Trip created successfully", data: trip });
  } catch (error) {
    next(error);
  }
});

// Update an existing trip
router.put("/:tripId", auth, checkAccess, async (req, res, next) => {
  const { tripName, country, destinations } = req.body;

  calculateDurationInDays(destinations);

  try {
    // Update trip information
    const trip = req.trip; // Access the trip from checkTripAccess middleware
    trip.tripName = tripName;
    trip.country = country;
    trip.destinations = destinations;

    await trip.save();
    res.status(200).json({ success: true, message: "Trip updated successfully", data: trip });
  } catch (error) {
    next(error);
  }
});

// Delete a trip
router.delete("/:tripId", auth, checkAccess, async (req, res, next) => {
  try {
    const trip = req.trip;
    await trip.deleteOne();
    res.status(200).json({ success: true, message: "Trip deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;

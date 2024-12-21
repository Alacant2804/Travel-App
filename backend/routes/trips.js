import express from "express";
import auth from "../middleware/auth.js";
import Trip from "../models/Trip.js";

const router = express.Router();

// Get all trips for a user
router.get("/", auth, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id });
    if (!trips.length) {
      console.log("No trips found for user:", req.user.id);
    } else {
      console.log("Trips retrieved for user:", req.user.id, trips);
    }
    res.json(trips);
  } catch (err) {
    console.error("Error fetching trips:", err);
    res.status(500).send("Server Error");
  }
});

// Add a new trip
router.post("/", auth, async (req, res) => {
  const { tripName, country, destinations } = req.body;
  console.log("Received trip data:", req.body);
  console.log("User ID from middleware:", req.user.id);

  destinations.forEach((destination) => {
    const start = new Date(destination.startDate);
    const end = new Date(destination.endDate);
    const durationInMilliseconds = end - start;
    destination.duration = Math.ceil(
      durationInMilliseconds / (1000 * 60 * 60 * 24)
    ); // Convert to days
  });

  try {
    const newTrip = new Trip({
      userId: req.user.id,
      tripName,
      country,
      destinations,
    });

    console.log("Saving trip to database...");
    const trip = await newTrip.save();
    console.log("Trip saved:", trip);
    res.status(201).json(trip); // Respond with the newly created trip including its ID
  } catch (err) {
    console.error("Error saving trip:", err.message, err.stack);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Update an existing trip
router.put("/:id", auth, async (req, res) => {
  const { tripName, country, destinations } = req.body;

  destinations.forEach((destination) => {
    const start = new Date(destination.startDate);
    const end = new Date(destination.endDate);
    const durationInMilliseconds = end - start;
    destination.duration = Math.ceil(
      durationInMilliseconds / (1000 * 60 * 60 * 24)
    ); // Convert to days
  });

  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    if (trip.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    trip.tripName = tripName;
    trip.country = country;
    trip.destinations = destinations;

    await trip.save();
    res.json(trip); // Respond with the updated trip
  } catch (err) {
    console.error("Error updating trip:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Delete a trip
router.delete("/:id", auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    // Check user
    if (trip.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await trip.deleteOne();
    res.json({ msg: "Trip removed" });
  } catch (err) {
    console.error("Error deleting trip:", err);
    res.status(500).send("Server Error");
  }
});

export default router;

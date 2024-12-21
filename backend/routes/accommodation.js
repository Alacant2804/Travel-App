import express from "express";
import auth from "../middleware/auth.js";
import Trip from "../models/Trip.js";

const router = express.Router();

router.get(
  "/:tripId/destinations/:destinationId/accommodation",
  async (req, res) => {
    try {
      const { tripId, destinationId } = req.params;
      const trip = await Trip.findById(tripId);
      if (!trip) return res.status(404).send("Trip not found");

      const destination = trip.destinations.id(destinationId);
      if (!destination) return res.status(404).send("Destination not found");

      const accommodation = destination.accommodation;
      if (!accommodation)
        return res.status(404).send("Accommodation not found");

      res.status(200).send(accommodation);
    } catch (error) {
      console.error("Error fetching accommodation:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post(
  "/:tripId/destinations/:destinationId/accommodation",
  async (req, res) => {
    try {
      const { tripId, destinationId } = req.params;
      const trip = await Trip.findById(tripId);
      if (!trip) return res.status(404).send("Trip not found");

      const destination = trip.destinations.id(destinationId);
      if (!destination) return res.status(404).send("Destination not found");

      destination.accommodation = req.body;
      await trip.save();

      res.status(200).send(destination.accommodation);
    } catch (error) {
      console.error("Error saving accommodation:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Update accommodation
router.put(
  "/:tripId/destinations/:destinationId/accommodation/:accommodationId",
  async (req, res) => {
    try {
      const { tripId, destinationId, accommodationId } = req.params;
      const trip = await Trip.findById(tripId);
      if (!trip) return res.status(404).send("Trip not found");

      const destination = trip.destinations.id(destinationId);
      if (!destination) return res.status(404).send("Destination not found");

      const accommodation = destination.accommodation.id(accommodationId);
      if (!accommodation)
        return res.status(404).send("Accommodation not found");

      Object.assign(accommodation, req.body);

      await trip.save();

      res.status(200).send(accommodation);
    } catch (error) {
      console.error("Error updating accommodation:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

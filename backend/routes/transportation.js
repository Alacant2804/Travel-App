import express from "express";
import auth from "../middleware/auth.js";
import Trip from "../models/Trip.js";

const router = express.Router();

// Get transportation details
router.get("/:tripId/transportation", auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    res.json(trip.transportation);
  } catch (error) {
    console.error("Error fetching transportation:", error);
    res.status(500).send("Server Error");
  }
});

// Add transportation details
router.post("/:tripId/transportation", auth, async (req, res) => {
  const { tripId } = req.params;
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
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    const newTransportation = {
      pickupPlace,
      dropoffPlace,
      pickupDate,
      dropoffDate,
      duration,
      price: parseFloat(price),
      bookingLink,
    };

    trip.transportation = newTransportation;
    await trip.save();

    res.status(201).json(newTransportation);
  } catch (error) {
    console.error("Error saving transportation:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update transportation details
router.put(
  "/:tripId/transportation/:transportationId",
  auth,
  async (req, res) => {
    const { tripId, transportationId } = req.params;
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
      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({ msg: "Trip not found" });
      }

      const transportation = trip.transportation.id(transportationId);
      if (!transportation) {
        return res.status(404).json({ msg: "Transportation not found" });
      }

      transportation.pickupPlace = pickupPlace;
      transportation.dropoffPlace = dropoffPlace;
      transportation.pickupDate = pickupDate;
      transportation.dropoffDate = dropoffDate;
      transportation.duration = duration;
      transportation.price = parseFloat(price);
      transportation.bookingLink = bookingLink;

      await trip.save();

      res.json(transportation);
    } catch (error) {
      console.error("Error updating transportation:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

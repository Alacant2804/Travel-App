import express from "express";
import auth from "../middleware/auth.js";
import Trip from "../models/Trip.js";

const router = express.Router();

router.get("/:tripId", auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }
    res.json(trip);
  } catch (err) {
    console.error("Error fetching trip:", err);
    res.status(500).send("Server Error");
  }
});

// Route for the Trip Detail page
// Add a new destination to a trip
router.post("/:tripId/destinations", auth, async (req, res) => {
  const { tripId } = req.params;
  const { city, startDate, endDate, places, accommodation } = req.body;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // Convert to days

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    const newDestination = {
      city,
      startDate,
      endDate,
      duration,
      places,
      accommodation,
    };

    trip.destinations.push(newDestination);
    await trip.save();

    res.status(201).json(trip); // Respond with the updated trip
  } catch (err) {
    console.error("Error adding destination:", err);
    res.status(500).send("Server Error");
  }
});

// Add a place to a specific destination
router.post(
  "/:tripId/destinations/:destinationId/places",
  auth,
  async (req, res) => {
    const { tripId, destinationId } = req.params;
    const { name, price, coordinates } = req.body;

    // Validate coordinates
    if (
      !coordinates ||
      typeof coordinates.lat !== "number" ||
      typeof coordinates.lon !== "number"
    ) {
      return res.status(400).json({ msg: "Invalid coordinates" });
    }

    try {
      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({ msg: "Trip not found" });
      }

      const destination = trip.destinations.id(destinationId);
      if (!destination) {
        return res.status(404).json({ msg: "Destination not found" });
      }

      destination.places.push({ name, price, coordinates });

      await trip.save();
      res.json({ destinations: trip.destinations });
    } catch (error) {
      console.error("Error adding place:", error);
      res.status(500).json({ msg: "Server Error", error: error.message });
    }
  }
);

// Update an existing destination
router.put("/:tripId/destinations/:destinationId", auth, async (req, res) => {
  const { tripId, destinationId } = req.params;
  const { city, startDate, endDate, places, accommodation } = req.body;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationInMilliseconds = end - start;
  const duration = Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24)); // Convert to days

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    const destination = trip.destinations.id(destinationId);
    if (!destination) {
      return res.status(404).json({ msg: "Destination not found" });
    }

    destination.city = city;
    destination.startDate = startDate;
    destination.endDate = endDate;
    destination.duration = duration;
    destination.places = places;
    destination.accommodation = accommodation;

    await trip.save();
    res.json(trip);
  } catch (err) {
    console.error("Error updating destination:", err);
    res.status(500).send("Server Error");
  }
});

router.delete(
  "/:tripId/destinations/:destinationId",
  auth,
  async (req, res) => {
    const { tripId, destinationId } = req.params;

    try {
      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({ msg: "Trip not found" });
      }

      const destination = trip.destinations.id(destinationId);
      if (!destination) {
        return res.status(404).json({ msg: "Destination not found" });
      }

      destination.remove();
      await trip.save();

      res.json(trip);
    } catch (err) {
      console.error("Error deleting destination:", err);
      res.status(500).send("Server Error");
    }
  }
);

router.put(
  "/:tripId/destinations/:destinationId/places/:placeId",
  auth,
  async (req, res) => {
    const { tripId, destinationId, placeId } = req.params;
    const { name, price, coordinates } = req.body;

    // Validate coordinates
    if (
      !coordinates ||
      typeof coordinates.lat !== "number" ||
      typeof coordinates.lon !== "number"
    ) {
      return res.status(400).json({ msg: "Invalid coordinates" });
    }

    try {
      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({ msg: "Trip not found" });
      }

      const destination = trip.destinations.id(destinationId);
      if (!destination) {
        return res.status(404).json({ msg: "Destination not found" });
      }

      const place = destination.places.id(placeId);
      if (!place) {
        return res.status(404).json({ msg: "Place not found" });
      }

      place.name = name;
      place.price = price;
      place.coordinates = coordinates;

      await trip.save();
      res.json({ destinations: trip.destinations });
    } catch (error) {
      console.error("Error editing place:", error);
      res.status(500).json({ msg: "Server Error", error: error.message });
    }
  }
);

router.delete(
  "/:tripId/destinations/:destinationId/places/:placeId",
  auth,
  async (req, res) => {
    const { tripId, destinationId, placeId } = req.params;

    try {
      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      const destination = trip.destinations.id(destinationId);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }

      const placeIndex = destination.places.findIndex(
        (place) => place._id.toString() === placeId
      );
      if (placeIndex === -1) {
        return res.status(404).json({ message: "Place not found" });
      }

      destination.places.splice(placeIndex, 1);
      await trip.save();

      res.json(trip);
    } catch (error) {
      console.error("Error deleting place:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

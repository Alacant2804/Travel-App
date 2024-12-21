import express from "express";
import auth from "../middleware/auth.js";
import Trip from "../models/Trip.js";

const router = express.Router();

router.get("/:tripId/flights", auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    res.json(trip.flights);
  } catch (error) {
    console.error("Error fetching flights:", error);
    res.status(500).send("Server Error");
  }
});

router.post("/:tripId/flights", auth, async (req, res) => {
  const { tripId } = req.params;
  const {
    departureAirport,
    arrivalAirport,
    departureDate,
    bookingLink,
    price,
    type,
  } = req.body;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    const newFlight = {
      departureAirport,
      arrivalAirport,
      departureDate,
      bookingLink,
      price: parseFloat(price),
      type,
    };

    trip.flights.push(newFlight);
    await trip.save();

    res.status(201).json(newFlight);
  } catch (error) {
    console.error("Error saving flight:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:tripId/flights/:flightId", auth, async (req, res) => {
  const { tripId, flightId } = req.params;
  const {
    departureAirport,
    arrivalAirport,
    departureDate,
    bookingLink,
    price,
  } = req.body;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    const flight = trip.flights.id(flightId);
    if (!flight) {
      return res.status(404).json({ msg: "Flight not found" });
    }

    flight.departureAirport = departureAirport;
    flight.arrivalAirport = arrivalAirport;
    flight.departureDate = departureDate;
    flight.bookingLink = bookingLink;
    flight.price = parseFloat(price);

    await trip.save();

    res.json(flight);
  } catch (error) {
    console.error("Error updating flight:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

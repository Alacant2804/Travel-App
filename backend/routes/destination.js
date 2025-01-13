import express from "express";
import auth from "../middleware/auth.js";
import { checkAccess } from "../middleware/checkAccess.js";
import { calculateDuration } from "../utils/calculateDuration.js";
import validateCoordinates from "../utils/validateCoordinates.js";
import { findTripAndDestination } from "../utils/findTripAndDestination.js";
import { validateDestinationInput } from "../middleware/validateInput.js";

const router = express.Router();

router.get("/:tripId", auth, checkAccess, async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Destination retrieved successfully",
      data: req.trip,
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:tripId",
  auth,
  checkAccess,
  validateDestinationInput,
  async (req, res, next) => {
    const {
      city,
      startDate,
      endDate,
      places = [],
      accommodation = null,
    } = req.body;

    const duration = calculateDuration(startDate, endDate);

    try {
      const newDestination = {
        city,
        startDate,
        endDate,
        duration,
        places,
        accommodation,
      };

      req.trip.destinations.push(newDestination);
      await req.trip.save();

      res.status(201).json({
        success: true,
        message: "Destination created successfully",
        data: newDestination,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:tripId/:destinationId",
  auth,
  checkAccess,
  validateDestinationInput,
  async (req, res, next) => {
    const { destinationId } = req.params;
    const { city, startDate, endDate, places, accommodation } = req.body;

    const duration = calculateDuration(startDate, endDate);

    try {
      const destination = req.trip.destinations.id(destinationId);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }

      destination.city = city;
      destination.startDate = startDate;
      destination.endDate = endDate;
      destination.duration = duration;
      destination.places = places;
      destination.accommodation = accommodation;

      await req.trip.save();
      res.status(201).json({
        success: true,
        message: "Destination updated successfully",
        data: destination,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:tripId/:destinationId",
  auth,
  checkAccess,
  async (req, res) => {
    const { destinationId } = req.params;

    try {
      const destination = req.trip.destinations.id(destinationId);
      if (!destination) {
        return res
          .status(404)
          .json({ success: false, message: "Destination not found" });
      }

      destination.remove();
      await req.trip.save();

      res
        .status(200)
        .json({ success: true, message: "Destination successfully deleted" });
    } catch (error) {
      next(error);
    }
  }
);

// Places to visit route logic in destination component
// Fetch all places to visit
router.get("/:tripId/:destinationId/places", auth, async (req, res, next) => {
  try {
    const { destination } = await findTripAndDestination(
      req.params.tripId,
      req.params.destinationId
    );

    res.status(200).json({
      success: true,
      message: "Places retrieved successfully",
      data: destination.places,
    });
  } catch (error) {
    next(error);
  }
});

// Fetch one place to visit
router.get(
  "/:tripId/:destinationId/places/:placeId",
  auth,
  async (req, res, next) => {
    try {
      const { destination } = await findTripAndDestination(
        req.params.tripId,
        req.params.destinationId
      );

      const place = destination.places.id(req.params.placeId);
      if (!place) {
        return res
          .status(404)
          .json({ success: false, message: "Place not found" });
      }

      res.status(200).json({ success: true, data: place });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/:tripId/:destinationId/places", auth, async (req, res, next) => {
  const { name, price, coordinates } = req.body;

  // Validate coordinates
  if (!validateCoordinates(coordinates)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid coordinates" });
  }

  try {
    const { trip, destination } = await findTripAndDestination(
      req.params.tripId,
      req.params.destinationId
    );

    destination.places.push({ name, price, coordinates });
    await trip.save();

    res.status(201).json({
      success: true,
      message: "Place added successfully",
      data: { name, price, coordinates },
    });
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:tripId/:destinationId/places/:placeId",
  auth,
  async (req, res, next) => {
    const { name, price, coordinates } = req.body;

    // Validate coordinates
    if (!validateCoordinates(coordinates)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid coordinates" });
    }

    try {
      const { trip, destination } = await findTripAndDestination(
        req.params.tripId,
        req.params.destinationId
      );

      const place = destination.places.id(req.params.placeId);
      if (!place) {
        return res
          .status(404)
          .json({ success: false, message: "Place not found" });
      }

      place.name = name;
      place.price = price;
      place.coordinates = coordinates;

      await trip.save();
      res.status(200).json({
        success: true,
        message: "Place updated successfully",
        data: place,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:tripId/:destinationId/places/:placeId",
  auth,
  async (req, res, next) => {
    try {
      const { trip, destination } = await findTripAndDestination(
        req.params.tripId,
        req.params.destinationId
      );

      const place = destination.places.id(req.params.placeId);

      if (!place) {
        return res
          .status(404)
          .json({ success: false, message: "Place not found" });
      }

      place.remove();
      await trip.save();

      res
        .status(200)
        .json({ success: true, message: "Place deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

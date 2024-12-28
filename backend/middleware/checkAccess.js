import Trip from "../models/Trip.js";

export const checkAccess = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.tripId);

    // Check if trip is found
    if (!trip) {
      const error = new Error("Trip not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check if user is authorized
    if (trip.userId.toString() !== req.user.id) {
      const error = new Error("User not authorized");
      error.statusCode = 401;
      return next(error);
    }

    // Attach trip to the request object for further use in the route
    req.trip = trip;
    next();
  } catch (error) {
    next(error); // Pass any unexpected errors to the error handler
  }
};

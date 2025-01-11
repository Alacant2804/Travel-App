import Trip from "../models/Trip.js";

export const findTripAndDestination = async (tripId, destinationId) => {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      throw new Error("Trip not found");
    }
  
    const destination = trip.destinations.id(destinationId);
    if (!destination) {
      throw new Error("Destination not found");
    }
  
    return { trip, destination };
  };
  
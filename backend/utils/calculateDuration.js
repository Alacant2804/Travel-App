export const calculateDurationForDestinations = (destinations) => {
    destinations.forEach((destination) => {
      const start = new Date(destination.startDate);
      const end = new Date(destination.endDate);
      const durationInMilliseconds = end - start;
      destination.duration = Math.ceil(
        durationInMilliseconds / (1000 * 60 * 60 * 24)
      ); // Convert to days
    });
  };
export const calculateDurationInDays = (destinations) => {
    destinations.forEach((destination) => {
      const start = new Date(destination.startDate);
      const end = new Date(destination.endDate);
      const durationInMilliseconds = end - start;
      destination.duration = Math.ceil(
        durationInMilliseconds / (1000 * 60 * 60 * 24)
      ); // Convert to days
    });
  };

// Utility function to calculate the duration in days for a single destination
export const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start) || isNaN(end)) {
    throw new Error("Invalid date format");
  }

  const durationInMilliseconds = end - start;

  // Ensure the duration is non-negative
  if (durationInMilliseconds < 0) {
    throw new Error("End date must be after start date");
  }

  return Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24)); // Convert to days
};

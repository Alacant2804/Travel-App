export const validateAccommodationInput = (req, res, next) => {
  const { address, startDate, endDate, price, bookingLink } = req.body;

  // Validate address
  if (!address) {
    return res
      .status(400)
      .json({ success: false, message: "Address is missing" });
  }

  if (typeof address !== "string" || !isNaN(address.trim())) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid address. Please enter a street name along with a number.",
    });
  }

  // Validate startDate
  const parsedStartDate = Date.parse(startDate);
  const parsedEndDate = Date.parse(endDate);
  if (!startDate) {
    return res
      .status(400)
      .json({ success: false, message: "Start date is missing" });
  }

  if (isNaN(parsedStartDate)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid start date. Please select a valid date from the calendar.",
    });
  }

  // Validate endDate
  if (!endDate) {
    return res
      .status(400)
      .json({ success: false, message: "End date is missing" });
  }

  if (isNaN(parsedEndDate)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid end date. Please select a valid date from the calendar.",
    });
  }

  // Validate duration
  if (parsedEndDate < parsedStartDate) {
    return res.status(400).json({
      success: false,
      message: "End date cannot be earlier than the start date.",
    });
  }

  // Validate price
  if (price == null || isNaN(price) || typeof price !== "number") {
    return res.status(400).json({
      success: false,
      message: "Invalid price. Please enter a valid number.",
    });
  }

  if (price < 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid price. Please enter a positive number.",
    });
  }

  // Validate bookingLink
  if (bookingLink) {
    if (typeof bookingLink !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid booking link. It must be a string.",
      });
    }

    // Regular expression for basic URL validation
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;

    if (!urlPattern.test(bookingLink)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking link. Please enter a valid URL.",
      });
    }
  }

  next();
};

export const validateDestinationInput = (req, res, next) => {
  const { city, startDate, endDate, places = [] } = req.body;

  // Validate city
  if (!city || typeof city !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing city. City must be a string.",
    });
  }

  // Validate startDate
  if (!startDate || isNaN(Date.parse(startDate))) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing startDate. Provide a valid date.",
    });
  }

  // Validate endDate
  if (!endDate || isNaN(Date.parse(endDate))) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing endDate. Provide a valid date.",
    });
  }

  // Check that endDate is after startDate
  if (new Date(startDate) > new Date(endDate)) {
    return res
      .status(400)
      .json({ success: false, message: "endDate must be after startDate." });
  }

  // Validate places
  if (places && !Array.isArray(places)) {
    return res.status(400).json({
      success: false,
      message: "Invalid places. Places must be an array.",
    });
  }

  next();
};

export const validateFlightInput = (req, res, next) => {
  const {
    departureAirport,
    arrivalAirport,
    departureDate,
    bookingLink,
    price,
    type,
  } = req.body;

  // Validate departureAirport
  if (!departureAirport || typeof departureAirport !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing departure airport",
    });
  }

  // Validate arrivalAirport
  if (!arrivalAirport || typeof arrivalAirport !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or missing arrival airport" });
  }

  // Validate departureDate
  if (!departureDate || isNaN(Date.parse(departureDate))) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or missing departure date" });
  }

  // Validate bookingLink
  if (bookingLink && typeof bookingLink !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid booking link" });
  }

  // Validate price
  if (price == null || isNaN(price) || price < 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or missing price" });
  }

  // Validate type
  if (!type) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or missing type" });
  }

  next();
};

export const validateTransportationInput = (req, res, next) => {
  const {
    pickupPlace,
    dropoffPlace,
    pickupDate,
    dropoffDate,
    price,
    bookingLink,
  } = req.body;

  // Validate pickupPlace
  if (!pickupPlace || typeof pickupPlace !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or missing pickup place" });
  }

  // Validate dropoffPlace
  if (!dropoffPlace || typeof dropoffPlace !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or missing dropoff place" });
  }

  // Validate pickupDate
  if (!pickupDate || isNaN(Date.parse(pickupDate))) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or missing pickup date" });
  }

  // Validate dropoffDate
  if (!dropoffDate || isNaN(Date.parse(dropoffDate))) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or missing dropoff date" });
  }

  // Check that dropoffDate is after pickupDate
  if (new Date(pickupDate) > new Date(dropoffDate)) {
    return res.status(400).json({
      success: false,
      message: "Dropoff date must be after pickup date",
    });
  }

  // Validate price
  if (price == null || isNaN(price) || price < 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or missing price" });
  }

  if (bookingLink && typeof bookingLink !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid booking link" });
  }

  next();
};

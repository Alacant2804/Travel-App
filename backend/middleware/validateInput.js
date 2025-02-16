import validator from "validator";

export const validateAccommodationInput = (req, res, next) => {
  const { address, startDate, endDate, price, bookingLink } = req.body;

  // Validate address
  if (!address || validator.isEmpty(address)) {
    return res
      .status(400)
      .json({ success: false, message: "Address is missing" });
  }

  if (typeof address !== "string") {
    return res.status(400).json({
      success: false,
      message:
        "Invalid address. Address must be a string containing letters only.",
    });
  }

  if (!/[a-zA-Z]/.test(address)) {
    return res.status(400).json({
      success: false,
      message: "Invalid address. It must contain at least one letter.",
    });
  }

  /// Validate startDate
  if (!startDate || !validator.isISO8601(startDate)) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a valid start date." });
  }

  // Validate endDate
  if (!endDate || !validator.isISO8601(endDate)) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a valid end date." });
  }

  // Validate duration
  if (new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({
      success: false,
      message: "End date cannot be earlier than the start date.",
    });
  }

  // Validate price
  if (
    price == null ||
    isNaN(price) ||
    price < 0 ||
    !/^\d+(\.\d{1,2})?$/.test(price)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid price. Price must be a valid positive number.",
    });
  }

  // Validate bookingLink
  if (bookingLink && !validator.isURL(bookingLink)) {
    return res.status(400).json({
      success: false,
      message: "Invalid booking link. Please enter a valid URL.",
    });
  }

  next();
};

export const validateDestinationInput = (req, res, next) => {
  const { city, startDate, endDate, places = [] } = req.body;

  // Validate city
  if (!city || validator.isEmpty(city)) {
    return res.status(400).json({
      success: false,
      message: "City is missing",
    });
  }

  if (typeof city !== "string" || /\d/.test(city)) {
    return res.status(400).json({
      success: false,
      message: "City cannot be a number.",
    });
  }

  // Validate startDate
  if (!startDate || !validator.isISO8601(startDate)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid start date.",
    });
  }

  // Validate endDate
  if (!endDate || !validator.isISO8601(endDate)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid end date.",
    });
  }

  // Validate duration
  if (new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({
      success: false,
      message: "End date cannot be earlier than the start date.",
    });
  }

  // Validate places
  if (places && !Array.isArray(places)) {
    return res.status(400).json({
      success: false,
      message: "Invalid places. Places must be an array.",
    });
  }

  if (
    places.some(
      (place) => typeof place !== "string" || validator.isEmpty(place)
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid places. Each place must be a non-empty string.",
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

  // Validate type
  if (!type || (type !== "outbound" && type !== "inbound")) {
    return res.status(400).json({
      success: false,
      message: "Type is required. Please select a valid type.",
    });
  }

  // Validate departureAirport
  if (!departureAirport || validator.isEmpty(departureAirport.trim())) {
    return res.status(400).json({
      success: false,
      message: "Departure airport is required.",
    });
  }

  if (typeof departureAirport !== "string" || /\d/.test(departureAirport)) {
    return res.status(400).json({
      success: false,
      message: "Departure airport cannot be a number.",
    });
  }

  // Validate arrivalAirport
  if (!arrivalAirport || validator.isEmpty(arrivalAirport.trim())) {
    return res.status(400).json({
      success: false,
      message: "Arrival airport is required.",
    });
  }

  if (typeof arrivalAirport !== "string" || /\d/.test(arrivalAirport)) {
    return res.status(400).json({
      success: false,
      message: "Arrival airport cannot be a number.",
    });
  }

  if (departureAirport === arrivalAirport) {
    return res.status(400).json({
      success: false,
      message: "Departure and arrival airports cannot be the same.",
    });
  }

  // Validate departureDate
  if (!departureDate || !validator.isISO8601(departureDate)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid departure date.",
    });
  }

  // Validate price
  if (
    price == null ||
    isNaN(price) ||
    price < 0 ||
    !/^\d+(\.\d{1,2})?$/.test(price)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid price. Price must be a valid positive number.",
    });
  }

  // Validate bookingLink
  if (bookingLink && !validator.isURL(bookingLink)) {
    return res.status(400).json({
      success: false,
      message: "Booking link must be a valid URL.",
    });
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

  // Validate pick up place
  if (!pickupPlace || validator.isEmpty(pickupPlace.trim())) {
    return res.status(400).json({
      success: false,
      message: "Pick up place is required.",
    });
  }

  if (typeof pickupPlace !== "string" || /\d/.test(pickupPlace)) {
    return res.status(400).json({
      success: false,
      message: "Pick up place cannot be a number.",
    });
  }

  // Validate drop off place
  if (!dropoffPlace || validator.isEmpty(dropoffPlace.trim())) {
    return res.status(400).json({
      success: false,
      message: "Drop off place is required.",
    });
  }

  if (typeof dropoffPlace !== "string" || /\d/.test(dropoffPlace)) {
    return res.status(400).json({
      success: false,
      message: "Drop off place cannot be a number.",
    });
  }

  // Validate pick up date
  if (!pickupDate || !validator.isISO8601(pickupDate)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid pick up date.",
    });
  }

  // Validate drop off date
  if (!dropoffDate || !validator.isISO8601(dropoffDate)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid drop off date.",
    });
  }

  // Check that drop off date is after pick up date
  if (new Date(pickupDate) > new Date(dropoffDate)) {
    return res.status(400).json({
      success: false,
      message: "Dropoff date must be after pick up date.",
    });
  }

  // Validate price
  if (
    price == null ||
    isNaN(price) ||
    price < 0 ||
    !/^\d+(\.\d{1,2})?$/.test(price)
  ) {
    return res.status(400).json({
      success: false,
      message: "Price must be a valid positive number.",
    });
  }

  // Validate bookingLink
  if (bookingLink && validator.isURL(bookingLink)) {
    return res.status(400).json({
      success: false,
      message: "Booking link must be a valid URL.",
    });
  }

  next();
};

import validator from "validator";

export const validateTripInput = (req, res, next) => {
  const { tripName, country, destinations } = req.body;

  // Validate trip name
  if (!tripName || validator.isEmpty(tripName.trim())) {
    return res
      .status(400)
      .json({ success: false, message: "Trip name is required" });
  }

  // Validate country
  if (!country || validator.isEmpty(country.trim())) {
    return res
      .status(400)
      .json({ success: false, message: "Country is required" });
  }

  if (typeof country !== "string" || !/[a-zA-Z]/.test(country)) {
    return res.status(400).json({
      success: false,
      message: "Invalid country. Country must contain at least one letter.",
    });
  }

  // Ensure destinations exist and are an array
  if (!Array.isArray(destinations) || destinations.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one destination is required.",
    });
  }

  // Validate each destination inside the array
  for (const destination of destinations) {
    const { city, startDate, endDate } = destination;

    if (!city || validator.isEmpty(city.trim())) {
      return res.status(400).json({
        success: false,
        message: "Each destination must have a city.",
      });
    }

    if (typeof city !== "string" || !/[a-zA-Z]/.test(city)) {
      return res.status(400).json({
        success: false,
        message: "Invalid city. City must contain at least one letter.",
      });
    }

    if (!startDate || !validator.isISO8601(startDate)) {
      return res.status(400).json({
        success: false,
        message: "Each destination must have a valid start date.",
      });
    }

    if (!endDate || !validator.isISO8601(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Each destination must have a valid end date.",
      });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be earlier than the start date.",
      });
    }
  }

  next();
};

export const validateAccommodationInput = (req, res, next) => {
  const { address, startDate, endDate, price, bookingLink } = req.body;

  // Validate address
  if (!address || validator.isEmpty(address.trim())) {
    return res
      .status(400)
      .json({ success: false, message: "Address is required" });
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
      message: "Invalid address. Address must contain at least one letter.",
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
    !/^\d+(\.\d{1,2})?$/.test(price) ||
    typeof price !== "number"
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

export const validateBudgetInput = (req, res, next) => {
  const { amount, category } = req.body;

  // Validate price
  if (
    amount == null ||
    isNaN(amount) ||
    amount < 0 ||
    !/^\d+(\.\d{1,2})?$/.test(amount)
  ) {
    return res.status(400).json({
      success: false,
      message: "Amount must be a valid positive number.",
    });
  }

  // Validate category
  if (!category || validator.isEmpty(category.trim())) {
    return res.status(400).json({
      success: false,
      message: "Category is required",
    });
  }

  if (typeof category !== "string" || /\d/.test(category)) {
    return res.status(400).json({
      success: false,
      message: "Category cannot be a number.",
    });
  }

  const defaultCategories = [
    "Flights",
    "Transportation",
    "Places to Visit",
    "Accommodation",
  ];

  if (req.trip) {
    const categoryLower = category.toLowerCase();

    const categoryExists = req.trip.budget.some((item) => {
      // Exclude the item being edited from the check
      if (req.params.budgetId && item._id.toString() === req.params.budgetId) {
        return false; // Don't count the current item when editing
      }
      return item.category.toLowerCase() === categoryLower;
    });

    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists in the budget.",
      });
    }

    const isDefaultCategory = defaultCategories.some(
      (defaultCategory) => defaultCategory.toLowerCase() === categoryLower
    );

    if (isDefaultCategory) {
      return res.status(400).json({
        success: false,
        message: "You cannot use a default category.",
      });
    }
  }

  next();
};

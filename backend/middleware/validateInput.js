export const validateAccommodationInput = (req, res, next) => {
    const { address, startDate, endDate, price, bookingLink } = req.body;

    // Validate address
    if (!address || typeof address !== "string") {
      return res.status(400).json({ success: false, message: "Invalid or missing address" });
    }
    
    // Validate startDate
    if (!startDate || isNaN(Date.parse(startDate))) {
      return res.status(400).json({ success: false, message: "Invalid or missing startDate" });
    }
  
    // Validate endDate
    if (!endDate || isNaN(Date.parse(endDate))) {
      return res.status(400).json({ success: false, message: "Invalid or missing endDate" });
    }
    
    // Validate price
    if (price == null || isNaN(price) || price < 0) {
      return res.status(400).json({ success: false, message: "Invalid or missing price" });
    }
    
    // Validate bookingLink
    if (!bookingLink || typeof bookingLink !== "string") {
      return res.status(400).json({ success: false, message: "Invalid or missing booking link" });
    }
  
    next();
  };

  export const validateDestinationInput = (req, res, next) => {
    const { city, startDate, endDate, places = [] } = req.body;
  
    // Validate city
    if (!city || typeof city !== "string") {
      return res.status(400).json({ success: false, message: "Invalid or missing city. City must be a string." });
    }
  
    // Validate startDate
    if (!startDate || isNaN(Date.parse(startDate))) {
      return res.status(400).json({ success: false, message: "Invalid or missing startDate. Provide a valid date." });
    }
  
    // Validate endDate
    if (!endDate || isNaN(Date.parse(endDate))) {
      return res.status(400).json({ success: false, message: "Invalid or missing endDate. Provide a valid date." });
    }
  
    // Check that endDate is after startDate
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ success: false, message: "endDate must be after startDate." });
    }
  
    // Validate places
    if (places && !Array.isArray(places)) {
      return res.status(400).json({ success: false, message: "Invalid places. Places must be an array." });
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
      type
    } = req.body;
  
    // Validate departureAirport
    if (!departureAirport || typeof departureAirport !== "string") {
      return res.status(400).json({ success: false, message: "Invalid or missing departure airport" });
    }
  
    // Validate arrivalAirport
    if (!arrivalAirport || typeof arrivalAirport !== "string") {
      return res.status(400).json({ success: false, message: "Invalid or missing arrival airport" });
    }
  
    // Validate departureDate
    if (!departureDate || isNaN(Date.parse(departureDate))) {
      return res.status(400).json({ success: false, message: "Invalid or missing departure date" });
    }
  
    // Validate bookingLink
    if (bookingLink && typeof bookingLink !== "string") {
      return res.status(400).json({ success: false, message: "Invalid booking link" });
    }
  
    // Validate price
    if (price == null || isNaN(price) || price < 0) {
      return res.status(400).json({ success: false, message: "Invalid or missing price" });
    }

    // Validate type
    if (!type) {
      return res.status(400).json({ success: false, message: "Invalid or missing type" });
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
      return res.status(400).json({ success: false, message: "Invalid or missing pickup place" });
    }
  
    // Validate dropoffPlace
    if (!dropoffPlace || typeof dropoffPlace !== "string") {
      return res.status(400).json({ success: false, message: "Invalid or missing dropoff place" });
    }
  
    // Validate pickupDate
    if (!pickupDate || isNaN(Date.parse(pickupDate))) {
      return res.status(400).json({ success: false, message: "Invalid or missing pickup date" });
    }
  
    // Validate dropoffDate
    if (!dropoffDate || isNaN(Date.parse(dropoffDate))) {
      return res.status(400).json({ success: false, message: "Invalid or missing dropoff date" });
    }
  
    // Check that dropoffDate is after pickupDate
    if (new Date(pickupDate) > new Date(dropoffDate)) {
      return res.status(400).json({ success: false, message: "Dropoff date must be after pickup date" });
    }
  
    // Validate price
    if (price == null || isNaN(price) || price < 0) {
      return res.status(400).json({ success: false, message: "Invalid or missing price" });
    }

    if (bookingLink && typeof bookingLink !== "string") {
      return res.status(400).json({ success: false, message: "Invalid booking link" });
    }
  
    next();
  };
  
  
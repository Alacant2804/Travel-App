import express from "express";
import axios from "axios";
import auth from "../middleware/auth.js";
const router = express.Router();

const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

router.get("/:city/:startDate/:endDate", async (req, res) => {
  try {
    const { city, startDate, endDate } = req.params;
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const today = new Date();

    // Calculate days difference
    const daysUntilStart = Math.ceil(
      (startDateObj - today) / (1000 * 60 * 60 * 24)
    );

    // Allow fetching 7 days before and during the trip
    if (daysUntilStart > 7 || today > endDateObj) {
      return res.status(400).json({
        message:
          "Weather data can only be retrieved 7 days before the trip and during the trip period.",
      });
    }

    if (startDateObj > endDateObj) {
      return res
        .status(400)
        .json({ message: "The start date cannot exceed the end date." });
    }
    console.log("API KEY 1: ", OPENWEATHERMAP_API_KEY);

    // Convert city to coordinates using Geocoding API
    const geoCodingResponse = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${OPENWEATHERMAP_API_KEY}`
    );

    console.log("Cords:", geoCodingResponse);

    if (!geoCodingResponse.data || geoCodingResponse.data.length === 0) {
      return res.status(404).json({ message: "Cannot find provided city." });
    }
    const { lat, lon } = geoCodingResponse.data[0];

    console.log("Lat & lon: ", lat, lon);

    console.log("API KEY 2: ", OPENWEATHERMAP_API_KEY);
    // Request to OpenWeatherMap
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${OPENWEATHERMAP_API_KEY}&units=metric`
    );

    console.log("Weather response: ", weatherResponse);

    // Filter the weather to requested dates.
    const filteredWeatherData = weatherResponse.data.daily.filter((day) => {
      const weatherDate = new Date(day.dt * 1000);
      return weatherDate >= startDateObj && weatherDate <= endDateObj;
    });

    console.log("Response data: ", filteredWeatherData);

    // Send back the relevant forecast data
    res.json(filteredWeatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "City not found." });
    }
    res.status(500).json({ message: "Failed to fetch weather data." });
  }
});

export default router;

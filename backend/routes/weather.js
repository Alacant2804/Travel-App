import express from "express";
import axios from "axios";
import auth from "../middleware/auth.js";
const router = express.Router();

const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

router.get("/:city", async (req, res) => {
  try {
    const { city } = req.params;

    // Convert city to coordinates using Geocoding API
    const geoCodingResponse = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${OPENWEATHERMAP_API_KEY}`
    );

    if (!geoCodingResponse.data || geoCodingResponse.data.length === 0) {
      return res.status(404).json({ message: "Cannot find provided city." });
    }
    const { lat, lon } = geoCodingResponse.data[0];

    // Request to OpenWeatherMap
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}`
    );

    // Send back the relevant forecast data
    res.json(weatherResponse.data);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "City not found." });
    }
    res.status(500).json({ message: "Failed to fetch weather data." });
  }
});

export default router;

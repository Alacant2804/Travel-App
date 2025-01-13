import axios from "axios";
import { getToken } from "../util/util";
import { slugify } from "../util/slugify";

const API_URL = import.meta.env.VITE_API_URL;

// Get coordinates for the specified location on the map
const getCoordinates = async (query) => {
  try {
    // Making an API call to fetch data based on the query
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: query, // Search query string
          format: "json", // Response format
          limit: 1, // Limit to one result
        },
      }
    );
    // Check if the response contains data
    if (response.data.length > 0) {
      const { lat, lon } = response.data[0]; // Extract latitude and longitude
      return { lat: parseFloat(lat), lon: parseFloat(lon) }; // Return the coordinates
    } else {
      console.error("No coordinates found for the provided location.");
      return null; // Return null if no coordinates are found
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};

const fetchPlacesCoordinates = async (places, city, tripCountry) => {
  // Check if places exist
  if (!Array.isArray(places) || places.length === 0) {
    console.error("Invalid or empty places array.");
    return [];
  }

  // Fetch places coordinates
  const placeResults = await Promise.all(
    places.map(async (place) => {
      const coordinates = await getCoordinates(
        `${place.name}, ${city}, ${tripCountry}`
      );
      return { ...place, coordinates };
    })
  );

  return placeResults;
};

const fetchAccommodationCoordinates = async (destination, tripCountry) => {
  // Check if accommodation exists
  if (!destination.accommodation) {
    return null;
  }

  // Fetch coordinates for accommodation
  const coordinates = await getCoordinates(
    `${destination.accommodation.address}, ${destination.city}, ${tripCountry}`
  );

  return coordinates; // Return coordinates or null if the fetch fails
};

const fetchTripDetails = async (tripId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/trips/destination/${tripId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Fetching trip details: ", response.data.data);
    return response.data.data; // return trip data
  } catch (error) {
    console.error("Error fetching trip details:", error);
  }
};

const fetchTripBySlug = async (tripSlug) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/trips`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const trip = response.data.data.find(
      (trip) => slugify(trip.tripName) === tripSlug
    );

    return trip;
  } catch (error) {
    console.error("Error fetching trip by slug:", error);
  }
};

export {
  getCoordinates,
  fetchPlacesCoordinates,
  fetchAccommodationCoordinates,
  fetchTripDetails,
  fetchTripBySlug,
};

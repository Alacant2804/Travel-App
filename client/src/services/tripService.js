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

// Fetch transportation details
const fetchTransportationData = async (tripId) => {
  try {
    const token = getToken();
    const response = await axios.get(
      `${API_URL}/trips/transportation/${tripId}/transportation`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data[0];
  } catch (error) {
    console.error("Error fetching transportation data:", error);
  }
};

// Fetch flight details
const fetchFlightData = async (tripId) => {
  try {
    const token = getToken();
    const response = await axios.get(
      `${API_URL}/trips/flights/${tripId}/flights`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching flight data:", error);
    toast.error("Couldn't fetch the flight data. Please try again later.", {
      theme: "colored",
    });
  }
};

// Fetch budget details
const fetchBudgetData = async (tripId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/trips/destination/${tripId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Budget array of objects {category, ammount}
    const trip = response.data.data;

    // Calculate flight total
    const flightsTotal = trip.flights.reduce(
      (sum, flight) => sum + flight.price,
      0
    );
    // Calculate transportation total
    const transportationTotal = trip.transportation.reduce(
      (sum, transport) => sum + transport.price,
      0
    );
    // Calculate places to visit total
    const placesTotal = trip.destinations.reduce((sum, destination) => {
      return (
        sum +
        destination.places.reduce(
          (placeSum, place) => placeSum + place.price,
          0
        )
      );
    }, 0);
    // Calculate accommodation total
    let accommodationTotal = trip.destinations.reduce((sum, destination) => {
      if (destination.accommodation[0]) {
        return sum + destination.accommodation[0]?.price;
      } else {
        return sum + 0;
      }
    }, 0);

    // Default budget items
    const defaultItems = [
      {
        category: "Flights",
        amount: flightsTotal,
        _id: "default-flights",
      },
      {
        category: "Transportation",
        amount: transportationTotal,
        _id: "default-transportation",
      },
      {
        category: "Places to Visit",
        amount: placesTotal,
        _id: "default-places",
      },
      {
        category: "Accommodation",
        amount: accommodationTotal,
        _id: "default-accommodation",
      },
    ];

    // Map additional items to float amounts
    const additionalItems =
      trip.budget?.map((item) => ({
        ...item,
        amount: parseFloat(item.amount),
      })) || [];

    // Combine default items and additional items
    return [...defaultItems, ...additionalItems];
  } catch (error) {
    console.error("Error fetching budget data:", error);
    return [];
  }
};

export {
  getCoordinates,
  fetchPlacesCoordinates,
  fetchAccommodationCoordinates,
  fetchTripDetails,
  fetchTripBySlug,
  fetchTransportationData,
  fetchFlightData,
  fetchBudgetData,
};

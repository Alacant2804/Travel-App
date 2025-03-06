import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import AccommodationModal from "./AccommodationModal";
import { getToken, calculateDuration } from "../../utils/util";
import { getCoordinates, fetchWeatherData } from "../../services/tripService";
import errorHandler from "../../utils/errorHandler";
import accommodationIcon from "../../assets/accommodation-icon.png";
import deleteIcon from "../../assets/delete-icon.png";
import editIcon from "../../assets/edit-icon.png";
import Xicon from "../../assets/x-icon.png";
import sunnyIcon from "../../assets/sunny-icon.png";
import cloudyIcon from "../../assets/cloudy-icon.png";
import rainyIcon from "../../assets/rainy-icon.png";
import snowyIcon from "../../assets/snowy-icon.png";
import thunderstormIcon from "../../assets/thunderstorm-icon.png";
import weatherIcon from "../../assets/weather-icon.png";
import "./Destination.css";
import WeatherModal from "./WeatherModal";

const API_URL = import.meta.env.VITE_API_URL;

export default function Destination({
  tripId,
  destination = {},
  destinationIndex,
  country,
  saveDestination,
  onDeleteDestination,
}) {
  const [city, setCity] = useState(destination.city || "New Destination");
  const [startDate, setStartDate] = useState(
    destination.startDate ? destination.startDate.split("T")[0] : ""
  );
  const [endDate, setEndDate] = useState(
    destination.endDate ? destination.endDate.split("T")[0] : ""
  );
  const [places, setPlaces] = useState(destination.places || []);
  const [displayedPlaces, setDisplayedPlaces] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [duration, setDuration] = useState(
    calculateDuration(startDate, endDate)
  );
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editPlaceValue, setEditPlaceValue] = useState({ name: "", price: 0 });
  const [showAccommodationModal, setShowAccommodationModal] = useState(false);
  const [accommodation, setAccommodation] = useState(
    destination.accommodation || null
  );
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState({});
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [weatherIconSource, setWeatherIconSource] = useState("");

  useEffect(() => {
    setDuration(calculateDuration(startDate, endDate));
  }, [startDate, endDate]);

  useEffect(() => {
    if (destination && destination.places) {
      const initialDisplayCount = Math.min(5, destination.places.length);
      const nextDisplayedPlaces = places.slice(0, initialDisplayCount);
      setDisplayedPlaces(nextDisplayedPlaces);
      setShowMore(destination.places.length > initialDisplayCount);
    } else {
      setDisplayedPlaces([]);
      setShowMore(false);
    }
  }, [destination.places]);

  useEffect(() => {
    if (!destination?.city) return;
    let isMounted = true; // Track if component is still mounted

    const fetchData = async () => {
      try {
        const data = await fetchWeatherData(destination.city);
        if (isMounted) setWeatherData(data); // Update state if component is mounted
      } catch (error) {
        if (isMounted) console.error("Weather fetch failed:", error);
      }
    };

    fetchData();

    if (
      weatherData &&
      weatherData.weather &&
      weatherData.weather[0] &&
      weatherData.weather[0].main
    ) {
      const icons = {
        Clear: sunnyIcon,
        Clouds: cloudyIcon,
        Drizzle: rainyIcon,
        Rain: rainyIcon,
        Snow: snowyIcon,
        Thunderstorm: thunderstormIcon,
        Default: weatherIcon,
      };

      const weatherCondition = weatherData.weather[0].main;

      if (icons.hasOwnProperty(weatherCondition)) {
        setWeatherIconSource(icons[weatherCondition]);
      } else {
        setWeatherIconSource(icons.Default);
      }
    }

    return () => {
      isMounted = false; // Prevent updates after unmount
    };
  }, [destination, weatherData]);

  // Add place to the destination component
  const handleAddPlace = async (event) => {
    event.preventDefault();
    const placeInput = event.target.elements.placeInput.value.trim();
    const priceInput = parseFloat(event.target.elements.priceInput.value);

    // Validate place input
    if (typeof placeInput !== "string" || !placeInput.trim()) {
      toast.error("Place name should be a valid string", { theme: "colored" });
      return;
    }

    // Validate price input
    if (isNaN(priceInput) || priceInput < 0) {
      toast.error("Invalid price. Price must be a valid positive number.", {
        theme: "colored",
      });
      return;
    }

    // Get coordinates for provided place
    const address = `${placeInput}, ${destination.city}, ${country}`;
    const coordinates = await getCoordinates(address);

    // Validate coordinates
    if (!coordinates) {
      toast.error(
        "Failed to fetch coordinates for the address you provided. Please check it and try again.",
        { theme: "colored" }
      );
      return false;
    }

    // Create object with place data and coordinates
    const newPlace = {
      name: placeInput.trim(),
      price: priceInput,
      coordinates,
    };

    // Send places to the server
    try {
      const token = getToken();
      const response = await axios.post(
        `${API_URL}/trips/destination/${tripId}/${destination._id}/places`,
        newPlace,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const createdPlace = response.data.data;
      const updatedPlaces = [...destination.places, createdPlace];

      setPlaces(updatedPlaces);

      // Notify parent of the updated destination
      saveDestination(
        { ...destination, places: updatedPlaces },
        destinationIndex
      );
      event.target.reset();
      toast.success("Place added successfully!", { theme: "colored" });
    } catch (error) {
      errorHandler(error, "Couldn't add place. Please try again later.");
      event.target.reset();
    }
  };

  // Save edited place
  const handleSaveEditPlace = async (placeIndex) => {
    const updatedPlace = {
      ...editPlaceValue, // The updated values from the edit form
    };

    if (!updatedPlace.name) {
      toast.error("Place name is required", { theme: "colored" });
      return;
    }

    if (!updatedPlace.price) {
      toast.error("Place price is required", { theme: "colored" });
      return;
    }

    // Get coordinates
    const coordinates = await getCoordinates(
      `${updatedPlace.name}, ${destination.city}, ${country}`
    );

    // Validate coordinates
    if (
      !coordinates ||
      typeof coordinates.lat !== "number" ||
      typeof coordinates.lon !== "number"
    ) {
      console.error("Invalid coordinates");
      return;
    }

    // Updated place object with coordinates
    updatedPlace.coordinates = coordinates;

    // Send updated place to the server
    try {
      const token = getToken();
      const response = await axios.put(
        `${API_URL}/trips/destination/${tripId}/${destination._id}/places/${places[placeIndex]._id}`,
        updatedPlace,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newPlace = response.data.data;

      const updatedPlaces = places.map((place, index) =>
        index === placeIndex ? { ...place, ...newPlace } : place
      );

      setPlaces(updatedPlaces); // Update the places state

      // Notify parent of the updated destination with the updated places array
      saveDestination(
        { ...destination, places: updatedPlaces },
        destinationIndex
      );

      setEditingIndex(-1); // Exit edit mode
      setEditPlaceValue({ name: "", price: 0 }); // Clear the inputs
      toast.success("Place updated successfully!", { theme: "colored" });
    } catch (error) {
      errorHandler(error, "Couldn't update place. Please try again later.");
    }
  };

  // Editing mode
  const handleEditPlace = (placeIndex) => {
    setEditingIndex(placeIndex); // Sets the specific place as the one being edited
    setEditPlaceValue(places[placeIndex]); // Pre-fills the edit form with the data of the selected place
  };

  // Delete place from destination
  const handleDeletePlace = async (placeIndex) => {
    const placeId = destination.places[placeIndex]._id;

    // Check if place or destination exists
    if (!placeId || !destination._id) {
      console.error("Invalid placeId or destinationId");
      return;
    }

    // Send delete request
    try {
      const token = getToken();
      await axios.delete(
        `${API_URL}/trips/destination/${tripId}/${destination._id}/places/${placeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      const updatedPlaces = places.filter((_, idx) => idx !== placeIndex);
      setPlaces(updatedPlaces);

      // Notify parent of the updated destination
      saveDestination({ ...destination, places: updatedPlaces });
      toast.success("Place deleted successfully!", { theme: "colored" });
    } catch (error) {
      errorHandler(error, "Couldn't delete place. Please try again later.");
    }
  };

  const handleSaveAccommodation = async (accommodationData) => {
    setAccommodation(accommodationData);
    await saveDestination({
      city,
      startDate,
      endDate,
      places,
      duration,
      accommodation: accommodationData,
    });
  };

  const handleOpenModal = () => {
    setShowAccommodationModal(true);
  };

  const handleCloseModal = () => {
    setShowAccommodationModal(false);
  };

  // Show more places
  const handleShowMore = () => {
    const increment = 5;
    let nextStartIndex = displayedPlaces.length;
    const nextEndIndex = nextStartIndex + increment;

    const nextItems = places.slice(nextStartIndex, nextEndIndex);
    setDisplayedPlaces((prevDisplayedPlaces) => [
      ...prevDisplayedPlaces,
      ...nextItems,
    ]);
    setShowMore(places.length > nextEndIndex);
  };

  const totalPlaces = places.length;
  const totalPrice = places.reduce(
    (sum, place) => sum + (parseFloat(place.price) || 0),
    0
  );

  const handleOpenWeatherModal = async () => {
    // If data already exists and matches the destination, don't fetch
    if (weatherData && weatherData.name === destination.city) {
      setShowWeatherModal(true);
      return;
    }

    setLoading(true);

    try {
      const data = await fetchWeatherData(destination.city);
      setWeatherData(data);
      setShowWeatherModal(true);
      setWeatherError(null);
    } catch (error) {
      setWeatherError(
        error.response?.data?.message || "Couldn't fetch weather data."
      );
      setShowWeatherModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseWeatherModal = () => {
    setShowWeatherModal(false);
    setWeatherError(null);
  };

  return (
    <div className="trip-detail-container">
      <div className="trip-info">
        <div className="destination-header">
          <input
            type="text"
            className="destination-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onBlur={() =>
              saveDestination({
                city,
                startDate,
                endDate,
                places,
                duration,
                accommodation,
              })
            }
          />
          {destinationIndex > 0 && (
            <button
              className="delete-destination-button"
              onClick={() => onDeleteDestination(destinationIndex)}
            >
              <img src={Xicon} alt="delete destination" className="x-icon" />
            </button>
          )}
        </div>
        <div className="breaker"></div>
        <div className="date-info">
          <p>
            <strong>Start Date:</strong>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onBlur={() =>
                saveDestination({
                  city,
                  startDate,
                  endDate,
                  places,
                  duration,
                  accommodation,
                })
              }
            />
          </p>
          <p>
            <strong>End Date:</strong>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onBlur={() =>
                saveDestination({
                  city,
                  startDate,
                  endDate,
                  places,
                  duration,
                  accommodation,
                })
              }
            />
          </p>
          <p>
            <strong>Duration:</strong>{" "}
            {duration === 1 ? duration + " day" : duration + " days"}
          </p>
        </div>
      </div>
      <ul className="places-to-visit">
        {displayedPlaces.map((place, index) => (
          <li key={index}>
            {editingIndex === index ? (
              <div className="edit-mode">
                <input
                  type="text"
                  value={editPlaceValue.name}
                  onChange={(e) =>
                    setEditPlaceValue({
                      ...editPlaceValue,
                      name: e.target.value,
                    })
                  }
                  className="place-input"
                />
                <input
                  type="number"
                  value={editPlaceValue.price}
                  onChange={(e) =>
                    setEditPlaceValue({
                      ...editPlaceValue,
                      price: parseFloat(e.target.value),
                    })
                  }
                  step="0.01"
                  min="0"
                  className="place-input"
                />
                <button
                  onClick={() => handleSaveEditPlace(index)}
                  className="add-place-button"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingIndex(-1)}
                  className="add-place-button"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="places-list">
                {place.name} - ${parseFloat(place.price).toFixed(2)}
                <div className="action-buttons">
                  <button
                    className="button-icon"
                    onClick={() => handleEditPlace(index)}
                  >
                    <img src={editIcon} alt="edit" className="edit-icon" />
                  </button>
                  <button
                    className="button-icon"
                    onClick={() => handleDeletePlace(index)}
                  >
                    {loading ? (
                      <div>Loading accommodation...</div>
                    ) : (
                      <img
                        src={deleteIcon}
                        alt="delete"
                        className="delete-icon"
                      />
                    )}
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
        {showMore && (
          <button className="show-more-button" onClick={handleShowMore}>
            Show More
          </button>
        )}
      </ul>
      <form onSubmit={handleAddPlace} className="place-add-form">
        <div className="place-input-fields">
          <input
            name="placeInput"
            type="text"
            placeholder="Add a place to visit"
            className="place-input"
            required
          />
          <input
            name="priceInput"
            type="number"
            placeholder="Price"
            step="0.01"
            min="0"
            className="place-input"
            required
          />
        </div>
        <button type="submit" className="add-place-button">
          Add Place
        </button>
      </form>
      <div className="destination-details">
        <div className="totals">
          <p className="total-places">
            <strong>Total Places to Visit:</strong> {totalPlaces}
          </p>
          <p className="total-price">
            <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
          </p>
        </div>
        <div className="buttons">
          <button
            className="accommodation-button"
            data-title="Add Accommodation"
            onClick={handleOpenModal}
          >
            <img
              src={accommodationIcon}
              alt="accommodation"
              className="accommodation-icon"
            />
          </button>
          <button
            className="weather-button"
            data-title="Check Weather"
            onClick={handleOpenWeatherModal}
          >
            <img
              src={weatherIconSource}
              alt="weather"
              className="weather-icon"
            />
          </button>
        </div>
        {showAccommodationModal && (
          <AccommodationModal
            tripId={tripId}
            destinationId={destination._id}
            accommodation={accommodation}
            onSave={handleSaveAccommodation}
            onClose={handleCloseModal}
            setLoading={setLoading}
          />
        )}
        {showWeatherModal && (
          <WeatherModal
            weatherData={weatherData}
            onClose={handleCloseWeatherModal}
            weatherError={weatherError}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}

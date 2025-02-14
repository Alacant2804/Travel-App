import { useState, useEffect } from "react";
import { calculateDuration } from "../../util/util";
import AccommodationModal from "./AccommodationModal";
import accommodationIcon from "../../assets/accommodation-icon.png";
import deleteIcon from "../../assets/delete-icon.png";
import editIcon from "../../assets/edit-icon.png";
import Xicon from "../../assets/x-icon.png";
import "./Destination.css";
import { toast } from "react-toastify";
import axios from "axios";
import { getToken } from "../../util/util";
import { getCoordinates } from "../../services/tripService";
import Loading from "../../styles/loader/Loading";

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

  useEffect(() => {
    setDuration(calculateDuration(startDate, endDate));
  }, [startDate, endDate]);

  // Add place to the destination component
  const handleAddPlace = async (event) => {
    event.preventDefault();
    const placeInput = event.target.elements.placeInput.value.trim();
    const priceInput = parseFloat(event.target.elements.priceInput.value);

    // Validate place input
    if (typeof placeInput !== "string" || !placeInput.trim()) {
      toast.error("Place name is incorrect", { theme: "colored" });
      return;
    }

    // Validate price input
    if (isNaN(priceInput) || priceInput < 0) {
      console.error("Invalid place price:", priceInput);
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
      console.error("Error adding place:", error);
      event.target.reset();
      toast.error("Couldn't add place. Please try again later.", {
        theme: "colored",
      });
    }
  };

  // Save edited place
  const handleSaveEditPlace = async (placeIndex) => {
    const updatedPlace = {
      ...editPlaceValue, // The updated values from the edit form
    };

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
      console.error("Error editing place:", error);
      toast.error("Couldn't update place. Please try again later.", {
        theme: "colored",
      });
    }
  };

  // Editing mode
  const handleEditPlace = (placeIndex) => {
    setEditingIndex(placeIndex); // Sets the specific place as the one being edited
    setEditPlaceValue(places[placeIndex]); // Pre-fills the edit form with the data of the selected place
  };

  // Delete place from destination
  const handleDeletePlace = async (placeIndex) => {
    console.log(placeIndex);
    console.log(destination.places[placeIndex]);
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
      console.error("Error deleting place:", error);
      toast.error("Couldn't delete place. Please try again later.", {
        theme: "colored",
      });
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

  const totalPlaces = places.length;
  const totalPrice = places.reduce(
    (sum, place) => sum + (parseFloat(place.price) || 0),
    0
  );

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
        {destination.places.map((place, index) => (
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
      </div>
    </div>
  );
}

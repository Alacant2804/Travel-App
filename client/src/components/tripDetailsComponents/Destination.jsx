import { useState, useEffect } from "react";
import { calculateDuration } from "../../util/util";
import AccommodationModal from "./AccommodationModal";
import accommodationIcon from "../../assets/accommodation-icon.png";
import deleteIcon from "../../assets/delete-icon.png";
import editIcon from "../../assets/edit-icon.png";
import Xicon from "../../assets/x-icon.png";
import "./Destination.css";
import { toast } from "react-toastify";

export default function Destination({
  tripId,
  destination = {},
  destinationIndex,
  saveDestination,
  onAddPlace,
  onEditPlace,
  onDeletePlace,
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

  useEffect(() => {
    setDuration(calculateDuration(startDate, endDate));
  }, [startDate, endDate]);

  // Add place to destination
  const handleAddPlace = async (event) => {
    event.preventDefault();
    const placeInput = event.target.elements.placeInput.value.trim();
    const priceInput = event.target.elements.priceInput.value.trim();

    // Validate place input
    if (typeof placeInput !== "string" || !placeInput.trim()) {
      toast.error("Place name is incorrect", { theme: "colored" });
      return;
    }

    // Validate price input
    if (isNaN(parseFloat(priceInput)) || !priceInput.trim()) {
      console.error("Invalid place price:", priceInput);
      return;
    }

    // Add place values to the component
    await onAddPlace(destinationIndex, placeInput, priceInput);
    event.target.reset();
  };

  // Save updated place
  const handleSaveEditPlace = async (placeIndex) => {
    try {
      await onEditPlace(destinationIndex, placeIndex, editPlaceValue);

      setEditingIndex(-1); // Exit edit mode
      setEditPlaceValue({ name: "", price: 0 }); // Clear the inputs
    } catch (error) {
      console.error("Error saving edited place:", error);
    }
  };

  //
  const handleEditPlace = (placeIndex) => {
    setEditingIndex(placeIndex);
    setEditPlaceValue(places[placeIndex]);
  };

  const handleDeletePlace = async (destinationIndex) => {
    await onDeletePlace(destinationIndex);
    const updatedPlaces = places.filter((_, idx) => idx !== destinationIndex);
    setPlaces(updatedPlaces);
    saveDestination({
      city,
      startDate,
      endDate,
      places: updatedPlaces,
      duration,
      accommodation,
    });
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
        {places.map((place, index) => (
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
                    onClick={() => handleDeletePlace(destinationIndex)}
                  >
                    <img
                      src={deleteIcon}
                      alt="delete"
                      className="delete-icon"
                    />
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
          />
        )}
      </div>
    </div>
  );
}

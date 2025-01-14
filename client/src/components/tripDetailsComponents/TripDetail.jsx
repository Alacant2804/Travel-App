import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Destination from "./Destination";
import FlightModal from "./FlightModal";
import Transportation from "./Transportation";
import MapComponent from "./MapComponent";
import BudgetModal from "./BudgetModal";
import Loading from "../../styles/loader/Loading";
import {
  getCoordinates,
  fetchPlacesCoordinates,
  fetchTripDetails,
  fetchTripBySlug,
} from "../../services/tripService";
import { calculateDuration, getToken } from "../../util/util";
import axios from "axios";
import Title from "../common/Title";
import "./TripDetail.css";
import budgetIcon from "../../assets/budget.png";
import carIcon from "../../assets/car.png";
import planeIcon from "../../assets/plane.png";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export default function TripDetail() {
  const { tripSlug } = useParams();
  const location = useLocation();
  const [tripId, setTripId] = useState(location.state?.tripId || "");
  const [tripName, setTripName] = useState(location.state?.tripName || "");
  const [trip, setTrip] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [currentFlight, setCurrentFlight] = useState(null);
  const [showTransportationModal, setShowTransportationModal] = useState(false);
  const [currentTransportation, setCurrentTransportation] = useState(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  // Fetching specified trip via ID or slug
  useEffect(() => {
    setLoading(true);
    if (!tripId) {
      fetchTripBySlug(tripSlug)
        .then((slugTrip) => {
          if (slugTrip) {
            setTripId(slugTrip._id);
            setTripName(slugTrip.tripName);
            setTrip(slugTrip);
            setDestinations(slugTrip.destinations);
            setLoading(false);
          } else {
            toast.error("Trip not found.", { theme: "colored" });
            setLoading(false);
          }
        })
        .catch(() => {
          toast.error(
            "An error occurred while fetching trip details. Please try again later.",
            { theme: "colored" }
          );
          setLoading(false);
        });
    } else {
      fetchTripDetails(tripId)
        .then((tripData) => {
          setTrip(tripData);
          setDestinations(tripData.destinations || []);
          setLoading(false);
        })
        .catch(() => {
          toast.error(
            "An error occurred while fetching trip details. Please try again later.",
            { theme: "colored" }
          );
        });
      setLoading(false);
    }
  }, [tripId, tripSlug]);

  // Add new destination in the trip
  const handleAddDestination = async () => {
    const startDate = new Date().toISOString().slice(0, 10);
    const endDate = new Date().toISOString().slice(0, 10);
    const duration = calculateDuration(startDate, endDate);

    const newDestination = {
      city: "New Destination",
      startDate,
      endDate,
      duration,
      places: [],
    };

    try {
      const token = getToken();
      const response = await axios.post(
        `${API_URL}/trips/destination/${tripId}`,
        newDestination,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDestinations((prevDestinations) => [
        ...prevDestinations,
        response.data.data,
      ]);
    } catch (error) {
      console.error("Error adding destination:", error);
      toast.error("Couldn't create new destination, please try again later", {
        theme: "colored",
      });
    }
  };

  // Save new destination information
  const handleSaveDestination = useCallback(
    async (updatedData, index) => {
      const destinationId = destinations[index]?._id; // Check if destinationId exists

      // Create updated destination object which contains new data
      // ...updatedData overwrites the same properties from old destination
      const updatedDestination = {
        ...destinations[index],
        ...updatedData, // Overwrites current destination
        duration: calculateDuration(updatedData.startDate, updatedData.endDate),
      };

      try {
        const token = getToken();
        let response;
        let savedDestination;
        if (destinationId) {
          // Update existing destination
          response = await axios.put(
            `${API_URL}/trips/destination/${tripId}/${destinationId}`,
            updatedDestination,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Return updated destination object and update destination array
          savedDestination = response.data.data;
          setDestinations((prevDestinations) =>
            prevDestinations.map((destination) =>
              destination._id === updatedDestination._id
                ? savedDestination
                : destination
            )
          );
        } else {
          // Create new destination
          response = await axios.post(
            `${API_URL}/trips/destination/${tripId}`,
            updatedDestination,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Return created destination object and add to destination array
          savedDestination = response.data.data;
          setDestinations((prevDestinations) => [
            ...prevDestinations,
            savedDestination,
          ]);
        }
      } catch (error) {
        console.error("Error saving destination:", error);
        toast.error("Couldn't save new destination, please try again later", {
          theme: "colored",
        });
      }
    },
    [destinations, tripId]
  );

  // Add place to visit to destination
  const handleAddPlace = async (destinationIndex, placeName, placePrice) => {
    // Get destination and validate
    const destination = destinations[destinationIndex];
    if (!destination || !destination._id) {
      toast.error("Invalid destination selected.", { theme: "colored" });
      return;
    }

    // Get coordinates for provided place
    const address = `${placeName}, ${destination.city}, ${trip.country}`;
    const coordinates = await getCoordinates(address);

    // Validate coordinates
    if (!coordinates) {
      toast.error(
        "We couldn't fetch the coordinates for the address you provided. Please check it and try again.",
        { theme: "colored" }
      );
      return;
    }

    // Create object with place data and coordinates
    const newPlace = {
      name: placeName.trim(),
      price: placePrice,
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
      // Add new place to the places array in destination
      setDestinations((prevDestinations) =>
        prevDestinations.map((destination, index) =>
          index === destinationIndex
            ? { ...destination, places: [...destination.places, createdPlace] }
            : destination
        )
      );
      toast.success("Place added successfully!", { theme: "colored" });
    } catch (error) {
      console.error("Error adding place:", error);
      toast.error("Couldn't add place. Please try again later.", {
        theme: "colored",
      });
    }
  };

  // Edit place to visit in the destination
  const handleEditPlace = async (
    destinationIndex,
    placeIndex,
    updatedPlace
  ) => {
    const destination = destinations[destinationIndex];
    const place = destinations[destinationIndex].places[placeIndex];

    // Get coordinates
    const coordinates = await getCoordinates(
      `${updatedPlace.name}, ${destination.city}, ${trip.country}`
    );

    // Validate coordinates
    if (
      !coordinates ||
      typeof coordinates.lat !== "number" ||
      typeof coordinates.lon !== "number"
    ) {
      console.error("Invalid coordinates:", coordinates);
      return;
    }

    // Updated place object
    updatedPlace = { ...updatedPlace, coordinates };

    // Send updated place to the server
    try {
      const token = getToken();
      const response = await axios.put(
        `${API_URL}/trips/destination/${tripId}/${destination._id}/places/${place._id}`,
        updatedPlace,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newPlace = response.data.data;

      // Update the destinations state with the modified place in the correct destination
      setDestinations((prevDestinations) => {
        // Create a copy of the previous destinations
        const updatedDestinations = [...prevDestinations];
        // Update destination with new place
        updatedDestinations[destinationIndex] = {
          ...destination, // Copy the existing destination
          places: destination.places.map((place, index) =>
            index === placeIndex ? { ...place, ...newPlace } : place
          ), // Update the specified place in the places array
        };
        return updatedDestinations; // Return the updated array
      });
      toast.success("Place updated successfully!", { theme: "colored" });
    } catch (error) {
      console.error("Error editing place:", error);
      toast.error("Couldn't update place. Please try again later.", {
        theme: "colored",
      });
    }
  };

  // Delete place from destination
  const handleDeletePlace = async (destinationIndex, placeIndex) => {
    const placeId = destinations[destinationIndex].places[placeIndex]._id;
    const destinationId = destinations[destinationIndex]._id;

    // Check if place or destination exists
    if (!placeId || !destinationId) {
      console.error("Invalid placeId or destinationId");
      return;
    }

    // Send delete request
    try {
      const token = getToken();
      await axios.delete(
        `${API_URL}/trips/destination/${tripId}/${destinationId}/places/${placeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Delete place from frontend
      setDestinations((prevDestinations) => {
        return prevDestinations.map((dest, idx) =>
          idx === destinationIndex
            ? {
                ...dest,
                places: dest.places.filter((_, pIdx) => pIdx !== placeIndex),
              }
            : dest
        );
      });
      toast.success("Place deleted successfully!", { theme: "colored" });
    } catch (error) {
      console.error("Error deleting place:", error);
      toast.error("Couldn't delete place. Please try again later.", {
        theme: "colored",
      });
    }
  };

  // Delete destination
  const handleDeleteDestination = async (destinationIndex) => {
    if (
      destinationIndex < 0 ||
      destinationIndex >= destinations.length ||
      !destinations[destinationIndex]
    ) {
      console.error("Invalid destination index");
      return;
    }

    const destinationId = destinations[destinationIndex]._id;

    try {
      const token = getToken();
      await axios.delete(
        `${API_URL}/trips/destination/${tripId}/${destinationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDestinations((prevDestinations) =>
        prevDestinations.filter(
          (destination) => destination._id !== destinationId
        )
      );
      toast.success("Destination deleted successfully!", { theme: "colored" });
    } catch (error) {
      console.error("Error deleting destination:", error);
      toast.error("Couldn't delete destination. Please try again later.", {
        theme: "colored",
      });
    }
  };

  const handleOpenFlightModal = (flight = null) => {
    setCurrentFlight(flight);
    setShowFlightModal(true);
  };

  const handleOpenTransportationModal = (transportationData = null) => {
    setCurrentTransportation(transportationData);
    setShowTransportationModal(true);
  };

  const handleOpenBudgetModal = () => {
    setShowBudgetModal(true);
  };

  const handleCloseBudgetModal = () => {
    setShowBudgetModal(false);
  };

  const handleSaveBudget = async () => {
    fetchTripDetails();
  };

  const places = useMemo(() => {
    return destinations.reduce((acc, destination) => {
      if (destination.places) {
        acc.push(...destination.places);
      }
      return acc;
    }, []);
  }, [destinations]);

  if (loading) {
    return <Loading />;
  }

  if (!trip) {
    return <p>Trip not found!</p>;
  }

  return (
    <div className="trip-detail-page">
      <Title title={`${tripName} | Travel App`} />
      <div className="button-section">
        <Link to="/trips">
          <button className="back-button">Go Back</button>
        </Link>
        <div className="trip-icons">
          <button className="button-icon" onClick={handleOpenBudgetModal}>
            <img src={budgetIcon} alt="Budget" className="budget-icon" />
          </button>
          <button
            className="button-icon"
            onClick={handleOpenTransportationModal}
          >
            <img src={carIcon} alt="Car" className="icon" />
          </button>
          <button className="button-icon" onClick={handleOpenFlightModal}>
            <img src={planeIcon} alt="Plane" className="icon" />
          </button>
        </div>
      </div>
      <h1 className="trip-title">{trip.tripName}</h1>
      <div className="trip-info-row">
        <p>
          <strong>Country:</strong> {trip.country}
        </p>
        <p>
          <strong>Start Date:</strong>
          {trip.destinations[0].startDate.split("T")[0]}
        </p>
        <p>
          <strong>End Date:</strong>
          {trip.destinations[0].endDate.split("T")[0]}
        </p>
        <p>
          <strong>Duration:</strong> {trip.destinations[0].duration} days
        </p>
      </div>
      <div className="destinations">
        {destinations.map((destination, index) => (
          <Destination
            key={index}
            destination={destination}
            destinationIndex={index}
            tripId={tripId}
            saveDestination={(updatedData) =>
              handleSaveDestination(updatedData, index)
            }
            onAddPlace={(placeName, placePrice) =>
              handleAddPlace(index, placeName, placePrice)
            }
            onEditPlace={(placeIndex, placeName, placePrice) =>
              handleEditPlace(index, placeIndex, placeName, placePrice)
            }
            onDeletePlace={(placeIndex) => handleDeletePlace(index, placeIndex)}
            onDeleteDestination={() => handleDeleteDestination(index)}
          />
        ))}
      </div>
      <button className="add-destination-button" onClick={handleAddDestination}>
        Add New Destination
      </button>
      {mapCenter && <MapComponent places={places} center={mapCenter} />}
      {showFlightModal && (
        <FlightModal
          tripId={tripId}
          flight={currentFlight}
          onClose={() => setShowFlightModal(false)}
        />
      )}
      {showTransportationModal && (
        <Transportation
          tripId={tripId}
          transportation={currentTransportation}
          onClose={() => setShowTransportationModal(false)}
        />
      )}
      {showBudgetModal && (
        <BudgetModal
          tripId={trip._id}
          onSave={handleSaveBudget}
          onClose={handleCloseBudgetModal}
        />
      )}
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Destination from "./Destination";
import FlightModal from "./FlightModal";
import Transportation from "./Transportation";
import MapComponent from "./MapComponent";
import BudgetModal from "./BudgetModal";
import Loading from "../../styles/loader/Loading";
import { getCoordinates, fetchPlacesCoordinates, fetchAccommodationCoordinates, fetchTripDetails, fetchTripBySlug } from "../../services/tripService";
import {calculateDuration, getToken} from "../../util/util";
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
  const [places, setPlaces] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [currentFlight, setCurrentFlight] = useState(null);
  const [showTransportationModal, setShowTransportationModal] = useState(false);
  const [currentTransportation, setCurrentTransportation] = useState(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  useEffect(() => {
    if (!tripId) {
      fetchTripBySlug()
        .then((slugTrip) => {
          if (slugTrip) {
            setTripId(slugTrip._id);
            setTripName(slugTrip.tripName);
            setTrip(slugTrip);
            setDestinations(slugTrip.destinations);
            setLoading(false);
          } else {
            toast.error("Trip not found.", { theme: 'colored' }); 
          }
        })
        .catch((error) => {
          console.error("Error fetching trip by slug:", error);
          toast.error("An error occurred while fetching trip details. Please try again later.", { theme: 'colored' }); 
        });
    } else {
      fetchTripDetails(tripId)
        .then((tripData) => {
          setTrip(tripData);
        })
        .catch((error) => {
          console.error("Error fetching trip details:", error);
          toast.error("An error occurred while fetching trip details. Please try again later.", { theme: 'colored' });
        })
    }
  }, [tripId, tripSlug]);

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
        `${API_URL}/trips/destination/${tripId}/destinations`,
        newDestination,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDestinations(response.data.destinations);
    } catch (error) {
      console.error("Error adding destination:", error);
      toast.error("Couldn't create new destination, please try again later", { theme: 'colored'});
    }
  };  

  const handleSaveDestination = useCallback(
    async (updatedData, index) => {
      const destinationId = destinations[index]?._id; // Check if destinationId exists
      const updatedDestination = {
        ...destinations[index],
        ...updatedData,
        duration: calculateDuration(updatedData.startDate, updatedData.endDate),
      };

      try {
        const token = getToken();
        let response;
        if (destinationId) {
          // Update existing destination
          response = await axios.put(
            `${API_URL}/trips/destination/${tripId}/destinations/${destinationId}`,
            updatedDestination,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          // Create new destination
          response = await axios.post(
            `${API_URL}/trips/destination/${tripId}/destinations`,
            updatedDestination,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        const updatedDestinations = response.data.destinations || [];
        setDestinations(updatedDestinations);

        // Update places and accommodations if needed
        const updatedPlaces = await fetchPlacesCoordinates(
          updatedDestination,
          trip.country
        );
        setPlaces(updatedPlaces);
      } catch (error) {
        console.error("Error saving destination:", error);
        toast.error("Couldn't save new destination, please try again later", { theme: 'colored'});
      }
    },
    [destinations, tripId, trip?.country]
  );

  const handleAddPlace = async (destinationIndex, placeName, placePrice) => {
    if (typeof placeName !== "string" || !placeName.trim()) {
      console.error("Invalid place name:", placeName);
      return;
    }
    const parsedPrice = parseFloat(placePrice);
    if (isNaN(parsedPrice)) {
      console.error("Invalid place price:", placePrice);
      return;
    }
    const coordinates = await getCoordinates(
      `${placeName}, ${destinations[destinationIndex].city}, ${trip.country}`
    );
    if (
      !coordinates ||
      typeof coordinates.lat !== "number" ||
      typeof coordinates.lon !== "number"
    ) {
      console.error("Invalid coordinates:", coordinates);
      return;
    }
    const newPlace = {
      name: placeName.trim(),
      price: parsedPrice,
      coordinates,
    };
    const destinationId = destinations[destinationIndex]._id;
    if (!destinationId) {
      console.error("Invalid destination ID");
      return;
    }
    try {
      const token = getToken();
      const response = await axios.post(
        `${API_URL}/trips/destination/${tripId}/destinations/${destinationId}/places`,
        newPlace,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDestinations(response.data.destinations);
    } catch (error) {
      console.error("Error adding place:", error);
    }
    const updatedDestinations = destinations.map((dest, idx) =>
      idx === destinationIndex
        ? { ...dest, places: [...dest.places, newPlace] }
        : dest
    );
    setDestinations(updatedDestinations);
    const updatedPlaces = await fetchPlacesCoordinates(
      updatedDestinations,
      trip.country
    );
    setPlaces(updatedPlaces);
  };

  const handleEditPlace = async (
    destinationIndex,
    placeIndex,
    updatedPlace
  ) => {
    const coordinates = await getCoordinates(
      `${updatedPlace.name}, ${destinations[destinationIndex].city}, ${trip.country}`
    );
    if (
      !coordinates ||
      typeof coordinates.lat !== "number" ||
      typeof coordinates.lon !== "number"
    ) {
      console.error("Invalid coordinates:", coordinates);
      return;
    }
    updatedPlace = { ...updatedPlace, coordinates };
    const destinationId = destinations[destinationIndex]._id;
    const placeId = destinations[destinationIndex].places[placeIndex]._id;
    try {
      const token = getToken();
      const response = await axios.put(
        `${API_URL}/trips/destination/${tripId}/destinations/${destinationId}/places/${placeId}`,
        updatedPlace,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDestinations(response.data.destinations);
    } catch (error) {
      console.error("Error editing place:", error);
    }
    const updatedPlaces = await fetchPlacesCoordinates(
      destinations,
      trip.country
    );
    setPlaces(updatedPlaces);
  };

  const handleDeletePlace = async (destinationIndex, placeIndex) => {
    const placeId = destinations[destinationIndex].places[placeIndex]._id;
    const destinationId = destinations[destinationIndex]._id;
    if (!placeId || !destinationId) {
      console.error("Invalid placeId or destinationId");
      return;
    }
    try {
      const token = getToken();
      const response = await axios.delete(
        `${API_URL}/trips/destination/${tripId}/destinations/${destinationId}/places/${placeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDestinations(response.data.destinations);
    } catch (error) {
      console.error("Error deleting place:", error);
    }
    const updatedDestinations = destinations.map((dest, idx) =>
      idx === destinationIndex
        ? {
            ...dest,
            places: dest.places.filter((_, pIdx) => pIdx !== placeIndex),
          }
        : dest
    );
    setDestinations(updatedDestinations);

    // Update the places immediately after deletion
    const updatedPlaces = await fetchPlacesCoordinates(
      updatedDestinations,
      trip.country
    );
    setPlaces(updatedPlaces);
  };

  const handleDeleteDestination = async (destinationIndex) => {
    if (destinationIndex === 0) return;
    const updatedDestinations = destinations.filter(
      (_, idx) => idx !== destinationIndex
    );
    try {
      const token = getToken();
      const response = await axios.put(
        `${API_URL}/trips/destination/${tripId}`,
        { ...trip, destinations: updatedDestinations },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDestinations(response.data.destinations);
    } catch (error) {
      console.error("Error deleting destination:", error);
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
            initialData={destination}
            calculateDuration={calculateDuration}
            onSave={(updatedData) => handleSaveDestination(updatedData, index)}
            onAddPlace={(placeName, placePrice) =>
              handleAddPlace(index, placeName, placePrice)
            }
            onEditPlace={(placeIndex, placeName, placePrice) =>
              handleEditPlace(index, placeIndex, placeName, placePrice)
            }
            onDeletePlace={(placeIndex) => handleDeletePlace(index, placeIndex)}
            onDeleteDestination={() => handleDeleteDestination(index)}
            index={index}
            tripId={tripId}
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

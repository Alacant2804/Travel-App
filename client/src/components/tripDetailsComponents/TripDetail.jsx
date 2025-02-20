import { useState, useEffect, useCallback } from "react";
import {
  useParams,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { Link } from "react-router-dom";
import Destination from "./Destination";
import FlightModal from "./FlightModal";
import Transportation from "./Transportation";
import MapComponent from "./MapComponent";
import BudgetModal from "./BudgetModal";
import Loading from "../../styles/loader/Loading";
import {
  fetchTripDetails,
  fetchTripBySlug,
  fetchTransportationData,
  fetchFlightData,
  fetchBudgetData,
  getCoordinates,
} from "../../services/tripService";
import { calculateDuration, getToken } from "../../utils/util";
import axios from "axios";
import Title from "../common/Title";
import "./TripDetail.css";
import budgetIcon from "../../assets/budget.png";
import carIcon from "../../assets/car.png";
import planeIcon from "../../assets/plane.png";
import { toast } from "react-toastify";
import errorHandler from "../../utils/errorHandler";

const API_URL = import.meta.env.VITE_API_URL;

export default function TripDetail() {
  const [trip, setTrip] = useState(null);
  const navigate = useNavigate();
  const { tripSlug } = useParams();
  const location = useLocation();
  const [tripId, setTripId] = useState(location.state?.tripId || "");
  const [tripName, setTripName] = useState(location.state?.tripName || "");
  const [destinations, setDestinations] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [showTransportationModal, setShowTransportationModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetItems, setBudgetItems] = useState([]);
  const [transportationDetails, setTransportationDetails] = useState(null);
  const [outboundFlight, setOutboundFlight] = useState({});
  const [inboundFlight, setInboundFlight] = useState({});

  // Fetching specified trip via ID or slug
  useEffect(() => {
    setLoading(true);

    const fetchTrip = async () => {
      try {
        let tripData;
        if (tripId) {
          tripData = await fetchTripDetails(tripId);
        } else if (tripSlug) {
          tripData = await fetchTripBySlug(tripSlug);
          if (tripData) {
            setTripId(tripData._id);
          } else {
            toast.error("Trip not found.", { theme: "colored" });
            setLoading(false);
            return;
          }
        } else {
          toast.error("Trip not found.", { theme: "colored" });
          setLoading(false);
          return;
        }

        setTrip(tripData);
        setDestinations(tripData.destinations || []);

        // Calculate map center
        if (tripData.destinations && tripData.destinations.length > 0) {
          const coordinates = await getCoordinates(
            tripData.destinations[0].city
          );
          if (coordinates) {
            setMapCenter({ lat: coordinates.lat, lon: coordinates.lon });
          }
        }
      } catch (error) {
        errorHandler(
          error,
          "An error occurred while fetching trip details. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId, tripSlug, navigate]);

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
      errorHandler(
        error,
        "Couldn't create new destination, please try again later"
      );
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
        errorHandler(
          error,
          "Couldn't save new destination, please try again later"
        );
      }
    },
    [destinations, tripId]
  );

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
      errorHandler(
        error,
        "Couldn't delete destination. Please try again later."
      );
    }
  };

  const handleOpenFlightModal = () => {
    setLoading(true);
    try {
      fetchFlightData(tripId).then((flightData) => {
        const outbound = flightData.find((f) => f.type === "outbound") || {};
        const inbound = flightData.find((f) => f.type === "inbound") || {};

        setOutboundFlight(outbound);
        setInboundFlight(inbound);
        setShowFlightModal(true);
      });
    } catch (error) {
      errorHandler(
        error,
        "Couldn't fetch flight details. Please try again later"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTransportationModal = async () => {
    setLoading(true);
    try {
      const transportationData = await fetchTransportationData(tripId);
      setTransportationDetails(transportationData);
      setShowTransportationModal(true);
    } catch (error) {
      errorHandler(
        error,
        "Couldn't fetch transportation details. Please try again later"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBudgetModal = () => {
    setLoading(true);
    try {
      fetchBudgetData(tripId).then((trip) => setBudgetItems(trip));
      setShowBudgetModal(true);
    } catch (error) {
      errorHandler(
        error,
        "Couldn't fetch budget details. Please try again later"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!trip && !loading) {
    return <Navigate to="/404" replace={true} />;
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
      <h1 className="trip-title">{trip?.tripName}</h1>
      <div className="trip-info-row">
        <p>
          <strong>Country:</strong> {trip?.country}
        </p>
        <p>
          <strong>Start Date: </strong>
          {trip?.destinations[0]?.startDate.split("T")[0]}
        </p>
        <p>
          <strong>End Date: </strong>
          {trip?.destinations[0]?.endDate.split("T")[0]}
        </p>
        <p>
          <strong>Duration:</strong> {trip?.destinations[0]?.duration} days
        </p>
      </div>
      <div className="destinations">
        {destinations.map((destination, index) => (
          <Destination
            key={index}
            destination={destination}
            destinationIndex={index}
            country={trip.country}
            tripId={tripId}
            saveDestination={(updatedData) =>
              handleSaveDestination(updatedData, index)
            }
            onDeleteDestination={() => handleDeleteDestination(index)}
          />
        ))}
      </div>
      <button className="add-destination-button" onClick={handleAddDestination}>
        Add New Destination
      </button>
      {mapCenter && (
        <MapComponent destinations={destinations} center={mapCenter} />
      )}
      {showFlightModal && (
        <FlightModal
          tripId={tripId}
          outboundFlight={outboundFlight}
          setOutboundFlight={setOutboundFlight}
          inboundFlight={inboundFlight}
          setInboundFlight={setInboundFlight}
          onClose={() => setShowFlightModal(false)}
        />
      )}
      {showTransportationModal && (
        <Transportation
          tripId={tripId}
          transportationDetails={transportationDetails}
          setTransportationDetails={setTransportationDetails}
          onClose={() => setShowTransportationModal(false)}
        />
      )}
      {showBudgetModal && (
        <BudgetModal
          tripId={tripId}
          budgetItems={budgetItems}
          setBudgetItems={setBudgetItems}
          onClose={() => setShowBudgetModal(false)}
        />
      )}
    </div>
  );
}

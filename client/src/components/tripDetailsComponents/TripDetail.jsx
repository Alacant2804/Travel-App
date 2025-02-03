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
  fetchTripDetails,
  fetchTripBySlug,
  fetchTransportationData,
  fetchFlightData
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
  const [showTransportationModal, setShowTransportationModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [transportationDetails, setTransportationDetails] = useState(null);
  const [outboundFlight, setOutboundFlight] = useState({});
  const [inboundFlight, setInboundFlight] = useState({});

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

  // Fetch details
  useEffect(() => {
    fetchTransportationData(tripId)
      .then(transportationData => setTransportationDetails(transportationData));

    fetchFlightData(tripId)
      .then((flightData) => {
        const outbound = flightData.find(f => f.type === 'outbound') || {};
        const inbound = flightData.find(f => f.type === 'inbound') || {};

        setOutboundFlight(outbound);
        setInboundFlight(inbound);
      })
  }, [tripId]);

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

  const handleOpenFlightModal = () => {
    setShowFlightModal(true);
  };

  const handleOpenTransportationModal = () => {
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
      {mapCenter && <MapComponent places={places} center={mapCenter} />}
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
          onSave={handleSaveBudget}
          onClose={handleCloseBudgetModal}
        />
      )}
    </div>
  );
}

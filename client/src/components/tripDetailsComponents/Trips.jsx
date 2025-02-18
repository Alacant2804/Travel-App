import { useState, useCallback, useMemo, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { parseISO, addDays } from "date-fns"; // Import parse and format
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../common/Title";
import { slugify } from "../../utils/slugify";
import errorHandler from "../../utils/errorHandler";
import TripFormModal from "./TripFormModal";
import { TripsContext } from "../../context/TripsContext";
import { AuthContext } from "../../context/AuthContext";
import { getToken } from "../../utils/util";
import Loading from "../../styles/loader/Loading";
import "./Trips.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Trips() {
  const { trips, setTrips, fetchTrips } = useContext(TripsContext);
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  useEffect(() => {
    if (!user) {
      setTrips([]);
    }
  }, [user, setTrips]);

  const addTrip = useCallback(async (newTrip) => {
    const token = getToken();
    const response = await axios.post(`${API_URL}/trips`, newTrip, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  }, []);

  const handleCreateTrip = useCallback(
    async (newTripData) => {
      try {
        setLoading(true);
        const token = getToken();
        if (editingTrip) {
          // Edit existing trip
          const response = await axios.put(
            `${API_URL}/trips/${editingTrip._id}`,
            newTripData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // Update specific trip in the trips array
          setTrips((prevTrips) =>
            prevTrips.map((trip) =>
              trip._id === editingTrip._id ? response.data.data : trip
            )
          );
          toast.success("Trip updated successfully!", {
            theme: "colored",
          });
        } else {
          // Create new trip
          const newTrip = await addTrip(newTripData);
          setTrips((prevTrips) => [...prevTrips, newTrip]);
          toast.success("Trip created successfully!", {
            theme: "colored",
          });
        }
      } catch (error) {
        errorHandler(error);
      } finally {
        setLoading(false);
      }
    },
    [setTrips, addTrip, editingTrip]
  );

  const handleDeleteTrip = useCallback(
    async (tripId, event) => {
      setLoading(true);
      event.stopPropagation();
      try {
        const token = getToken();
        const response = await axios.delete(`${API_URL}/trips/${tripId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          // Remove the trip from the list
          setTrips((prevTrips) =>
            prevTrips.filter((trip) => trip._id !== tripId)
          );
          toast.success("Trip deleted successfully!", {
            theme: "colored",
          });
        } else {
          toast.error("Coudln't delete trip. Please try again.", {
            theme: "colored",
          });
          return;
        }
      } catch (error) {
        errorHandler(error, "Error deleting trip. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [setTrips]
  );

  const handleCreateButtonClick = () => {
    if (user) {
      setIsModalOpen(true);
      setEditingTrip(null);
    } else {
      toast.error("Please log in to create a trip.", { theme: "colored" });
    }
  };

  const handleTripClick = useCallback(
    (trip) => {
      const slug = slugify(trip.tripName);
      navigate(`/trips/${slug}`, {
        state: { tripId: trip._id, tripName: trip.tripName },
      });
    },
    [navigate]
  );

  const renderedTrips = useMemo(() => {
    if (!Array.isArray(trips)) {
      console.error("Trips is not an array:", trips);
      return [];
    }

    return trips.map((trip) => {
      const startDateString = trip.destinations[0].startDate;
      const endDateString = trip.destinations[0].endDate;

      const startDateUTC = parseISO(startDateString);
      const endDateUTC = parseISO(endDateString);

      const startDate = addDays(startDateUTC, 1);
      const endDate = addDays(endDateUTC, 1);
      const today = new Date();

      startDate.setHours(23, 59, 59, 999);
      endDate.setHours(23, 59, 59, 999);

      const isTripCompleted = endDate < today;
      const isTripInProgress =
        startDate <= today && today <= endDate && !isTripCompleted;

      return (
        <li
          key={trip._id}
          className={`trip-card ${isTripCompleted ? "completed" : ""}`}
        >
          <div className="trip-link" onClick={() => handleTripClick(trip)}>
            <h3>{trip.tripName}</h3>

            <p>
              <strong>Country: </strong> {trip.country}
            </p>
            <p>
              <strong>City: </strong> {trip.destinations[0].city}
            </p>
            <p>
              <strong>Start Date: </strong>{" "}
              {trip.destinations[0].startDate.split("T")[0]}
            </p>
            <p>
              <strong>End Date: </strong>{" "}
              {trip.destinations[0].endDate.split("T")[0]}
            </p>
            <p>
              <strong>Duration: </strong>{" "}
              {trip.destinations[0]?.duration === 0
                ? "1 day"
                : trip.destinations[0]?.duration === 1
                ? trip.destinations[0]?.duration + " day"
                : trip.destinations[0]?.duration + " days"}
            </p>
            <p>
              <strong>Status: </strong>
              {isTripCompleted ? (
                <span className="completed-status">Completed</span>
              ) : isTripInProgress ? (
                <span className="in-progress-status">In Progress</span>
              ) : (
                <span>Upcoming</span>
              )}
            </p>
          </div>
          <div className="trip-actions">
            <button
              className="trip-btn edit"
              onClick={(event) => {
                event.stopPropagation();
                setIsModalOpen(true);
                setEditingTrip(trip);
              }}
            >
              Edit
            </button>
            <button
              className="trip-btn delete"
              onClick={(event) => handleDeleteTrip(trip._id, event)}
            >
              Delete
            </button>
          </div>
        </li>
      );
    });
  }, [trips, handleDeleteTrip, handleTripClick]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="trips-page">
      <main className="trips-main">
        <Title title="Trips | Travel App" />
        <h1>Your Trips</h1>
        <button className="create-trip-btn" onClick={handleCreateButtonClick}>
          Create Trip
        </button>

        {trips.length === 0 ? (
          <p className="no-trips-message">There are no trips yet.</p>
        ) : (
          <ul className="trips-list">{renderedTrips}</ul>
        )}

        {isModalOpen && (
          <TripFormModal
            onRequestClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateTrip}
            trip={editingTrip}
          />
        )}
      </main>
    </div>
  );
}

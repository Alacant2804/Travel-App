import { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Destination from './Destination';
import FlightModal from './FlightModal';
import Transportation from './Transportation';
import MapComponent from './MapComponent';
import BudgetModal from './BudgetModal';
import Loading from './Loading';
import axios from 'axios';
import Title from './Title';
import './TripDetail.css';
import budgetIcon from './assets/budget.png';
import carIcon from './assets/car.png';
import planeIcon from './assets/plane.png';

const API_URL = import.meta.env.VITE_API_URL;

const getAndSetCoordinates = async (query, setState = null) => {
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: query,
                format: 'json',
                limit: 1
            }
        });
        if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            const coordinates = { lat: parseFloat(lat), lon: parseFloat(lon) };

            if (setState) {
                setState([coordinates.lat, coordinates.lon]);
            }

            return coordinates;
        } else {
            console.error("No coordinates found for the provided location.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        return null;
    }
};

const fetchPlacesAndAccommodationsCoordinates = async (destinations, tripCountry) => {
    if (!Array.isArray(destinations) || destinations.length === 0) {
        console.error("Invalid or empty destinations array.");
        return [];
    }
  
    const allPlaces = await Promise.all(destinations.flatMap(async (destination) => {
        if (!Array.isArray(destination.places)) {
            console.error("Invalid places array in destination.");
            return [];
        }

        const placeResults = await Promise.all(destination.places.map(async (place) => {
            const coordinates = await getAndSetCoordinates(`${place.name}, ${destination.city}, ${tripCountry}`);
            return { ...place, coordinates };
        }));

        const accommodationCoordinates = destination.accommodation ? await getAndSetCoordinates(`${destination.accommodation.address}, ${destination.city}, ${tripCountry}`) : null;
        return [
            ...placeResults,
            ...(destination.accommodation ? [{ ...destination.accommodation, coordinates: accommodationCoordinates }] : [])
        ];
    }));

    return allPlaces.flat();
};

const fetchAllCoordinates = async (trip, setPlaces) => {
    const allPlaces = await fetchPlacesAndAccommodationsCoordinates(trip.destinations, trip.country);
    setPlaces(allPlaces);
};

export default function TripDetail() {
    const { tripSlug } = useParams();
    const location = useLocation();
    const [tripId, setTripId] = useState(location.state?.tripId || '');
    const [tripName, setTripName] = useState(location.state?.tripName || '');
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

    const fetchTripDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/trips/${tripId}`, { withCredentials: true });
            setTrip(response.data);
            setDestinations(response.data.destinations || []);

            if (Array.isArray(response.data.destinations) && response.data.destinations.length > 0) {
                await fetchAllCoordinates(response.data, setPlaces);
                await getAndSetCoordinates(`${response.data.destinations[0].city}, ${response.data.country}`, setMapCenter);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching trip details:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTripDetails();

        if (!tripId) {
      // Handle case where tripId is not in state (e.g., user refreshes the page)
      const fetchTripBySlug = async () => {
        try {
          const response = await axios.get(`${API_URL}/trips`, { withCredentials: true });
          const trip = response.data.find(trip => slugify(trip.tripName) === tripSlug);
          if (trip) {
            setTripId(trip._id);
            setTripName(trip.tripName);
            setTrip(trip);
            setDestinations(trip.destinations);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error fetching trip by slug:', error);
        }
      };
      fetchTripBySlug();
    } else {
      fetchTripDetails();
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
            places: []
        };

        try {
            const response = await axios.post(`${API_URL}/trips/${tripId}/destinations`, newDestination, { withCredentials: true });
            setDestinations(response.data.destinations);
        } catch (error) {
            console.error('Error adding destination:', error);
        }
    };

    const calculateDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const durationInMilliseconds = end - start;
        return Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24));
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
            let response;
            if (destinationId) {
                // Update existing destination
                response = await axios.put(
                `${API_URL}/trips/${tripId}/destinations/${destinationId}`,
                updatedDestination,
                { withCredentials: true }
                );
            } else {
                // Create new destination
                response = await axios.post(
                `${API_URL}/trips/${tripId}/destinations`,
                updatedDestination,
                { withCredentials: true }
                );
            }

            const updatedDestinations = response.data.destinations || [];
            setDestinations(updatedDestinations);

            // Update places and accommodations if needed
            const updatedPlaces = await fetchPlacesAndAccommodationsCoordinates(
                updatedDestination,
                trip.country
            );
            setPlaces(updatedPlaces);
            } catch (error) {
            console.error('Error saving destination:', error);
            }
        },
        [destinations, tripId, trip?.country]
    );

    const handleAddPlace = async (destinationIndex, placeName, placePrice) => {
        if (typeof placeName !== 'string' || !placeName.trim()) {
            console.error("Invalid place name:", placeName);
            return;
        }
        const parsedPrice = parseFloat(placePrice);
        if (isNaN(parsedPrice)) {
            console.error("Invalid place price:", placePrice);
            return;
        }
        const coordinates = await getAndSetCoordinates(`${placeName}, ${destinations[destinationIndex].city}, ${trip.country}`);
        if (!coordinates || typeof coordinates.lat !== 'number' || typeof coordinates.lon !== 'number') {
            console.error("Invalid coordinates:", coordinates);
            return;
        }
        const newPlace = { name: placeName.trim(), price: parsedPrice, coordinates };
        const destinationId = destinations[destinationIndex]._id;
        if (!destinationId) {
            console.error("Invalid destination ID");
            return;
        }
        try {
            const response = await axios.post(
                `${API_URL}/trips/${tripId}/destinations/${destinationId}/places`,
                newPlace,
                { withCredentials: true }
            );
            setDestinations(response.data.destinations);
        } catch (error) {
            console.error('Error adding place:', error);
        }
        const updatedDestinations = destinations.map((dest, idx) =>
            idx === destinationIndex ? { ...dest, places: [...dest.places, newPlace] } : dest
        );
        setDestinations(updatedDestinations);
        const updatedPlaces = await fetchPlacesAndAccommodationsCoordinates(updatedDestinations, trip.country);
        setPlaces(updatedPlaces);
    };

    const handleEditPlace = async (destinationIndex, placeIndex, updatedPlace) => {
        const coordinates = await getAndSetCoordinates(`${updatedPlace.name}, ${destinations[destinationIndex].city}, ${trip.country}`);
        if (!coordinates || typeof coordinates.lat !== 'number' || typeof coordinates.lon !== 'number') {
            console.error("Invalid coordinates:", coordinates);
            return;
        }
        updatedPlace = { ...updatedPlace, coordinates };
        const destinationId = destinations[destinationIndex]._id;
        const placeId = destinations[destinationIndex].places[placeIndex]._id;
        try {
            const response = await axios.put(
                `${API_URL}/trips/${tripId}/destinations/${destinationId}/places/${placeId}`,
                updatedPlace,
                { withCredentials: true }
            );
            setDestinations(response.data.destinations);
        } catch (error) {
            console.error('Error editing place:', error);
        }
        const updatedPlaces = await fetchPlacesAndAccommodationsCoordinates(destinations, trip.country);
        setPlaces(updatedPlaces);
    };

    const handleDeletePlace = async (destinationIndex, placeIndex) => {
        const placeId = destinations[destinationIndex].places[placeIndex]._id;
        const destinationId = destinations[destinationIndex]._id;
        if (!placeId || !destinationId) {
            console.error('Invalid placeId or destinationId');
            return;
        }
        try {
            const response = await axios.delete(`${API_URL}/trips/${tripId}/destinations/${destinationId}/places/${placeId}`, { withCredentials: true });
            setDestinations(response.data.destinations);
        } catch (error) {
            console.error('Error deleting place:', error);
        }
        const updatedDestinations = destinations.map((dest, idx) =>
            idx === destinationIndex ? { ...dest, places: dest.places.filter((_, pIdx) => pIdx !== placeIndex) } : dest
        );
        setDestinations(updatedDestinations);

        // Update the places immediately after deletion
        const updatedPlaces = await fetchPlacesAndAccommodationsCoordinates(updatedDestinations, trip.country);
        setPlaces(updatedPlaces);
    };

    const handleDeleteDestination = async (destinationIndex) => {
        if (destinationIndex === 0) return;
        const updatedDestinations = destinations.filter((_, idx) => idx !== destinationIndex);
        try {
            const response = await axios.put(`${API_URL}/trips/${tripId}`, { ...trip, destinations: updatedDestinations }, { withCredentials: true });
            setDestinations(response.data.destinations);
        } catch (error) {
            console.error('Error deleting destination:', error);
        }
    };

    const handleSaveFlight = async (flightData) => {
        try {
            if (flightData._id) {
                const response = await axios.put(
                    `${API_URL}/trips/${tripId}/flights/${flightData._id}`,
                    flightData,
                    { withCredentials: true }
                );
                setCurrentFlight(response.data);
            } else {
                const response = await axios.post(
                    `${API_URL}/trips/${tripId}/flights`,
                    flightData,
                    { withCredentials: true }
                );
                setCurrentFlight(response.data);
            }
            setShowFlightModal(false);
            fetchTripDetails();
        } catch (error) {
            console.error("Error saving flight:", error);
        }
    };

    const handleOpenFlightModal = (flight = null) => {
        setCurrentFlight(flight);
        setShowFlightModal(true);
    };

    const handleSaveTransportation = async (transportationData) => {
        try {
            if (transportationData._id) {
                await axios.put(
                    `${API_URL}/trips/${tripId}/transportation/${transportationData._id}`,
                    transportationData,
                    { withCredentials: true }
                );
            } else {
                await axios.post(
                    `${API_URL}/trips/${tripId}/transportation`,
                    transportationData,
                    { withCredentials: true }
                );
            }
            setCurrentTransportation(transportationData);
            setShowTransportationModal(false);
            fetchTripDetails();
        } catch (error) {
            console.error('Error saving transportation:', error);
        }
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
            <div className='button-section'>
                <Link to='/trips'><button className='back-button'>Go Back</button></Link>
                <div className='trip-icons'>
                    <button className="button-icon" onClick={handleOpenBudgetModal}><img src={budgetIcon} alt="Budget" className="budget-icon" /></button>
                    <button className="button-icon" onClick={handleOpenTransportationModal}><img src={carIcon} alt="Car" className="icon" /></button>
                    <button className="button-icon" onClick={handleOpenFlightModal}><img src={planeIcon} alt="Plane" className="icon" /></button>
                </div>
            </div>
            <h1 className="trip-title">{trip.tripName}</h1>
            <div className="trip-info-row">
                <p><strong>Country:</strong> {trip.country}</p>
                <p><strong>Start Date:</strong> {trip.destinations[0].startDate.split('T')[0]}</p>
                <p><strong>End Date:</strong> {trip.destinations[0].endDate.split('T')[0]}</p>
                <p><strong>Duration:</strong> {trip.destinations[0].duration} days</p>
            </div>
            <div className="destinations">
                {destinations.map((destination, index) => (
                    <Destination
                        key={index}
                        initialData={destination}
                        calculateDuration={calculateDuration}
                        onSave={(updatedData) => handleSaveDestination(updatedData, index)}
                        onAddPlace={(placeName, placePrice) => handleAddPlace(index, placeName, placePrice)}
                        onEditPlace={(placeIndex, placeName, placePrice) => handleEditPlace(index, placeIndex, placeName, placePrice)}
                        onDeletePlace={(placeIndex) => handleDeletePlace(index, placeIndex)}
                        onDeleteDestination={() => handleDeleteDestination(index)}
                        index={index}
                        tripId={tripId}
                    />
                ))}
            </div>
            <button className="add-destination-button" onClick={handleAddDestination}>Add New Destination</button>
            {mapCenter && <MapComponent places={places} center={mapCenter} />}
            {showFlightModal && (
                <FlightModal
                    tripId={tripId}
                    flight={currentFlight}
                    onSave={handleSaveFlight}
                    onClose={() => setShowFlightModal(false)}
                />
            )}
            {showTransportationModal && (
                <Transportation
                    tripId={tripId}
                    transportation={currentTransportation}
                    onSave={handleSaveTransportation}
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

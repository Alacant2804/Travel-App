import { useState, useEffect, useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Destination from './Destination';
import MapComponent from './MapComponent';
import axios from 'axios';
import './TripDetail.css';
import budgetIcon from './assets/budget.png';
import carIcon from './assets/car.png';
import planeIcon from './assets/plane.png';
import { TripsContext } from './TripsContext';

// Fetch and set coordinates from the provided location query
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

// Fetch coordinates for all places and accommodations
const fetchPlacesAndAccommodationsCoordinates = async (destinations, tripCountry) => {
  const allPlaces = await Promise.all(destinations.flatMap(async (destination) => {
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

// Fetch all coordinates for the trip
const fetchAllCoordinates = async (trip, setPlaces) => {
  const allPlaces = await fetchPlacesAndAccommodationsCoordinates(trip.destinations, trip.country);
  setPlaces(allPlaces);
};

export default function TripDetail() {
  const { tripId } = useParams();
  const { trips, fetchTrips } = useContext(TripsContext);
  const [destinations, setDestinations] = useState([]);
  const [places, setPlaces] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);

  useEffect(() => {
    if (!trips.length) {
      fetchTrips();
    }
  }, [fetchTrips, trips.length]);

  const trip = trips.find(t => t._id === tripId);

  useEffect(() => {
    if (trip && trip.destinations) {
      setDestinations(trip.destinations);
      fetchAllCoordinates(trip, setPlaces);
      getAndSetCoordinates(`${trip.destinations[0].city}, ${trip.country}`, setMapCenter);
    } else {
      console.error("Trip not found or no destinations available!");
    }
  }, [trip, tripId]);

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
      const response = await axios.post(`http://localhost:5001/api/trips/${tripId}/destinations`, newDestination, { withCredentials: true });
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
      const updatedDestinations = destinations.map((dest, idx) =>
        idx === index
          ? { ...updatedData, duration: calculateDuration(updatedData.startDate, updatedData.endDate) }
          : dest
      );

      try {
        const response = await axios.put(`http://localhost:5001/api/trips/${tripId}/destinations/${updatedDestinations[index]._id}`, updatedDestinations[index], { withCredentials: true });
        setDestinations(response.data.destinations);
      } catch (error) {
        console.error('Error updating destination:', error);
      }

      const updatedPlaces = await fetchPlacesAndAccommodationsCoordinates(updatedDestinations, trip.country);
      setPlaces(updatedPlaces);
    },
    [destinations, tripId, trip.country]
  );

  const handleAddPlace = async (destinationIndex, placeName, placePrice) => {
    const coordinates = await getAndSetCoordinates(`${placeName}, ${destinations[destinationIndex].city}, ${trip.country}`);
    const newPlace = { name: placeName, price: parseFloat(placePrice) || 0, coordinates };
    
    const destinationId = destinations[destinationIndex]._id; // Ensure this is valid
  
    if (!destinationId) {
      console.error("Invalid destination ID");
      return;
    }
  
    try {
      const response = await axios.post(`http://localhost:5001/api/trips/${tripId}/destinations/${destinationId}/places`, newPlace, { withCredentials: true });
      setDestinations(response.data.destinations);
    } catch (error) {
      console.error('Error adding place:', error);
    }
  
    // Update local state
    const updatedDestinations = destinations.map((dest, idx) =>
      idx === destinationIndex ? { ...dest, places: [...dest.places, newPlace] } : dest
    );
    setDestinations(updatedDestinations);
  
    const updatedPlaces = await fetchPlacesAndAccommodationsCoordinates(updatedDestinations, trip.country);
    setPlaces(updatedPlaces);
  };
  

  const handleEditPlace = async (destinationIndex, placeIndex, placeName, placePrice) => {
    const coordinates = await getAndSetCoordinates(`${placeName}, ${destinations[destinationIndex].city}, ${trip.country}`);
    const updatedDestinations = destinations.map((dest, idx) =>
      idx === destinationIndex
        ? {
            ...dest,
            places: dest.places.map((place, pIdx) =>
              pIdx === placeIndex ? { name: placeName, price: parseFloat(placePrice) || 0, coordinates } : place
            )
          }
        : dest
    );

    try {
      const response = await axios.put(`http://localhost:5001/api/trips/${tripId}/destinations/${updatedDestinations[destinationIndex]._id}/places/${updatedDestinations[destinationIndex].places[placeIndex]._id}`, updatedDestinations[destinationIndex].places[placeIndex], { withCredentials: true });
      setDestinations(response.data.destinations);
    } catch (error) {
      console.error('Error editing place:', error);
    }

    const updatedPlaces = await fetchPlacesAndAccommodationsCoordinates(updatedDestinations, trip.country);
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
      const response = await axios.delete(`http://localhost:5001/api/trips/${tripId}/destinations/${destinationId}/places/${placeId}`, { withCredentials: true });
      setDestinations(response.data.destinations);
    } catch (error) {
      console.error('Error deleting place:', error);
    }
  
    // Update local state
    const updatedDestinations = destinations.map((dest, idx) =>
      idx === destinationIndex ? { ...dest, places: dest.places.filter((_, pIdx) => pIdx !== placeIndex) } : dest
    );
    setDestinations(updatedDestinations);
  };
  

  if (!trip) {
    return <p>Trip not found!</p>;
  }

  return (
    <div className="trip-detail-page">
      <div className='button-section'>
        <Link to='/trips'><button className='back-button'>Go Back</button></Link>
        <div className='trip-icons'>
          <button className="button-icon"><img src={budgetIcon} alt="Budget" className="budget-icon" /></button>
          <button className="button-icon"><img src={carIcon} alt="Car" className="icon" /></button>
          <button className="button-icon"><img src={planeIcon} alt="Plane" className="icon" /></button>
        </div>
      </div>
      <h1 className="trip-title">{trip.tripName}</h1> {/* Trip details */}
      <div className="trip-info-row">
        <p><strong>Country:</strong> {trip.country}</p>
        <p><strong>Start Date:</strong> {trip.destinations[0].startDate.split('T')[0]}</p>
        <p><strong>End Date:</strong> {trip.destinations[0].endDate.split('T')[0]}</p>
        <p><strong>Duration:</strong> {trip.destinations[0].duration} days</p>
      </div>
      <div className="destinations"> {/* Destination component */}
        {destinations.map((destination, index) => (
          <Destination
            key={index}
            initialData={destination}
            calculateDuration={calculateDuration}
            onSave={(updatedData) => handleSaveDestination(updatedData, index)}
            onAddPlace={(placeName, placePrice) => handleAddPlace(index, placeName, placePrice)}
            onEditPlace={(placeIndex, placeName, placePrice) => handleEditPlace(index, placeIndex, placeName, placePrice)}
            onDeletePlace={(placeIndex) => handleDeletePlace(index, placeIndex)}
          />
        ))}
      </div>
      <button className="add-destination-button" onClick={handleAddDestination}>Add New Destination</button>
      {mapCenter && <MapComponent places={places} center={mapCenter} />}
    </div>
  );
}

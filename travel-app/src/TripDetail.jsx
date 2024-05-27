import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Destination from './Destination';
import MapComponent from './MapComponent';
import axios from 'axios';
import './TripDetail.css';
import budgetIcon from './assets/budget.png';
import carIcon from './assets/car.png';
import planeIcon from './assets/plane.png';

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
  const allPlaces = await Promise.all(destinations.flatMap(async (destination) => {
    const placeResults = await Promise.all(destination.places.map(async (place) => {
      const coordinates = await getAndSetCoordinates(`${place.name}, ${destination.name}, ${tripCountry}`);
      return { ...place, coordinates };
    }));

    const accommodationCoordinates = destination.accommodation ? await getAndSetCoordinates(`${destination.accommodation.address}, ${destination.name}, ${tripCountry}`) : null;
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

export default function TripDetail({ trips }) {
  const { tripId } = useParams();
  const [destinations, setDestinations] = useState([]);
  const [places, setPlaces] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);

  // Find the trip once and store it in a variable
  const trip = trips.find(t => t.id === parseInt(tripId, 10));

  useEffect(() => {
    if (trip && trip.destinations) {
      setDestinations(trip.destinations);
      fetchAllCoordinates(trip, setPlaces);
      getAndSetCoordinates(`${trip.destinations[0].name}, ${trip.country}`, setMapCenter);
    } else {
      console.error("Trip not found or no destinations available!");
    }
  }, [trip, tripId, trips]);

  const handleAddDestination = () => {
    const startDate = new Date().toISOString().slice(0, 10);
    const endDate = new Date().toISOString().slice(0, 10);
    const duration = calculateDuration(startDate, endDate);

    const newDestination = {
      name: "New Destination",
      startDate,
      endDate,
      duration,
      places: []
    };

    setDestinations(prev => [...prev, newDestination]);
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
      setDestinations(updatedDestinations);

      const updatedPlaces = await fetchPlacesAndAccommodationsCoordinates(updatedDestinations, trip.country);
      setPlaces(updatedPlaces);
    },
    [destinations, trip.country]
  );

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
        <p><strong>Start Date:</strong> {trip.destinations[0].startDate}</p>
        <p><strong>End Date:</strong> {trip.destinations[0].endDate}</p>
        <p><strong>Duration:</strong> {trip.destinations[0].duration} days</p>
      </div>
      <div className="destinations"> {/* Destination component */}
        {destinations.map((destination, index) => (
          <Destination
          key={index}
          initialData={destination}
          calculateDuration={calculateDuration}
          onSave={(updatedData) => handleSaveDestination(updatedData, index)}
        />
        ))}
      </div>
      <button className="add-destination-button" onClick={handleAddDestination}>Add New Destination</button>
      {mapCenter && <MapComponent places={places} center={mapCenter} />}
    </div>
  );
}
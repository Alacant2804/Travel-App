import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Destination from './Destination';
import MapComponent from './MapComponent';
import axios from 'axios';
import './TripDetail.css';
import { Link } from 'react-router-dom';
import budgetIcon from './assets/budget.png';
import carIcon from './assets/car.png';
import planeIcon from './assets/plane.png';

export default function TripDetail({ trips }) {
  const { tripId } = useParams();
  const [destinations, setDestinations] = useState([]);
  const [places, setPlaces] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);

  useEffect(() => {
    const trip = trips.find(t => t.id === parseInt(tripId, 10));
    if (trip && trip.destinations) {
      setDestinations(trip.destinations);
      
      // Fetch all coordinates for places
      const fetchAllCoordinates = async () => {
        const allPlaces = await Promise.all(trip.destinations.flatMap(async (destination) => {
          const placeResults = await Promise.all(destination.places.map(async (place) => {
            const coordinates = await getCoordinates(place.name, destination.name, trip.country);
            return { ...place, coordinates };
          }));
          const accommodationCoordinates = destination.accommodation ? await getCoordinates(destination.accommodation.address, destination.name, trip.country) : null;
          return [
            ...placeResults,
            ...(destination.accommodation ? [{ ...destination.accommodation, coordinates: accommodationCoordinates }] : [])
          ];
        }));
        setPlaces(allPlaces.flat());
      };

      fetchAllCoordinates();

      // Fetch coordinates for the country and city
      fetchCoordinates(trip.country, trip.destinations[0].name);
    } else {
      console.error("Trip not found or no destinations available!");
    }
  }, [tripId, trips]);

  const getCoordinates = async (place, city, country) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: `${place}, ${city}, ${country}`,
          format: 'json',
          limit: 1
        }
      });
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      } else {
        console.error("No coordinates found for the provided location.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  const fetchCoordinates = async (country, city) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: `${city}, ${country}`,
          format: 'json',
          limit: 1
        }
      });
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
      } else {
        console.error("No coordinates found for the provided location.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

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

  const trip = trips.find(t => t.id === parseInt(tripId, 10));
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
      <h1 className="trip-title">{trip.tripName}</h1>
      <div className="trip-info-row">
        <p><strong>Country:</strong> {trip.country}</p>
        <p><strong>Start Date:</strong> {trip.destinations[0].startDate}</p>
        <p><strong>End Date:</strong> {trip.destinations[0].endDate}</p>
        <p><strong>Duration:</strong> {trip.destinations[0].duration} days</p>
      </div>
      <div className="destinations">
        {destinations.length > 0 ? (
          destinations.map((destination, index) => (
            <Destination 
              key={index} 
              initialData={destination} 
              calculateDuration={calculateDuration}
              onSave={async (updatedData) => {
                const updatedDestinations = destinations.map((dest, idx) => 
                  idx === index ? { ...updatedData, duration: calculateDuration(updatedData.startDate, updatedData.endDate) } : dest
                );
                setDestinations(updatedDestinations);

                const updatedPlaces = await Promise.all(updatedDestinations.flatMap(async destination => {
                  const placeResults = await Promise.all(destination.places.map(async (place) => {
                    const coordinates = await getCoordinates(place.name, destination.name, trip.country);
                    return { ...place, coordinates };
                  }));
                  const accommodationCoordinates = destination.accommodation ? await getCoordinates(destination.accommodation.address, destination.name, trip.country) : null;
                  return [
                    ...placeResults,
                    ...(destination.accommodation ? [{ ...destination.accommodation, coordinates: accommodationCoordinates }] : [])
                  ];
                }));
                setPlaces(updatedPlaces.flat());
              }} 
            />
          ))
        ) : (
          <p>No destinations found for this trip.</p>
        )}
      </div>
      <button className="add-destination-button" onClick={handleAddDestination}>Add New Destination</button>
      {mapCenter && <MapComponent places={places} center={mapCenter} />}
    </div>
  );
}
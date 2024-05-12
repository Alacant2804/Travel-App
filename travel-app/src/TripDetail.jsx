import { useParams } from 'react-router-dom';
import './TripDetail.css';

export default function TripDetail({ trips }) {
  const { tripId } = useParams();
  const trip = trips.find((t) => t.id === parseInt(tripId, 10));

  if (!trip) {
    return <p>Trip not found!</p>;
  }

  return (
    <div className="trip-detail-container">
      <h1 className="trip-title">{trip.tripName}</h1>
      <div className="trip-info">
        <div className="destination-details">
          <h2>{trip.destination}</h2>
          <div className="trip-dates">
            <p><strong>Start Date: </strong> {trip.startDate}</p>
            <p><strong>End Date: </strong> {trip.endDate}</p>
            <p><strong>Duration: </strong> {trip.duration} days</p>
          </div>
        </div>
        <ul className="places-to-visit">
          {/* Placeholder for list of places to visit */}
          <li>Place 1</li>
          <li>Place 2</li>
          <li>Add more...</li>
        </ul>
      </div>
    </div>
  );
}

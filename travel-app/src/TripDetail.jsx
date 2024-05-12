import { useParams } from 'react-router-dom';

export default function TripDetail({ trips }) {
  const { tripId } = useParams();
  console.log("Fetched tripId from URL:", tripId);

  console.log('All trips', trips)
  const trip = trips.find((t) => t.id === parseInt(tripId, 10));
  console.log("Matching trip found:", trip);

  if (!trip) {
    return <p>Trip not found!</p>;
  }

  return (
    <div className="trip-detail">
      <h1>{trip.tripName}</h1>
      <p><strong>Destination:</strong> {trip.destination}</p>
      <p>
        <strong>Start Date:</strong> {trip.startDate}
      </p>
      <p>
        <strong>End Date:</strong> {trip.endDate}
      </p>
      <p>
        <strong>Description:</strong> {trip.description || 'No description provided.'}
      </p>
    </div>
  );
}

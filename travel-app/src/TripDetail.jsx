import { useParams } from 'react-router-dom';

export default function TripDetail({ trips }) {
  const { tripId } = useParams();
  const trip = trips.find((t) => t.id === parseInt(tripId));

  if (!trip) {
    return <p>Trip not found!</p>;
  }

  return (
    <div className="trip-detail">
      <h1>{trip.tripName}</h1>
      <p><strong>Destination:</strong> {trip.destination}</p>
      <p><strong>Date:</strong> {trip.date}</p>
      <p><strong>Description:</strong> {trip.description || 'No description provided.'}</p>
    </div>
  );
}

import mongoose from 'mongoose';

const FlightSchema = new mongoose.Schema({
  departureAirport: String,
  arrivalAirport: String,
  departureDate: Date,
  bookingLink: String,
  price: Number,
  type: { type: String, required: true }
});

const CoordinatesSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true
  },
  lon: {
    type: Number,
    required: true
  }
});

const PlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  coordinates: {
    type: CoordinatesSchema,
    required: true
  }
});

const AccommodationSchema = new mongoose.Schema({
  address: String,
  coordinates: CoordinatesSchema,
  price: Number,
  bookingLink: String
});

const DestinationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  places: [PlaceSchema],
  accommodation: AccommodationSchema
});


const TripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tripName: { type: String, required: true },
  country: { type: String, required: true },
  destinations: [DestinationSchema],
  flights: [FlightSchema],
}, { timestamps: true });


const Trip = mongoose.model('Trip', TripSchema);

export default Trip;
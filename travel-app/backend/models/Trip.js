import mongoose from 'mongoose';

const DestinationSchema = new mongoose.Schema({
  city: String,
  startDate: Date,
  endDate: Date,
  duration: Number,
  places: [{ name: String, price: Number, coordinates: Object }],
  accommodation: { address: String, coordinates: Object, price: Number, bookingLink: String },
});

const TripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tripName: { type: String, required: true },
  country: { type: String, required: true },
  destinations: [DestinationSchema],
}, { timestamps: true });

const Trip = mongoose.model('Trip', TripSchema);

export default Trip;
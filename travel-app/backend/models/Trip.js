import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tripName: { type: String, required: true },
  country: { type: String, required: true },
  destinations: [
    {
      name: String,
      startDate: String,
      endDate: String,
      duration: Number,
      places: [{ name: String, price: Number, coordinates: Object }],
      accommodation: { address: String, coordinates: Object, price: Number, bookingLink: String },
    },
  ],
});

const Trip = mongoose.model('Trip', TripSchema);

export default Trip;
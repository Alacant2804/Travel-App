const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Trip = require('../models/Trip');

// Get all trips for a user
router.get('/', auth, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user });
    res.json(trips);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Add a new trip
router.post('/', auth, async (req, res) => {
  const { tripName, destination, startDate, endDate } = req.body;
  try {
    const newTrip = new Trip({
      tripName,
      destination,
      startDate,
      endDate,
      user: req.user
    });

    const trip = await newTrip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete a trip
router.delete('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    // Check user
    if (trip.user.toString() !== req.user) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await trip.remove();
    res.json({ msg: 'Trip removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;

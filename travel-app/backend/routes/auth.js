import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register a new user
router.post('/sign-up', async (req, res) => {
  const { username, email, password } = req.body;
  console.log('Received registration request:', req.body);
  
  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user instance
    user = new User({
      username,
      email,
      password
    });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    console.log('User password hashed successfully');

    // Save the user to the database
    await user.save();
    console.log('User saved to the database');

    // Create and send a JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('Error signing JWT:', err);
          throw err;
        }
        console.log('User registered successfully, JWT token generated');
        res.status(201).json({ token });
      }
    );
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).send('Server error');
  }
});

export default router;
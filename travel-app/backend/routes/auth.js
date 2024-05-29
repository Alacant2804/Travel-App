import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register a new user
router.post('/sign-up', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    console.log('Received registration request:', req.body);

    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      username,
      email,
      password
    });

    await user.save();

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
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (error) {
    if (error.code === 11000) {
      console.error('Duplicate key error:', error.message);
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    console.error('Error registering user:', error.message);
    res.status(500).send('Server error');
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Received login request:', req.body);

    let user = await User.findOne({ email });
    if (!user) {
      console.log('Invalid credentials - user not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Stored hashed password:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      console.log('Invalid credentials - password mismatch:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

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
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).send('Server error');
  }
});

export default router;
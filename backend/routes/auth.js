import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/auth.js";
import { loginLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

// Fetch authenticated user details
router.get("/user", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({
      success: true,
      message: "User is authenticated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// Register a new user
router.post("/sign-up", async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "Username already exists" });
    }

    user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    user = new User({ username, email, password });

    await user.save();

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (error, token) => {
        if (error) throw error;
        res.status(201).json({ token, user: payload.user });
      }
    );
  } catch (error) {
    next(error);
  }
});

// Login a user
router.post("/login", loginLimiter, async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;

        res.json({ token, user: payload.user });
      }
    );
  } catch (error) {
    next(error);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true });
  res.json({ message: "Logged out successfully" });
});

export default router;

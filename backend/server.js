import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import { fileURLToPath } from "url";
import { errorHandler } from "./middleware/errorHandler.js";
import { globalLimiter } from "./middleware/rateLimit.js";

// Routes import
import authRoutes from "./routes/auth.js";
import accommodationRoutes from "./routes/accommodation.js";
import budgetRoutes from "./routes/budget.js";
import destinationRoutes from "./routes/destination.js";
import flightRoutes from "./routes/flights.js";
import transportationRoutes from "./routes/transportation.js";
import tripRoutes from "./routes/trips.js";
import weatherRoutes from "./routes/weather.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Authorization", "Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize()); // Prevent NoSQL injection
// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP if causing issues
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resource loading
  })
);
app.use(globalLimiter); // Rate limits for API

app.use(express.static(path.join(__dirname, "../client/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/trips/destination", destinationRoutes);
app.use("/api/trips/budget", budgetRoutes);
app.use("/api/trips/transportation", transportationRoutes);
app.use("/api/trips/flights", flightRoutes);
app.use("/api/trips/accommodation", accommodationRoutes);
app.use("/api/trips/weather", weatherRoutes);

app.use(errorHandler);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

console.log("Attempting to connect to MongoDB...");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

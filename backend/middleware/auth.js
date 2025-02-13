import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function auth(req, res, next) {
  // Get token from Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ msg: "Authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Set req.user to decoded user
    next(); // Pass controll to the next middleware / route handler
  } catch (err) {
    res.status(401).json({ msg: "Authorization denied" });
  }
}

export default auth;

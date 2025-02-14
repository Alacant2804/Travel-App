import rateLimit from "express-rate-limit";

// Global rate limiter (100 requests per 15 minutes)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max requests per IP
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
  headers: true, // Sends back rate limit headers
});

// Login rate limiter (5 attempts per 5 minutes)
export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Max 5 login attempts per IP
  handler: (req, res, next) => {
    // Access the rate-limit headers to calculate remaining time
    const resetTime = res.get("X-RateLimit-Reset"); // Get the rate limit reset time in seconds
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const remainingTime = resetTime - currentTime; // Calculate remaining time in seconds

    // Convert remaining time to minutes
    res.status(429).json({
      success: false,
      message: `Too many login attempts. Try again in ${Math.floor(
        remainingTime / 60
      )} minutes.`,
    });
  },
});

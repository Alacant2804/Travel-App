export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      message: err.message || "Internal Server Error",
      error: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
  };
  
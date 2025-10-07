const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // ❌ Wrong MongoDB ID (CastError)
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // ❌ Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // ❌ Mongoose Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((value) => value.message)
      .join(", ");
    err = new ErrorHandler(message, 400);
  }

  // ❌ Invalid JWT Token
  if (err.name === "JsonWebTokenError") {
    const message = "Json Web Token is invalid, Try again";
    err = new ErrorHandler(message, 400);
  }

  // ❌ JWT Token Expired
  if (err.name === "TokenExpiredError") {
    const message = "Json Web Token has expired, Try again";
    err = new ErrorHandler(message, 400);
  }

  // ✅ Finally send response:
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

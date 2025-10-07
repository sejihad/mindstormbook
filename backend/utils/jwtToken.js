const dotenv = require("dotenv");

dotenv.config();

// Create Token and saving in cookie
const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  // Cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Prevent client-side access
    secure: process.env.NODE_ENV === "production", // Only for HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Adjust based on use case
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;

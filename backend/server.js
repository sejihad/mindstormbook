const dotenv = require("dotenv");
const express = require("express");
dotenv.config(); // ✅ Ensure environment variables are loaded first

const app = require("./app");

const cloudinary = require("cloudinary").v2;

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception! Server shutting down...");
  console.error(err);
  process.exit(1);
});

// Database Connection
require("./config/db");

// ✅ Cloudinary Configuration (Check if ENV is loaded)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("API IS WORKING");
});
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

// Handling Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.error("🔥 Unhandled Promise Rejection! Server shutting down...");
  console.error(err);
  server.close(() => process.exit(1));
});

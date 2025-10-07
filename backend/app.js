const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const errorMiddleware = require("./middleware/error");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const user = require("./routes/userRoute");
const blog = require("./routes/blogRoute");
const category = require("./routes/categoryRoute");
const book = require("./routes/bookRoute");
const ship = require("./routes/shipRoute");
const email = require("./routes/emailRoute");
const package = require("./routes/packageRoute");
const stripe = require("./routes/stripeRoute");
const paypal = require("./routes/paypalRoute");
const notification = require("./routes/notificationRoute");
const order = require("./routes/orderRoute");
const { stripeWebhook } = require("./controllers/stripeController");

dotenv.config();
require("./config/passport");

app.use(passport.initialize());
app.post(
  "/api/v1/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);
// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// ✅ File Upload Middleware Fix
app.use(fileUpload());

// ✅ CORS Middleware Fix
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "https://mindstormbook.com",
      "https://www.mindstormbook.com",
    ],
    credentials: true,
  })
);

// API Routes

app.use("/api/v1", user);
app.use("/api/v1", blog);
app.use("/api/v1", category);
app.use("/api/v1", notification);
app.use("/api/v1", ship);
app.use("/api/v1", book);
app.use("/api/v1", package);
app.use("/api/v1", stripe);
app.use("/api/v1", email);
app.use("/api/v1", paypal);
app.use("/api/v1", order);
// Error Middleware
app.use(errorMiddleware);

module.exports = app;

const express = require("express");
const {
  capturePaypalOrder,
  createPaypalCheckoutSession,
} = require("../controllers/paypalController.js");
const { isAuthenticator } = require("../middleware/auth.js");
const router = express.Router();

router.post("/paypal/checkout", isAuthenticator, createPaypalCheckoutSession);

router.post("/paypal/capture", isAuthenticator, capturePaypalOrder);

module.exports = router;

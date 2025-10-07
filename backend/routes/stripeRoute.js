const express = require("express");
const { createCheckoutSession } = require("../controllers/stripeController");
const { isAuthenticator } = require("../middleware/auth");
const router = express.Router();

router.post("/stripe/checkout", isAuthenticator, createCheckoutSession);

module.exports = router;

const express = require("express");
const { sendBulkEmail } = require("../controllers/emailController");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/send-bulk-email",
  isAuthenticator,
  authorizeRoles("admin"),
  sendBulkEmail
);

module.exports = router;

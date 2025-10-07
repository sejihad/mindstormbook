const express = require("express");
const {
  createNotification,
  deleteNotification,
  getNotification,
  updateNotification,
} = require("../controllers/notificationController.js");
const { authorizeRoles, isAuthenticator } = require("../middleware/auth.js");

const router = express.Router();

// Public route - get active notification
router.route("/notification").get(getNotification);

// Admin routes
router
  .route("/admin/notification")
  .post(isAuthenticator, authorizeRoles("admin"), createNotification);

router
  .route("/admin/notification/:id")
  .put(isAuthenticator, authorizeRoles("admin"), updateNotification)
  .delete(isAuthenticator, authorizeRoles("admin"), deleteNotification);
module.exports = router;

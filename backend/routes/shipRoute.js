const express = require("express");

const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const {
  getAllShip,
  getAdminShip,
  createShip,
  updateShip,
  deleteShip,
  getShipDetails,
} = require("../controllers/shipController");

const router = express.Router();
router.get("/ships", getAllShip);
router.get(
  "/admin/ships",
  isAuthenticator,
  authorizeRoles("admin"),
  getAdminShip
);
router.post(
  "/admin/ship/new",
  isAuthenticator,
  authorizeRoles("admin"),
  createShip
);
router
  .route("/admin/ship/:id")
  .put(isAuthenticator, authorizeRoles("admin"), updateShip)
  .delete(isAuthenticator, authorizeRoles("admin"), deleteShip);
router.get("/ship/:id", getShipDetails);
module.exports = router;

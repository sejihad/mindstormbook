const express = require("express");

const passport = require("passport");
const jwt = require("jsonwebtoken");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  googleLoginCallback,
  facebookLoginCallback,
  enableTwoFactor,
  verifyOtp,
  deleteUser,
  getAllUser,
  getSingleUser,
  deleteUserRequest,
  contactUs,
} = require("../controllers/userController");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);

// Google Login Start
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ➤ Google Auth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  googleLoginCallback
);

// Facebook Login Start
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

// ➤ Facebook Auth Callback
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  facebookLoginCallback
);

router.post("/logout", logoutUser);
router.put("/twofactor/toggle", isAuthenticator, enableTwoFactor);

router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.get("/me", isAuthenticator, getUserDetails);
router.put("/password/update", isAuthenticator, updatePassword);
router.put("/me/update", isAuthenticator, updateProfile);
router.post("/me/delete", isAuthenticator, deleteUserRequest);
router.post("/contact/us", contactUs);
router.get(
  "/admin/users",
  isAuthenticator,
  authorizeRoles("admin"),
  getAllUser
);
router
  .route("/admin/user/:id")
  .get(isAuthenticator, authorizeRoles("admin"), getSingleUser)
  .delete(isAuthenticator, authorizeRoles("admin"), deleteUser);
module.exports = router;

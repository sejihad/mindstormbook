const dotenv = require("dotenv");
dotenv.config();
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // ✅ spelling ঠিক
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// ✅ Register User
const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(
      new ErrorHandler("Please provide name, email, and password", 400)
    );
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
  });
});

const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter both email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(
      new ErrorHandler("Account doesn't exist. Please register first.", 404)
    );
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect password. Please try again.", 401));
  }

  // If 2FA is enabled, send OTP instead of logging in directly
  if (user.isTwoFactorEnabled) {
    // ✅ Check if OTP already exists and not expired
    if (user.twoFactorCode && user.twoFactorExpire > Date.now()) {
      // আগের OTP এখনো valid, নতুন না পাঠিয়ে আগেরটাই use করো
      return res.status(200).json({
        success: true,
        message: "OTP already sent to your email. Please check your inbox.",
        twoFactorRequired: true,
        userId: user._id,
      });
    }

    // ❌ আগের OTP নাই বা expire হয়ে গেছে, নতুনটা generate করো
    const otp = crypto.randomInt(100000, 999999).toString();

    user.twoFactorCode = otp;
    user.twoFactorExpire = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    const message = `Your login OTP is ${otp}. It will expire in 5 minutes.`;

    await sendEmail({
      email: user.email,
      subject: "Mind Storm Book Login OTP Code",
      message,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
      twoFactorRequired: true,
      userId: user._id,
    });
  }

  // If 2FA not enabled, login directly
  sendToken(user, 200, res);
});

const verifyOtp = catchAsyncErrors(async (req, res, next) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return next(new ErrorHandler("User ID and OTP are required", 400));
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check if OTP is correct and not expired
  if (
    user.twoFactorCode !== otp ||
    !user.twoFactorExpire ||
    user.twoFactorExpire < Date.now()
  ) {
    return next(new ErrorHandler("Invalid or expired OTP", 401));
  }

  // Clear OTP fields after successful verification
  user.twoFactorCode = null;
  user.twoFactorExpire = null;
  await user.save();

  sendToken(user, 200, res);
});

// ✅ Enable or Disable Two-Factor Authentication
const enableTwoFactor = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  user.isTwoFactorEnabled = !user.isTwoFactorEnabled;
  await user.save();

  res.status(200).json({
    success: true,
    message: `Two Factor ${
      user.isTwoFactorEnabled ? "enabled" : "disabled"
    } successfully`,
    user,
  });
});

const googleLoginCallback = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(
      new ErrorHandler("Google authentication failed. Please try again.", 401)
    );
  }

  const token = user.getJWTToken();

  // Cookie set করা
  res.cookie("token", token, {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  // ফ্রন্টএন্ডে redirect, token URL param হিসেবে পাঠানো
  res.redirect(`${process.env.FRONTEND_URL}/google-success?token=${token}`);
});

const facebookLoginCallback = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(
      new ErrorHandler("Facebook authentication failed. Please try again.", 401)
    );
  }

  const token = user.getJWTToken();

  // Cookie set করা
  res.cookie("token", token, {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  // ফ্রন্টএন্ডে redirect, token URL param হিসেবে পাঠানো
  res.redirect(`${process.env.FRONTEND_URL}/facebook-success?token=${token}`);
});

// ✅ Logout User
const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// ✅ Forgot Password
const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your password reset token is:\n\n${resetPasswordUrl}\n\nIf you did not request this, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Mind Storm Book Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorHandler("Email could not be sent. Please try again later.", 500)
    );
  }
});

// ✅ Reset Password
const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset Password Token is invalid or has expired", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// ✅ Get User Details
const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// update profile
const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, number, avatar, country } = req.body;

  const newUserData = { name, number, country };

  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Avatar update
  if (avatar) {
    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    const uploaded = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${avatar}`,
      {
        folder: "book/avatars",
        width: 150,
        crop: "scale",
      }
    );

    newUserData.avatar = {
      public_id: uploaded.public_id,
      url: uploaded.secure_url,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
});

// ✅ Update Password
const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  if (user.avatar && user.avatar.public_id) {
    try {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    } catch (err) {
      console.error("Cloudinary Deletion Error:", err);
    }
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

const getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});
const getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

const deleteUserRequest = catchAsyncErrors(async (req, res, next) => {
  const { name, email, report } = req.body;
  const id = req.user._id;
  if (!email || !report || !name) {
    return next(new ErrorHandler("Please enter name, email and report", 400));
  }

  const message = `User Delete Request\n\nName: ${name}\nEmail: ${email}\nUser ID: ${id}\n\nReport: ${report}`;

  await sendEmail({
    email: process.env.SMTP_MAIL,
    subject: "Account Delete Request",
    message,
  });

  return res.status(200).json({
    success: true,
  });
});
const contactUs = catchAsyncErrors(async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!email || !message || !name) {
    return next(new ErrorHandler("Please enter name, email and report", 400));
  }

  const messageSent = `Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`;

  await sendEmail({
    email: process.env.SMTP_MAIL,
    subject: "Contact User",
    message: messageSent,
  });

  return res.status(200).json({
    success: true,
  });
});
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  contactUs,
  getSingleUser,
  getUserDetails,
  updatePassword,
  getAllUser,
  googleLoginCallback,
  facebookLoginCallback,
  updateProfile,
  enableTwoFactor,
  verifyOtp,
  deleteUserRequest,
  deleteUser,
};

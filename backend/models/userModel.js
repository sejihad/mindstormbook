const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [2, "Name should have more than 2 characters"],
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },

  number: {
    type: String,
  },
  country: {
    type: String,
  },

  password: {
    type: String,
    minLength: [6, "Password should be greater than 6 characters"],
    select: false,
  },
  isTwoFactorEnabled: {
    type: Boolean,
    default: true,
  },
  twoFactorCode: String,
  twoFactorExpire: Date,
  avatar: {
    public_id: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: "/Profile.png",
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  provider: {
    type: String,
    enum: ["local", "google", "facebook"],
    default: "local",
  },
  googleId: {
    type: String,
    default: null,
  },
  facebookId: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Password Hash Middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Reset Token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);

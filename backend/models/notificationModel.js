const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Notification text is required"],
    trim: true,
    maxlength: [200, "Notification text cannot exceed 200 characters"],
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
notificationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Notification", notificationSchema);

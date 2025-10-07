const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const Notification = require("../models/notificationModel.js");
const ErrorHandler = require("../utils/errorHandler.js");

// Create new notification => /api/v1/admin/notification
const createNotification = catchAsyncErrors(async (req, res, next) => {
  const { text, isActive } = req.body;

  // Check if a notification already exists
  const existingNotification = await Notification.findOne();

  if (existingNotification) {
    return next(
      new ErrorHandler(
        "Notification already exists. Please update the existing one.",
        400
      )
    );
  }

  const notification = await Notification.create({
    text,
    isActive: isActive || false,
  });

  res.status(201).json({
    success: true,
    notification,
  });
});

// Get notification => /api/v1/notification
const getNotification = catchAsyncErrors(async (req, res, next) => {
  const notification = await Notification.findOne();

  if (!notification) {
    return res.status(200).json({
      success: true,
      notification: null,
    });
  }

  res.status(200).json({
    success: true,
    notification,
  });
});

// Update notification => /api/v1/admin/notification/:id
const updateNotification = catchAsyncErrors(async (req, res, next) => {
  let notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorHandler("Notification not found", 404));
  }

  notification = await Notification.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    notification,
  });
});

// Delete notification => /api/v1/admin/notification/:id
const deleteNotification = catchAsyncErrors(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorHandler("Notification not found", 404));
  }

  await notification.deleteOne();

  res.status(200).json({
    success: true,
    message: "Notification deleted successfully",
  });
});

module.exports = {
  deleteNotification,
  updateNotification,
  getNotification,
  createNotification,
};

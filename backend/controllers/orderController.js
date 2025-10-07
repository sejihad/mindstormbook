const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// get Single Order
const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  console.log(order);
  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  // Check if the order belongs to the logged-in user
  if (order.user.id.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to view this order", 403)
    );
  }

  res.status(200).json({
    success: true,
    order,
  });
});
const getSingleAdminOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  console.log(order);
  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
const myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ "user.id": req.user._id }).sort({
    createdAt: -1,
  });
  res.status(200).json({
    success: true,

    orders,
  });
});
// get all Orders -- Admin
const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Order Status -- Admin
const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  order.order_status = req.body.status;

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

// delete Order -- Admin
const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
  });
});
module.exports = {
  myOrders,
  getSingleOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getSingleAdminOrder,
};

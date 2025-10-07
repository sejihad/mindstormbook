const Ship = require("../models/shipModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const getAllShip = catchAsyncErrors(async (req, res, next) => {
  const ships = await Ship.find();

  res.status(200).json({
    success: true,
    ships,
  });
});

const getAdminShip = catchAsyncErrors(async (req, res, next) => {
  const ships = await Ship.find();

  res.status(200).json({
    success: true,
    ships,
  });
});
const createShip = catchAsyncErrors(async (req, res, next) => {
  const ship = await Ship.create(req.body);

  res.status(201).json({
    success: true,
    ship,
  });
});

const getShipDetails = catchAsyncErrors(async (req, res, next) => {
  let ship = await Ship.findById(req.params.id);

  if (!ship) {
    return next(new ErrorHandler("Shipped not found", 404));
  }

  res.status(200).json({ success: true, ship });
});
const updateShip = catchAsyncErrors(async (req, res, next) => {
  let ship = await Ship.findById(req.params.id);

  if (!ship) {
    return next(new ErrorHandler("Shipped not found", 404));
  }

  const updatedData = {};
  if (req.body.country) updatedData.country = req.body.country;
  if (req.body.charge) updatedData.charge = req.body.charge;
  ship = await Ship.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    ship,
  });
});

const deleteShip = catchAsyncErrors(async (req, res, next) => {
  const ship = await Ship.findById(req.params.id);

  if (!ship) {
    return next(new ErrorHandler("Shipped not found", 404));
  }

  await Ship.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Shipped deleted successfully",
  });
});

module.exports = {
  createShip,
  getAllShip,
  getAdminShip,
  getShipDetails,
  updateShip,
  deleteShip,
};

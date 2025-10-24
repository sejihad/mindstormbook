const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: String,
    city: String,
    state: String,
    country: String,
    pinCode: Number,
    phone: String, // Add this
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      books: [],
    },
  ],
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    email: String,
    number: String,
    country: String,
  },

  itemsPrice: {
    type: Number,

    default: 0,
  },

  shippingPrice: {
    type: Number,

    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },

  order_status: {
    type: String,
    enum: ["pending", "in progress", "completed", "cancelled"],
    default: "pending",
  },
  order_type: {
    type: String,
    enum: ["book", "ebook", "audiobook", "package", "mixed"],
  },
  payment: {
    method: {
      type: String,
      enum: ["stripe", "paypal"],
      required: true,
    },
    transactionId: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "cancel", "paid"],
      default: "pending",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);

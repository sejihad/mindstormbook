const dotenv = require("dotenv");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Book = require("../models/bookModel");
const Package = require("../models/packageModel");
const paypal = require("@paypal/checkout-server-sdk");

dotenv.config();

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
// const environment = new paypal.core.LiveEnvironment(
//   process.env.PAYPAL_CLIENT_ID, // Use LIVE PayPal Client ID
//   process.env.PAYPAL_CLIENT_SECRET // Use LIVE PayPal Secret
// );
const client = new paypal.core.PayPalHttpClient(environment);

// Helper function to determine order type
const determineOrderType = (orderItems) => {
  const uniqueTypes = [...new Set(orderItems.map((item) => item.type))];
  if (uniqueTypes.length === 1) {
    return uniqueTypes[0]; // "ebook", "book", or "package"
  }
  return "mixed"; // multiple types in order
};

// Function to fetch complete item details
const getItemDetails = async (items) => {
  const detailedItems = await Promise.all(
    items.map(async (item) => {
      try {
        if (
          item.type === "book" ||
          item.type === "ebook" ||
          item.type === "audiobook"
        ) {
          const book = await Book.findById(item.id).select(
            "name discountPrice image type"
          );
          return {
            id: item.id,
            type: item.type,
            quantity: item.quantity,
            name: book?.name,
            price: book?.discountPrice,
            image: book?.image?.url,
          };
        } else if (item.type === "package") {
          const package = await Package.findById(item.id).select(
            "name discountPrice image type"
          );
          return {
            id: item.id,
            type: item.type,
            quantity: item.quantity,
            name: package?.name,
            price: package?.discountPrice,
            image: package?.image?.url,
          };
        }
        return item; // fallback
      } catch (error) {
        return item; // return basic info if error occurs
      }
    })
  );
  return detailedItems;
};

// Create PayPal Checkout Session
const createPaypalCheckoutSession = async (req, res, next) => {
  try {
    const { shippingInfo, orderItems, itemsPrice, shippingPrice, totalPrice } =
      req.body;

    const orderType = determineOrderType(orderItems); // ✅ assign করা হলো
    const digitalTypes = ["ebook", "audiobook"];
    const isEbookOnly = digitalTypes.includes(orderType); // এখন ঠিক

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: Number(totalPrice).toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: Number(itemsPrice).toFixed(2),
              },
              shipping: {
                currency_code: "USD",
                value: isEbookOnly ? "0.00" : Number(shippingPrice).toFixed(2),
              },
            },
          },
          description: "Book Store Order Payment",
        },
      ],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/paypal-success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      },
    });

    const order = await client.execute(request);

    // Store complete metadata in your database or session
    req.session = req.session || {};
    req.session[order.result.id] = {
      userId: req.user._id.toString(),
      shippingInfo: isEbookOnly ? {} : shippingInfo,
      orderItems: JSON.stringify(orderItems), // Store minimal items
      itemsPrice: itemsPrice.toString(),
      shippingPrice: isEbookOnly ? "0" : shippingPrice.toString(),
      totalPrice: totalPrice.toString(),
      orderType: orderType,
    };

    res.status(200).json({ id: order.result.id });
  } catch (err) {
    console.error("❌ PayPal order creation failed:", err);
    next(err);
  }
};

// Capture PayPal Payment
const capturePaypalOrder = async (req, res) => {
  const { orderID } = req.body;

  try {
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
    const capture = await client.execute(request);

    const transactionId =
      capture.result.purchase_units[0]?.payments?.captures?.[0]?.id;
    if (!transactionId) {
      return res.status(400).json({ message: "Invalid PayPal transaction" });
    }

    // Retrieve metadata from session or DB
    const metadata = req.session?.[orderID];
    if (!metadata) {
      return res.status(400).json({ message: "Order metadata not found" });
    }

    const {
      userId,
      shippingInfo,
      orderItems,
      itemsPrice,
      shippingPrice,
      totalPrice,
      orderType,
    } = metadata;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent duplicate order
    const existingOrder = await Order.findOne({
      "payment.transactionId": transactionId,
    });
    if (existingOrder) {
      return res.status(200).json({ message: "Order already exists" });
    }

    // Parse session metadata
    const minimalOrderItems = JSON.parse(orderItems);
    const parsedShippingInfo = JSON.parse(shippingInfo);
    const digitalTypes = ["ebook", "audiobook"];
    const isEbookOnly = digitalTypes.includes(orderType);

    // Fetch complete item details from appropriate models
    const completeOrderItems = await getItemDetails(minimalOrderItems);

    const newOrder = new Order({
      user: {
        id: user._id,
        name: user.name,
        email: user.email || "",
        number: user.number || "",
        country: user.country || "",
      },
      shippingInfo: isEbookOnly ? {} : parsedShippingInfo,
      orderItems: completeOrderItems,
      itemsPrice: Number(itemsPrice),
      shippingPrice: isEbookOnly ? 0 : Number(shippingPrice),
      totalPrice: Number(totalPrice),
      payment: {
        method: "paypal",
        transactionId,
        status: "paid",
      },
      order_type: orderType,
      order_status: isEbookOnly ? "completed" : "pending",
    });

    await newOrder.save();

    // Clean up session data
    if (req.session) {
      delete req.session[orderID];
    }

    res.status(200).json({ message: "✅ PayPal order saved successfully" });
  } catch (err) {
    console.error("❌ PayPal capture error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createPaypalCheckoutSession,
  capturePaypalOrder,
};

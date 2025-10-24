const dotenv = require("dotenv");
const Stripe = require("stripe");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Book = require("../models/bookModel");
const Package = require("../models/packageModel");

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
          const package = await Package.findById(item.id)
            .populate("books", "name discountPrice image type") // populate books array
            .select("name discountPrice image type books");

          return {
            id: item.id,
            type: item.type,
            quantity: item.quantity,
            name: package?.name,
            price: package?.discountPrice,
            image: package?.image?.url,
            books: package?.books || [], // এখানে books array include
          };
        }
        return item; // fallback
      } catch (error) {
        return item; // return minimal info if error
      }
    })
  );
  return detailedItems;
};

// Create Checkout Session
const createCheckoutSession = async (req, res, next) => {
  try {
    const { shippingInfo, orderItems, itemsPrice, shippingPrice, totalPrice } =
      req.body;

    const orderType = determineOrderType(orderItems); // add this line
    const digitalTypes = ["ebook", "audiobook"];
    const isEbookOnly = digitalTypes.includes(orderType);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Order Payment",
            },
            unit_amount: Math.round(Number(totalPrice) * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: req.user._id.toString(),
        shippingInfo: JSON.stringify(isEbookOnly ? {} : shippingInfo),
        orderItems: JSON.stringify(orderItems), // Still send minimal items here
        itemsPrice: itemsPrice.toString(),
        shippingPrice: isEbookOnly ? "0" : shippingPrice.toString(),
        totalPrice: totalPrice.toString(),
        orderType: orderType,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

// Stripe Webhook
const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Prevent duplicate order
    const existingOrder = await Order.findOne({
      "payment.transactionId": session.payment_intent,
    });

    if (existingOrder) {
      return res.status(200).send("Order already exists");
    }

    const user = await User.findById(session.metadata.userId);
    if (!user) return res.status(404).send("User not found");

    // Parse session metadata
    const minimalOrderItems = JSON.parse(session.metadata.orderItems);
    const shippingInfo = JSON.parse(session.metadata.shippingInfo);
    const itemsPrice = Number(session.metadata.itemsPrice);
    const shippingPrice = Number(session.metadata.shippingPrice);
    const totalPrice = Number(session.metadata.totalPrice);
    const orderType = session.metadata.orderType;
    const digitalTypes = ["ebook", "audiobook"];
    const isEbookOnly = digitalTypes.includes(orderType);

    // Fetch complete item details from appropriate models
    const completeOrderItems = await getItemDetails(minimalOrderItems);

    // Create Order with complete item details
    const order = new Order({
      user: {
        id: user._id,
        name: user.name,
        email: user.email || "",
        number: user.number || "",
        country: user.country || "",
      },
      shippingInfo: isEbookOnly ? {} : shippingInfo,
      orderItems: completeOrderItems,
      itemsPrice: itemsPrice,
      shippingPrice: isEbookOnly ? 0 : shippingPrice,
      totalPrice: totalPrice,
      payment: {
        method: "stripe",
        transactionId: session.payment_intent,
        status: "paid",
      },
      order_type: orderType,
      order_status: isEbookOnly ? "completed" : "pending",
    });

    await order.save();
    return res.status(200).send("Order created");
  }

  res.status(200).send("Webhook received");
};

module.exports = {
  createCheckoutSession,
  stripeWebhook,
};

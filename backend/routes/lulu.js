// routes/print.js - CORRECTED
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config({ path: path.join(__dirname, "../.env") });

const router = express.Router();

// Create Lulu print order
router.post("/print/create-lulu-order", async (req, res) => {
  try {
    const orderData = req.body;
    console.log("📦 Received order data:", typeof orderData);

    // ✅ Step 1: Get Lulu API token
    console.log("🔑 Getting Lulu token...");

    const tokenResponse = await axios.post(
      "https://api.lulu.com/auth/realms/glasstree/protocol/openid-connect/token",
      new URLSearchParams({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          // ✅ FIX: Add "Basic " prefix
          Authorization: `${process.env.LULU_ENCODE}`,
        },
      }
    );

    const token = tokenResponse.data.access_token;
    console.log("✅ Token received");

    // ✅ Step 2: Prepare complete Lulu data
    const luluOrderData = {
      contact_email: orderData.contact_email,
      external_id: orderData.external_id || `order-${Date.now()}`,
      line_items: orderData.line_items.map((item) => ({
        external_id: item.external_id,
        printable_normalization: {
          cover: {
            source_url: item.printable_normalization?.cover?.source_url,
          },
          interior: {
            source_url: item.printable_normalization?.interior?.source_url,
          },
          pod_package_id: item.printable_normalization?.pod_package_id,
        },
        quantity: item.quantity,
        title: item.title,
      })),
      production_delay: orderData.production_delay, // ✅ Required field
      shipping_address: {
        city: orderData.shipping_address?.city,
        country_code: orderData.shipping_address?.country_code,
        name: orderData.shipping_address?.name,
        phone_number: orderData.shipping_address?.phone_number,
        postcode: orderData.shipping_address?.postcode,
        state_code: orderData.shipping_address?.state_code,
        street1: orderData.shipping_address?.street1,
      },
      shipping_level: "EXPRESS",
    };

    console.log(
      "🚀 Sending to Lulu API:",
      JSON.stringify(luluOrderData, null, 2)
    );

    // ✅ Step 3: Create Lulu order
    const orderResponse = await axios.post(
      "https://api.lulu.com/print-jobs/",
      luluOrderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Lulu order created successfully:", orderResponse.data);

    res.status(200).json({
      success: true,
      order: orderResponse.data,
    });
  } catch (error) {
    console.error("❌ Lulu API error:");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }

    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || error.message,
      details: error.response?.data || null,
    });
  }
});

module.exports = router;

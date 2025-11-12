const axios = require("axios");

(async () => {
  try {
    const orderData = {
      PartnerID: 123, // আপনার actual PartnerID
      Partner: {
        OriginCountry: {
          Id: 44,
          Name: "United Kingdom",
          ISO_Code: "GB",
          Zone: {
            ZoneId: 1,
            ZoneName: "Europe",
          },
          PostcodeFormat: "AA1 1AA",
          EU: false,
          RequiredPostcode: true,
        },
      },
      Status: "Draft",
      DocRef: "DOC-" + Date.now(),
      CustRef: "CUST-" + Date.now(),
      CustRef2: "",
      PassedTo: 0,
      Dispatch: {},
      DispatchRequest: {
        RequestedServID: [101],
        RequestedService: "Quickest",
      },
      CharityRoundup: false,
      Sustainability: {
        OffsetOrder: true,
        AdditionalTrees: 0,
        AdditionalTreeCost: 0,
      },
      CustomsDeclaration: {
        DeclaredValue: 100,
        HSCode: "490199",
        UseIOSS: false,
        IossID: 0,
        IncoTerms: "DAP",
      },
      Notifications: {
        NotifyCustomer: true,
      },
      BulkInfo: {
        Progress: {},
      },
      OrderCost: {
        Subtotal: 100,
        Shipping: 10,
        Tax: 5,
        Total: 115,
      },
      PromoCode: "",
      ProductionLevel: "Standard",
      Tracking: {
        Mapping3: "TRACK-" + Date.now(),
      },
      Progress: {},
      DispatchDocUploadID: 0,
      Address: {
        Addressee: "John Smith",
        VATNumber: "",
        Company: "Test Company",
        Address1: "123 Main Street",
        Address2: "",
        Address3: "",
        Address4: "",
        Town: "London",
        County: "Greater London",
        Postcode: "SW1A 1AA",
        Country: {
          Id: 44,
          Name: "United Kingdom",
          ISO_Code: "GB",
          Zone: {
            ZoneId: 1,
            ZoneName: "Europe",
          },
          PostcodeFormat: "AA1 1AA",
          EU: false,
          RequiredPostcode: true,
        },
        TelNumber: "+441234567890",
        Email: "john.smith@example.com",
      },
      OrderLines: [
        {
          LineNumber: 1,
          ISBN: "9783161484100",
          Title: {
            Status: {},
            Volumes: {
              HasVolumes: false,
              Children: [],
              Box: {},
            },
            TitleType: "Standard",
          },
          Quantity: 1,
          TempID: "TEMP-" + Date.now(),
          LineProgress: {},
        },
      ],
    };

    console.log("📦 Sending order data:", JSON.stringify(orderData, null, 2));

    const response = await axios.get(
      "https://api.bookvault.app/v3/account",

      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `basic bv_TwRMhSI5NrWIYzxgNlzSYDUlcXHKI`,
        },
        timeout: 30000,
      }
    );

    console.log("✅ Order Created Successfully!");
    console.log("Response:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ BookVAULT API Error:");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);

      if (error.response.data) {
        console.error(
          "Error Data:",
          JSON.stringify(error.response.data, null, 2)
        );

        // Try to get more specific error message
        if (error.response.data.Message) {
          console.error("Error Message:", error.response.data.Message);
        }
        if (error.response.data.StackTrace) {
          console.error("Stack Trace:", error.response.data.StackTrace);
        }
      }
    } else if (error.request) {
      console.error("No response received - Network error");
    } else {
      console.error("Error:", error.message);
    }
  }
})();

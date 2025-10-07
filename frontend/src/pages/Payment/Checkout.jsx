import { Country } from "country-state-city";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { paypalOrderCreate } from "../../actions/paypalAction";
import { getShips } from "../../actions/shipAction";
import { stripeOrderCreate } from "../../actions/stripeAction";
import MetaData from "../../component/layout/MetaData";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Safely get location state with defaults
  const { cartItems = [] } = location.state || {};

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { ships } = useSelector((state) => state.ships);

  // Determine order type
  const determineOrderType = () => {
    const uniqueTypes = [...new Set(cartItems.map((item) => item.type))];
    return uniqueTypes.length === 1 ? uniqueTypes[0] : "mixed";
  };

  const orderType = determineOrderType();
  const isEbookOnly = orderType === "ebook" || "audiobook";
  const requiresShipping = !isEbookOnly;

  // Calculate total price
  const totalPrice = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  // Shipping state
  const [shippingInfo, setShippingInfo] = useState(
    requiresShipping
      ? {
          address: "",
          city: "",
          state: "",
          country: "",
          pinCode: "",
          phone: "",
        }
      : {}
  );

  const [selectedCountry, setSelectedCountry] = useState("");
  const [shippingCharge, setShippingCharge] = useState(0);
  const [isShippingAvailable, setIsShippingAvailable] =
    useState(requiresShipping);
  const [isFormComplete, setIsFormComplete] = useState(!requiresShipping);
  const [isLoading, setIsLoading] = useState(true);

  // Check if all required fields are filled
  useEffect(() => {
    if (!requiresShipping) {
      setIsFormComplete(true);
      return;
    }

    const requiredFields = [
      shippingInfo.address,
      shippingInfo.city,
      shippingInfo.state,
      shippingInfo.country,
      shippingInfo.pinCode,
      shippingInfo.phone,
    ];
    setIsFormComplete(
      requiredFields.every((field) => field && field.trim() !== "") &&
        isShippingAvailable
    );
  }, [shippingInfo, isShippingAvailable, requiresShipping]);

  // Load shipping data on mount (only if shipping required)
  useEffect(() => {
    if (!requiresShipping) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        await dispatch(getShips());
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to load shipping data");
        setIsLoading(false);
      }
    };
    loadData();
  }, [dispatch, requiresShipping]);

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      toast.info("Please login to proceed with checkout");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (requiresShipping && (!user?.country || !user?.number)) {
      toast.info("Complete Your Profile");
      navigate("/profile/update");
    }
  }, [isAuthenticated, user, navigate, location.pathname, requiresShipping]);

  // Handle country change (only if shipping required)
  useEffect(() => {
    if (!requiresShipping || !selectedCountry) return;

    try {
      const countryData = Country.getCountryByCode(selectedCountry);
      if (!countryData) return;

      setShippingInfo((prev) => ({
        ...prev,
        country: countryData.name || "",
      }));

      // Check shipping availability
      const shipInfo = ships.find(
        (ship) => ship.country.toLowerCase() === countryData.name.toLowerCase()
      );

      setShippingCharge(shipInfo?.charge || 0);
      setIsShippingAvailable(!!shipInfo);
    } catch (error) {
      console.error("Country data error:", error);
      toast.error("Error loading country data");
    }
  }, [selectedCountry, ships, requiresShipping]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e, paymentMethod) => {
    e.preventDefault();

    // Validate form completion (only if shipping required)
    if (requiresShipping && !isFormComplete) {
      toast.error("Please fill all shipping fields correctly");
      return;
    }

    // Prepare order items with only required fields
    const orderItems = cartItems.map((item) => ({
      id: item.id,
      type: item.type,
      quantity: item.quantity,
    }));

    const orderData = {
      shippingInfo: requiresShipping ? shippingInfo : {},
      orderItems,
      itemsPrice: totalPrice,
      shippingPrice: requiresShipping ? shippingCharge : 0,
      totalPrice: requiresShipping ? totalPrice + shippingCharge : totalPrice,
      paymentMethod,
    };

    // Dispatch appropriate payment action
    if (paymentMethod === "stripe") {
      dispatch(stripeOrderCreate(orderData));
    } else {
      dispatch(paypalOrderCreate(orderData));
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading checkout data...</div>;
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <>
      <MetaData title="Checkout" />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isEbookOnly ? "Complete Your Purchase" : "Shipping & Payment"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Shipping Form - Only shown when shipping required */}
          {requiresShipping && (
            <div className="md:col-span-2 bg-white rounded shadow-md p-6">
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Billing Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Country</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Select Country</option>
                    {Country.getAllCountries().map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Post Code</label>
                  <input
                    type="text"
                    name="pinCode"
                    value={shippingInfo.pinCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>

                {!isShippingAvailable && (
                  <div className="mb-4 text-red-600">
                    Sorry, we don't ship to{" "}
                    {shippingInfo.country || "your selected country"} at this
                    time.
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Payment buttons */}
          <div className={`${!requiresShipping ? "md:col-span-3" : ""}`}>
            <div className="mt-6 p-6 bg-white shadow-md rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
                Choose Payment Method
              </h2>

              <div className="flex flex-col space-y-4">
                <button
                  onClick={(e) => handlePayment(e, "stripe")}
                  disabled={!isFormComplete}
                  className={`w-full py-3 px-4 rounded-md text-lg font-medium transition-all duration-300 ${
                    isFormComplete
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  💳 Pay with Stripe
                </button>

                <button
                  onClick={(e) => handlePayment(e, "paypal")}
                  disabled={!isFormComplete}
                  className={`w-full py-3 px-4 rounded-md text-lg font-medium transition-all duration-300 ${
                    isFormComplete
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  🅿️ Pay with PayPal
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded shadow-md p-6 h-fit">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <p className="text-sm text-gray-600 mb-2">
              Order Type: {orderType}
            </p>

            <div className="divide-y">
              {cartItems.map((item, i) => (
                <div key={i} className="py-3 flex justify-between">
                  <div>
                    <p className="font-medium">{item.name || item.title}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} × ${item.price.toFixed(2)} ({item.type})
                    </p>
                  </div>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              {requiresShipping && (
                <>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>
                      {isShippingAvailable
                        ? `$${shippingCharge.toFixed(2)}`
                        : "Not Available"}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total:</span>
                <span>
                  {requiresShipping
                    ? isShippingAvailable
                      ? `$${(totalPrice + shippingCharge).toFixed(2)}`
                      : "N/A"
                    : `$${totalPrice.toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;

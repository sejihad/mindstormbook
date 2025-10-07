import { useEffect } from "react";
import {
  FaBox,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaShippingFast,
  FaTimesCircle,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { clearErrors, getOrderDetails } from "../../actions/orderAction";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { order, loading, error } = useSelector((state) => state.orderDetails);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <FaCheckCircle className="text-green-500 inline mr-2" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500 inline mr-2" />;
      default:
        return <FaClock className="text-yellow-500 inline mr-2" />;
    }
  };

  const getPaymentIcon = (method) => {
    switch (method?.toLowerCase()) {
      case "stripe":
        return <FaCreditCard className="text-blue-500 inline mr-2" />;
      case "paypal":
        return <FaCreditCard className="text-blue-400 inline mr-2" />;
      default:
        return <FaCreditCard className="text-gray-500 inline mr-2" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "ebook":
        return <FaCreditCard className="text-purple-500 inline mr-2" />;
      case "audiobook":
        return <FaCreditCard className="text-purple-500 inline mr-2" />;
      case "book":
        return <FaBox className="text-brown-500 inline mr-2" />;
      case "package":
        return <FaShippingFast className="text-orange-500 inline mr-2" />;
      default:
        return <FaBox className="text-gray-500 inline mr-2" />;
    }
  };

  if (loading || !order) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8 min-h-[100vh]">
      <MetaData title={`Order #${order?._id?.slice(-6) || ""}`} />

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Order Details #{order?._id?.slice(-6)?.toUpperCase() || ""}
          </h1>
          <Link
            to="/orders"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Orders
          </Link>
        </div>
        {order && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Order Summary Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {getStatusIcon(order.order_status)}
                    Order Status
                  </h3>
                  <p
                    className={`text-lg ${
                      order.order_status === "completed"
                        ? "text-green-600"
                        : order.order_status === "cancelled"
                        ? "text-red-600"
                        : "text-yellow-600"
                    } font-semibold`}
                  >
                    {order.order_status}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {getPaymentIcon(order.payment?.method)}
                    Payment Method
                  </h3>
                  <p className="text-lg text-gray-700 capitalize">
                    {order.payment?.method}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Status:{" "}
                    <span
                      className={
                        order.payment?.status === "paid"
                          ? "text-green-600"
                          : order.payment?.status === "cancel"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }
                    >
                      {order.payment?.status}
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {getTypeIcon(order.order_type)}
                    Order Type
                  </h3>
                  <p className="text-lg text-gray-700 capitalize">
                    {order.order_type}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer and Shipping Info */}
            <div className="p-6 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Name:</span>{" "}
                    {order.user?.name}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span>{" "}
                    {order.user?.email}
                  </p>
                  {order.user?.number && (
                    <p className="text-gray-700">
                      <span className="font-medium">Phone:</span>{" "}
                      {order.user.number}
                    </p>
                  )}
                </div>
              </div>

              {/* Shipping Info - Only show for non-ebook orders */}
              {order.order_type !== "ebook" ||
                ("audiobook" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Shipping Information
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Address:</span>{" "}
                        {order.shippingInfo?.address}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">City:</span>{" "}
                        {order.shippingInfo?.city}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">State:</span>{" "}
                        {order.shippingInfo?.state}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Country:</span>{" "}
                        {order.shippingInfo?.country}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">PIN Code:</span>{" "}
                        {order.shippingInfo?.pinCode}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Phone:</span>{" "}
                        {order.shippingInfo?.phone}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Payment Info */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Payment Information
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Transaction ID:</span>{" "}
                  {order.payment?.transactionId}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Items Price:</span> $
                  {order.itemsPrice?.toFixed(2)}
                </p>
                {order.order_type !== "ebook" ||
                  ("audiobook" && (
                    <p className="text-gray-700">
                      <span className="font-medium">Shipping Price:</span> $
                      {order.shippingPrice?.toFixed(2)}
                    </p>
                  ))}
                <p className="text-gray-700 font-bold">
                  <span className="font-medium">Total Paid:</span> $
                  {order.totalPrice?.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Order Items */}
            {/* Order Items */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Order Items
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.orderItems?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded"
                                src={item.image}
                                alt={item.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {item.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full 
                ${
                  item.type === "ebook" || "audiobook"
                    ? "bg-purple-100 text-purple-800"
                    : item.type === "book"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-orange-100 text-orange-800"
                }`}
                          >
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;

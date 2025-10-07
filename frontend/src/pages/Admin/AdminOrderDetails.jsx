import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import {
  FaBox,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaShippingFast,
  FaTimesCircle,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearErrors,
  getAdminOrderDetails,
  updateOrder,
} from "../../actions/orderAction";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";
import Sidebar from "./Sidebar";

const AdminOrderDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [status, setStatus] = useState("");

  const { order, loading, error } = useSelector((state) => state.orderDetails);
  const { isUpdated, error: updateError } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAdminOrderDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      toast.success("Order Updated Successfully");
      dispatch({ type: "UPDATE_ORDER_RESET" });
      navigate("/admin/orders");
    }
  }, [dispatch, error, updateError, isUpdated, navigate]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <FaCheckCircle className="text-indigo-500 inline mr-2" />;
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

  const updateOrderHandler = (e) => {
    e.preventDefault();
    dispatch(updateOrder(id, { status }));
  };

  const generatePDF = () => {
    // Initialize jsPDF
    const doc = new jsPDF();

    // Add logo (replace with your actual logo)
    // For now using text logo
    doc.setFontSize(24);
    doc.setTextColor(41, 128, 185);
    doc.text("Mind Storm Books Shop", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Your One Stop Book Destination", 105, 28, { align: "center" });

    // Add separator line
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Invoice title
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("ORDER INVOICE", 105, 45, { align: "center" });

    // Order details
    doc.setFontSize(10);
    doc.text(`Order ID: ${order._id}`, 20, 55);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 60);
    doc.text(`Status: ${order.order_status}`, 20, 65);
    doc.text(`Type: ${order.order_type}`, 20, 70);
    doc.text(
      `Payment: ${order.payment?.method} (${order.payment?.status})`,
      20,
      75
    );

    // Customer information
    doc.setFontSize(12);
    doc.text("CUSTOMER INFORMATION", 20, 85);
    doc.setFontSize(10);
    doc.text(`User ID: ${order.user?.id}`, 20, 91); // Added User ID here
    doc.text(`Name: ${order.user?.name}`, 20, 96);
    doc.text(`Email: ${order.user?.email}`, 20, 101);

    if (order.user?.number) {
      doc.text(`Phone: ${order.user.number}`, 20, 106);
    }
    if (order.user?.country) {
      doc.text(`Country: ${order.user.country}`, 20, 111);
    }

    // Shipping information (for non-ebook orders)
    if (order.order_type !== "ebook" || ("audiobook" && order.shippingInfo)) {
      doc.setFontSize(12);
      doc.text("SHIPPING INFORMATION", 20, 121);
      doc.setFontSize(10);
      doc.text(`Address: ${order.shippingInfo.address}`, 20, 127);
      doc.text(`City: ${order.shippingInfo.city}`, 20, 132);
      doc.text(`State: ${order.shippingInfo.state}`, 20, 137);
      doc.text(`Country: ${order.shippingInfo.country}`, 20, 142);
      doc.text(`PIN Code: ${order.shippingInfo.pinCode}`, 20, 147);
      doc.text(`Phone: ${order.shippingInfo.phone}`, 20, 152);
    }

    // Order items table
    autoTable(doc, {
      head: [["Product", "Type", "Price", "Qty", "Subtotal"]],
      body: order.orderItems.map((item) => [
        item.name,
        item.type, // Add type column
        `$${item.price.toFixed(2)}`,
        item.quantity,
        `$${(item.price * item.quantity).toFixed(2)}`,
      ]),
      startY:
        order.order_type === "ebook" || "audiobook"
          ? order.user?.country
            ? 165
            : 160
          : 170,
      theme: "grid",
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        1: { cellWidth: 20 }, // Adjust width for type column
      },
    });

    // Price summary
    const summaryY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text(`Items Price: $${order.itemsPrice?.toFixed(2)}`, 150, summaryY);

    if (order.order_type !== "ebook" || "audiobook") {
      doc.text(
        `Shipping Price: $${order.shippingPrice?.toFixed(2)}`,
        150,
        summaryY + 5
      );
    }

    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text(
      `Total Price: $${order.totalPrice?.toFixed(2)}`,
      150,
      summaryY + (order.order_type !== "ebook" || "audiobook" ? 15 : 10)
    );
    doc.setFont(undefined, "normal");

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      "Thank you for your purchase!",
      105,
      doc.lastAutoTable.finalY + 30,
      { align: "center" }
    );
    doc.text(
      "For any inquiries, please contact our customer support.",
      105,
      doc.lastAutoTable.finalY + 35,
      { align: "center" }
    );

    // Save the PDF
    doc.save(`invoice_${order._id.slice(-6)}.pdf`);
  };

  if (loading || !order) return <Loader />;

  return (
    <div className="w-full min-h-screen container bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="md:w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <MetaData title={`Admin - Order #${order?._id?.slice(-6) || ""}`} />

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Order Details #{order?._id?.slice(-6)?.toUpperCase() || ""}
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              onClick={generatePDF}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-sm sm:text-base"
            >
              Download Invoice
            </button>
            <Link
              to="/admin/orders"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm sm:text-base text-center"
            >
              ← Back to Orders
            </Link>
          </div>
        </div>

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
                      ? "text-indigo-600"
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
                        ? "text-indigo-600"
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
                  <span className="font-medium">User Id:</span> {order.user?.id}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Name:</span> {order.user?.name}
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
                {order.user?.country && (
                  <p className="text-gray-700">
                    <span className="font-medium">Country:</span>{" "}
                    {order.user.country}
                  </p>
                )}
              </div>
            </div>

            {/* Shipping Info - Only show for non-ebook orders */}
            {order.order_type !== "ebook" ||
              ("audiobook" && order.shippingInfo && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Shipping Information
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Address:</span>{" "}
                      {order.shippingInfo.address}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">City:</span>{" "}
                      {order.shippingInfo.city}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">State:</span>{" "}
                      {order.shippingInfo.state}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Country:</span>{" "}
                      {order.shippingInfo.country}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">PIN Code:</span>{" "}
                      {order.shippingInfo.pinCode}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Phone:</span>{" "}
                      {order.shippingInfo.phone}
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
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Order Items
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Order Items Table */}
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
                        ${item.price?.toFixed(2)}
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

          {/* Update Order Section - Only show for non-ebook orders */}
          {order.order_type !== "ebook" ||
            ("audiobook" && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Update Order Status
                </h3>
                <form onSubmit={updateOrderHandler}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Update Status
                    </button>
                  </div>
                </form>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;

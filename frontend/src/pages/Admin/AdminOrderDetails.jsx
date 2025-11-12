import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";

import axios from "axios";
import { Country } from "country-state-city";
import {
  FaBox,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaPrint,
  FaShippingFast,
  FaTimesCircle,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getBook } from "../../actions/bookAction";
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
  const [booksData, setBooksData] = useState({});
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [printFormData, setPrintFormData] = useState({
    contact_email: "ubmsb75@gmail.com",
    production_delay: "",
    line_items: [],
    shipping_address: {
      name: "",
      street1: "",
      city: "",
      state_code: "",
      country_code: "",
      postcode: "",
      phone_number: "",
    },
    shipping_level: "EXPRESS",
  });

  const { order, loading, error } = useSelector((state) => state.orderDetails);
  const { isUpdated, error: updateError } = useSelector((state) => state.order);
  const { books } = useSelector((state) => state.books);

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

  // Package-এর বইগুলো fetch করা
  useEffect(() => {
    dispatch(getBook());
    const fetchBooksForPackages = async () => {
      if (!order || !order.orderItems) return;

      const packageItems = order.orderItems.filter(
        (item) => item.type === "package" && item.books && item.books.length > 0
      );

      if (packageItems.length === 0) return;

      setIsLoadingBooks(true);
      try {
        await dispatch(getBook());
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setIsLoadingBooks(false);
      }
    };

    fetchBooksForPackages();
  }, [order, dispatch]);

  // Books data process করা
  useEffect(() => {
    if (books.length > 0) {
      const bookMap = {};
      books.forEach((book) => {
        bookMap[book._id] = book;
      });
      setBooksData(bookMap);
    }
  }, [books]);

  // Function to get book name by ID
  const getBookName = (bookId) => {
    if (isLoadingBooks) return "Loading...";
    return booksData[bookId]?.name || "Book not found";
  };

  // Function to get book details by ID
  const getBookDetails = (bookId) => {
    return booksData[bookId] || null;
  };

  // Function to render book names for packages in UI
  const renderBookNames = (item) => {
    if (item.type === "package" && item.books && item.books.length > 0) {
      return (
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-1">
            Includes {item.books.length} book{item.books.length > 1 ? "s" : ""}:
          </p>
          <div className="max-h-20 overflow-y-auto">
            {item.books.map((bookId, index) => (
              <p key={index} className="text-xs text-gray-600 truncate">
                • {getBookName(bookId)}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Check if order has printable books
  const hasPrintableBooks = () => {
    // 🛑 1️⃣ যদি order বা orderItems না থাকে
    if (!order || !order.orderItems) return false;

    // 🧩 2️⃣ Filter printable items
    const printableItems = order.orderItems.filter((item) => {
      // যদি order item "book" হয়
      if (item.type === "book" && item.id) {
        const book = booksData[item.id];

        return book && (book.image?.url || book.fullPdf?.url);
      }

      // যদি order item "package" হয়
      if (
        item.type === "package" &&
        Array.isArray(item.books) &&
        item.books.length > 0
      ) {
        return item.books.some((bookRef) => {
          const bookId = bookRef.$oid || bookRef._id || bookRef;
          const book = booksData[bookId];

          return book && (book.image?.url || book.fullPdf?.url);
        });
      }

      return false;
    });

    // ✅ 3️⃣ অন্তত একটি printable item থাকলে true
    return printableItems.length > 0;
  };

  // Get all printable books from order

  const getPrintableBooks = () => {
    if (!order || !order.orderItems) return [];

    const printableBooks = [];

    order.orderItems.forEach((item) => {
      // শুধুমাত্র type === "book" (ebook এবং audiobook বাদ)
      if (item.type === "book" && item.id) {
        const book = booksData[item.id];
        printableBooks.push({
          ...book,
          quantity: item.quantity,
          external_id: `book-${item.id}`,
          title: item.name,
        });
      }

      // Package এর ক্ষেত্রে - শুধুমাত্র type === "book" বইগুলো নেবে
      else if (item.type === "package" && item.books && item.books.length > 0) {
        // Package items - শুধুমাত্র individual books (type === "book") যোগ করবে
        item.books.forEach((bookId) => {
          const book = getBookDetails(bookId);
          // শুধুমাত্র বই যার type === "book" এবং প্রিন্ট করা যায়
          if (
            book &&
            book.type === "book" &&
            (book.image?.url || book.fullPdf?.url)
          ) {
            printableBooks.push({
              ...book,
              quantity: item.quantity, // package এর quantity individual book এ apply হবে
              external_id: `book-${book._id}`,
              title: book.name,
            });
          }
        });
      }
    });

    return printableBooks;
  };

  // Initialize print form data when modal opens
  const initializePrintForm = () => {
    if (!order) return;

    const printableBooks = getPrintableBooks();

    const lineItems = printableBooks.map((book) => ({
      external_id: book._id,

      printable_normalization: {
        cover: {
          source_url: book.image?.url,
        },
        interior: {
          source_url: book.fullPdf?.url,
        },
        pod_package_id: "0600X0900BWSTDPB060UW444MXX", // Default package ID
      },
      quantity: book.quantity || 1,
      title: book.name,
    }));

    // ✅ Step 1: ইউজার ইনপুট নাও
    const shippingCountry = order?.shippingInfo?.country?.trim() || "";

    // ✅ Step 2: Country নাম মেলাও (case-insensitive)
    const matchedCountry = Country.getAllCountries().find(
      (c) => c.name.toLowerCase() === shippingCountry.toLowerCase()
    );

    // ✅ Step 3: Country code নাও বা fallback সেট করো
    const countryCode = matchedCountry.isoCode;

    setPrintFormData({
      contact_email: "ubmsb75@gmail.com",
      line_items: lineItems,
      production_delay: 120,
      shipping_address: {
        name: order.shippingInfo?.name || `${order.user?.name}`,
        street1: order.shippingInfo?.address || "",
        city: order.shippingInfo?.city || "",
        state_code: order.shippingInfo?.state || "",
        country_code: countryCode,
        postcode: order.shippingInfo?.pinCode || "",
        phone_number: order.shippingInfo?.phone || "",
      },
      shipping_level: "EXPRESS",
      external_id: `order-${order._id}`,
    });

    setShowPrintModal(true);
  };

  // Handle print form input changes
  // Handle print form input changes
  const handlePrintFormChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("shipping_")) {
      const field = name.replace("shipping_", "");
      setPrintFormData((prev) => ({
        ...prev,
        shipping_address: {
          ...prev.shipping_address,
          [field]: value,
        },
      }));
    } else if (name.startsWith("book_")) {
      const [_, index, field] = name.split("_");
      const updatedLineItems = [...printFormData.line_items];
      console.log("Updating field:", field, "Index:", index, "Value:", value);
      if (field === "quantity") {
        updatedLineItems[index].quantity = parseInt(value);
      } else if (field === "pod_package_id") {
        updatedLineItems[index].printable_normalization.pod_package_id = value;
      } else if (field === "cover_url") {
        updatedLineItems[index].printable_normalization.cover.source_url =
          value;
      } else if (field === "interior_url") {
        updatedLineItems[index].printable_normalization.interior.source_url =
          value;
      } else if (field === "title") {
        updatedLineItems[index].title = value;
      }
      console.log(updatedLineItems);
      setPrintFormData((prev) => ({
        ...prev,
        line_items: updatedLineItems,
      }));
    } else {
      setPrintFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Create Lulu order
  const createLuluOrder = async () => {
    setIsCreatingOrder(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/print/create-lulu-order`,
        printFormData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        toast.success("Print order created successfully!");
        setShowPrintModal(false);
      } else {
        toast.error(data.message || "Failed to create print order");
      }
    } catch (error) {
      console.error("Error creating Lulu order:", error);
      toast.error(
        error.response?.data?.message || "Error creating print order"
      );
    } finally {
      setIsCreatingOrder(false);
    }
  };
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
    if (
      order.order_type !== "ebook" &&
      order.order_type !== "audiobook" &&
      order.shippingInfo
    ) {
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

    // Order items table - UPDATED FOR PACKAGES
    const tableBody = order.orderItems.map((item) => {
      let productName = item.name;

      // Package হলে বইগুলোর নাম যোগ করুন
      if (item.type === "package" && item.books && item.books.length > 0) {
        const bookNames = item.books
          .map((bookId) => getBookName(bookId))
          .join(", ");
        productName = `${item.name}\n(Includes: ${bookNames})`;
      }

      return [
        productName,
        item.type,
        `$${item.price.toFixed(2)}`,
        item.quantity,
        `$${(item.price * item.quantity).toFixed(2)}`,
      ];
    });

    autoTable(doc, {
      head: [["Product", "Type", "Price", "Qty", "Subtotal"]],
      body: tableBody,
      startY:
        order.order_type === "ebook" || order.order_type === "audiobook"
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
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineColor: [200, 200, 200],
        lineWidth: 0.25,
      },
      columnStyles: {
        0: { cellWidth: 60 }, // Product column wider for package info
        1: { cellWidth: 25 }, // Type column
        2: { cellWidth: 20 }, // Price column
        3: { cellWidth: 15 }, // Quantity column
        4: { cellWidth: 25 }, // Subtotal column
      },
    });

    // Price summary
    const summaryY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text(`Items Price: $${order.itemsPrice?.toFixed(2)}`, 150, summaryY);

    if (order.order_type !== "ebook" && order.order_type !== "audiobook") {
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
      summaryY +
        (order.order_type !== "ebook" && order.order_type !== "audiobook"
          ? 15
          : 10)
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
            {/* Print Button - Only show for orders with printable books */}
            {hasPrintableBooks() && (
              <button
                onClick={initializePrintForm}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 text-sm sm:text-base flex items-center"
              >
                <FaPrint className="mr-2" />
                Print Books
              </button>
            )}
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
            {order.order_type !== "ebook" &&
              order.order_type !== "audiobook" &&
              order.shippingInfo && (
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
              )}
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
              {order.order_type !== "ebook" &&
                order.order_type !== "audiobook" && (
                  <p className="text-gray-700">
                    <span className="font-medium">Shipping Price:</span> $
                    {order.shippingPrice?.toFixed(2)}
                  </p>
                )}
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

                            {/* Package-এর বইগুলোর নাম দেখানো */}
                            {renderBookNames(item)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full 
                            ${
                              item.type === "ebook" || item.type === "audiobook"
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
          {order.order_type !== "ebook" && order.order_type !== "audiobook" && (
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
          )}
        </div>

        {/* Print Modal */}
        {showPrintModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                  Create Print Order
                </h2>
                <p className="text-gray-600 mt-1">
                  Review and edit print details for Lulu.com
                </p>
              </div>

              <div className="p-6">
                <form>
                  {/* Contact Email */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      name="contact_email"
                      value={printFormData.contact_email}
                      onChange={handlePrintFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Shipping Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="shipping_name"
                          value={printFormData.shipping_address.name}
                          onChange={handlePrintFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          name="shipping_phone_number"
                          value={printFormData.shipping_address.phone_number}
                          onChange={handlePrintFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          name="shipping_street1"
                          value={printFormData.shipping_address.street1}
                          onChange={handlePrintFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="shipping_city"
                          value={printFormData.shipping_address.city}
                          onChange={handlePrintFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State/Province
                        </label>
                        <input
                          type="text"
                          name="shipping_state_code"
                          value={printFormData.shipping_address.state_code}
                          onChange={handlePrintFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="shipping_postcode"
                          value={printFormData.shipping_address.postcode}
                          onChange={handlePrintFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country Code
                        </label>
                        <input
                          type="text"
                          name="shipping_country_code"
                          value={printFormData.shipping_address.country_code}
                          onChange={handlePrintFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Shipping Level
                        </label>
                        <select
                          name="shipping_level"
                          value={printFormData.shipping_level}
                          onChange={handlePrintFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="EXPRESS">Express</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Books to Print */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Books to Print
                    </h3>
                    {printFormData.line_items.map((book, index) => {
                      return (
                        <div key={index} className="border rounded-lg p-4 mb-4">
                          <h4 className="font-medium text-gray-900 mb-3">
                            {book.title}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cover Image URL
                              </label>
                              <input
                                type="url"
                                name={`book_${index}_cover_url`}
                                value={
                                  book.printable_normalization.cover.source_url
                                }
                                onChange={handlePrintFormChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Interior PDF URL
                              </label>
                              <input
                                type="url"
                                name={`book_${index}_interior_url`}
                                value={
                                  book.printable_normalization.interior
                                    .source_url
                                }
                                onChange={handlePrintFormChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quantity
                              </label>
                              <input
                                type="number"
                                name={`book_${index}_quantity`}
                                value={book.quantity}
                                onChange={handlePrintFormChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="1"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Package ID
                              </label>
                              <input
                                type="text"
                                name={`book_${index}_pod_package_id`}
                                value={
                                  book.printable_normalization.pod_package_id
                                }
                                onChange={handlePrintFormChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </form>
              </div>

              <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isCreatingOrder}
                >
                  Cancel
                </button>
                <button
                  onClick={createLuluOrder}
                  disabled={isCreatingOrder}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isCreatingOrder ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <FaPrint className="mr-2" />
                      Create Print Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderDetails;

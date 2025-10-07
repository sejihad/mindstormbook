import { useEffect } from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearErrors,
  deleteOrder,
  getAllOrders,
} from "../../actions/orderAction";
import Loader from "../../component/layout/Loader/Loader";
import { DELETE_ORDER_RESET } from "../../constants/orderContants";
import Sidebar from "./Sidebar";

const AllOrders = () => {
  const dispatch = useDispatch();

  const { orders, error, loading } = useSelector((state) => state.allOrders);
  const { error: deleteError, isDeleted } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllOrders());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Order Deleted Successfully");
      dispatch(getAllOrders());
      dispatch({ type: DELETE_ORDER_RESET });
    }
  }, [dispatch, error, deleteError, isDeleted]);

  const deleteOrderHandler = (id) => {
    if (window.confirm("Are you sure to delete this order?")) {
      dispatch(deleteOrder(id));
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-indigo-100 text-indigo-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-indigo-100 text-indigo-800";
      case "cancel":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full min-h-screen container bg-gray-50 flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 md:p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              All Orders
            </h1>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Payment</th>
                    <th className="px-4 py-3 text-left font-medium">Amount</th>
                    <th className="px-4 py-3 text-left font-medium">Type</th>
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders &&
                    orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                              order.order_status
                            )}`}
                          >
                            {order.order_status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(
                              order.payment.status
                            )}`}
                          >
                            {order.payment.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          ${order.totalPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 capitalize">
                          {order.order_type}
                        </td>
                        <td className="px-4 py-3 space-x-2">
                          <Link
                            to={`/admin/order/${order._id}`}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                          >
                            <FiEye className="mr-1" /> View
                          </Link>
                          <button
                            onClick={() => deleteOrderHandler(order._id)}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium cursor-pointer text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 className="mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  {orders?.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-6 text-gray-500"
                      >
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllOrders;

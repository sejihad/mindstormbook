import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAdminBook } from "../../actions/bookAction";
import { getAllOrders } from "../../actions/orderAction";
import { getAllUsers } from "../../actions/userAction";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";
import Sidebar from "./Sidebar";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const { books } = useSelector((state) => state.books);
  const { orders } = useSelector((state) => state.allOrders);
  const { users } = useSelector((state) => state.allUsers);

  // Calculate total amount and order status counts
  let totalAmount = 0;

  orders?.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  useEffect(() => {
    Promise.all([
      dispatch(getAdminBook()),
      dispatch(getAllOrders()),
      dispatch(getAllUsers()),
    ]).then(() => setLoading(false));
  }, [dispatch]);

  // Line chart data
  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75, 192, 192, 1)",
        pointHoverBorderColor: "rgba(220, 220, 220, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: [0, totalAmount],
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) return <Loader />;

  return (
    <div className="w-screen container max-w-full grid md:grid-cols-[1fr_5fr] min-h-screen bg-gray-100">
      <MetaData title="Dashboard - Admin Panel" />
      <Sidebar />

      <div className="bg-white p-8 overflow-x-hidden border-l border-gray-200">
        <h2 className="text-3xl font-semibold text-center mb-8 border-b pb-4 text-gray-800">
          Admin Dashboard
        </h2>

        <div className="my-8">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white rounded-lg p-6 text-center mx-auto mb-8 w-4/5 shadow-md">
            <p className="text-lg mb-2 font-medium">Total Revenue</p>
            <p className="text-3xl font-bold">${totalAmount.toFixed(2)}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/admin/books"
              className="bg-gradient-to-r from-pink-500 to-pink-300 text-white w-44 h-44 rounded-lg flex flex-col justify-center items-center shadow hover:-translate-y-1 transition transform duration-300"
            >
              <p className="text-lg font-medium mb-1">Books</p>
              <p className="text-2xl font-bold">{books?.length}</p>
            </Link>

            <Link
              to="/admin/orders"
              className="bg-gradient-to-r from-purple-500 to-indigo-300 text-white w-44 h-44 rounded-lg flex flex-col justify-center items-center shadow hover:-translate-y-1 transition transform duration-300"
            >
              <p className="text-lg font-medium mb-1">Orders</p>
              <p className="text-2xl font-bold">{orders?.length}</p>
            </Link>

            <Link
              to="/admin/users"
              className="bg-gradient-to-r from-blue-500 to-teal-300 text-white w-44 h-44 rounded-lg flex flex-col justify-center items-center shadow hover:-translate-y-1 transition transform duration-300"
            >
              <p className="text-lg font-medium mb-1">Users</p>
              <p className="text-2xl font-bold">{users?.length}</p>
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap justify-around gap-8 mt-12">
          <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Revenue Chart
            </h3>
            <Line data={lineState} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { clearErrors, getUserDetails } from "../../actions/userAction";
import Loader from "../../component/layout/Loader/Loader";
import Sidebar from "./Sidebar";

const UserDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector((state) => state.userDetails);

  useEffect(() => {
    dispatch(getUserDetails(id));

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, id, error]);

  return (
    <div className="w-full min-h-screen container flex flex-col md:flex-row bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-4">User Details</h1>

        {loading ? (
          <Loader />
        ) : (
          user && (
            <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={user.avatar?.url || "/default.jpg"}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-gray-500">{user.email || "N/A"}</p>
                </div>
              </div>
              <div>
                <p>
                  <span className="font-medium">ID:</span> {user._id}
                </p>
                <p>
                  <span className="font-medium">Role:</span>{" "}
                  <span
                    className={
                      user.role === "admin"
                        ? "text-indigo-600"
                        : "text-blue-600"
                    }
                  >
                    {user.role}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Phone Number:</span>{" "}
                  {user.number || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Country:</span>{" "}
                  {user.country || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Created At:</span>{" "}
                  {new Date(user.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UserDetails;

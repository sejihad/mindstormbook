// components/admin/AllUsers.jsx
import { useEffect } from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearErrors, deleteUser, getAllUsers } from "../../actions/userAction";
import Loader from "../../component/layout/Loader/Loader";
import { DELETE_USER_RESET } from "../../constants/userContants";
import Sidebar from "./Sidebar";

const AllUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, error, loading } = useSelector((state) => state.allUsers);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.profile
  );

  useEffect(() => {
    dispatch(getAllUsers());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("User Deleted Successfully");
      dispatch(getAllUsers());
      dispatch({ type: DELETE_USER_RESET });
    }
  }, [dispatch, error, deleteError, isDeleted]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure to delete this user?")) {
      dispatch(deleteUser(id));
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
            <h1 className="text-2xl font-bold text-gray-800 mb-6">All Users</h1>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Image</th>
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users &&
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <img
                            src={user.avatar?.url || "/default.jpg"}
                            alt="User"
                            className="w-12 h-12 object-cover rounded-full"
                          />
                        </td>
                        <td className="px-4 py-3">{user.name}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3 space-x-2">
                          <Link
                            to={`/admin/user/${user._id}`}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
                          >
                            <FiEye className="mr-1" /> Details
                          </Link>
                          <button
                            onClick={() => deleteHandler(user._id)}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium cursor-pointer text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 className="mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  {users?.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-6 text-gray-500"
                      >
                        No users found.
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

export default AllUsers;

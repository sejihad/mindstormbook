import { useEffect } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearErrors,
  deletePackage,
  getAdminPackages,
} from "../../actions/packageAction";
import MetaData from "../../component/layout/MetaData";
import { DELETE_PACKAGE_RESET } from "../../constants/packageConstants";
import Sidebar from "./Sidebar";

const AllPackages = () => {
  const dispatch = useDispatch();
  const { packages, loading } = useSelector((state) => state.packages);
  const { error, isDeleted } = useSelector((state) => state.package);

  useEffect(() => {
    dispatch(getAdminPackages());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Package deleted successfully");
      dispatch({ type: DELETE_PACKAGE_RESET });
      dispatch(getAdminPackages());
    }
  }, [dispatch, error, isDeleted]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      dispatch(deletePackage(id));
    }
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Manage Packages" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">All Packages</h1>
            <Link
              to="/admin/package/new"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer text-sm sm:text-base"
            >
              <FiPlus size={18} /> Add Package
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Package List
              </h2>
              <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                {packages?.length || 0}{" "}
                {packages?.length === 1 ? "package" : "packages"}
              </span>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading packages...</p>
              </div>
            ) : packages?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No packages found. Create one to get started!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Books
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {packages?.map((pkg) => (
                      <tr key={pkg._id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex-shrink-0 h-10 w-10">
                            {pkg.image ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={pkg.image.url}
                                alt={pkg.name}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://via.placeholder.com/40";
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-500">
                                  No Image
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                            {pkg.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {pkg.deliveryTime || "N/A"}
                          </div>
                          <div className="mt-1 md:hidden text-xs text-gray-600">
                            {pkg.books &&
                              Object.values(pkg.books)
                                .slice(0, 2)
                                .map((book, idx) => (
                                  <div key={idx} className="truncate">
                                    • {book.name}
                                  </div>
                                ))}
                            {pkg.books &&
                              Object.values(pkg.books).length > 2 && (
                                <div className="text-indigo-600">
                                  +{Object.values(pkg.books).length - 2} more
                                </div>
                              )}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                          <div className="text-sm text-gray-900 space-y-1 max-h-[120px] overflow-y-auto">
                            {pkg.books &&
                              Object.values(pkg.books).map((book, idx) => (
                                <div key={idx} className="flex items-center">
                                  <span className="mr-2">•</span>
                                  <span className="truncate max-w-[200px]">
                                    {book.name}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 line-through">
                            ${pkg.oldPrice}
                          </div>
                          <div className="text-sm font-bold text-indigo-600">
                            ${pkg.discountPrice}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-4">
                            <Link
                              to={`/admin/package/${pkg._id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit"
                            >
                              <FiEdit2 size={18} />
                            </Link>
                            <button
                              onClick={() => handleDelete(pkg._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPackages;

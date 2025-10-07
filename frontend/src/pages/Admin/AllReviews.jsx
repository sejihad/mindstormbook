import { useEffect } from "react";
import { FiStar } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearErrors as clearBookErrors,
  getAdminBook,
} from "../../actions/bookAction";
import {
  clearErrors as clearPackageErrors,
  getAdminPackages,
} from "../../actions/packageAction";
import MetaData from "../../component/layout/MetaData";
import Sidebar from "./Sidebar";

const AllReviews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Books state
  const { books: allBooks, loading: booksLoading } = useSelector(
    (state) => state.books
  );
  const { error: bookError } = useSelector((state) => state.book);

  // Packages state
  const { packages: allPackages, loading: packagesLoading } = useSelector(
    (state) => state.packages
  );
  const { error: packageError } = useSelector((state) => state.package);

  useEffect(() => {
    dispatch(getAdminBook());
    dispatch(getAdminPackages());

    if (bookError) {
      toast.error(bookError);
      dispatch(clearBookErrors());
    }

    if (packageError) {
      toast.error(packageError);
      dispatch(clearPackageErrors());
    }
  }, [dispatch, bookError, packageError]);

  const handleSeeReviews = (type, id, name) => {
    navigate(`/admin/reviews/${type}/${id}`, { state: { name } });
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Manage Reviews" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {/* Books Section */}
          <div className="mb-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Books Reviews
            </h1>

            {booksLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading books...</p>
              </div>
            ) : allBooks?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No books found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allBooks?.map((book) => (
                  <div
                    key={book._id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-800 ">
                        {book.name}
                      </h3>
                    </div>
                    <button
                      onClick={() =>
                        handleSeeReviews("book", book._id, book.name)
                      }
                      className="mt-3 w-full flex items-center justify-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-md transition-colors"
                    >
                      <FiStar /> See Reviews ({book.numOfReviews})
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Packages Section */}
          <div className="mb-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Packages Reviews
            </h1>

            {packagesLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading packages...</p>
              </div>
            ) : allPackages?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No packages found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allPackages?.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-800 truncate">
                        {pkg.name}
                      </h3>
                    </div>
                    <button
                      onClick={() =>
                        handleSeeReviews("package", pkg._id, pkg.name)
                      }
                      className="mt-3 w-full flex items-center justify-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-md transition-colors"
                    >
                      <FiStar /> See Reviews
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllReviews;

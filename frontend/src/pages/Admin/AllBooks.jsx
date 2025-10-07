// components/admin/AllBooks.jsx
import { useEffect } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearErrors,
  deleteBook,
  getAdminBook,
} from "../../actions/bookAction";
import MetaData from "../../component/layout/MetaData";
import { DELETE_BOOK_RESET } from "../../constants/bookConstants";
import Sidebar from "./Sidebar";

const AllBooks = () => {
  const dispatch = useDispatch();

  const { books, loading } = useSelector((state) => state.books);
  const { error, isDeleted } = useSelector((state) => state.book);

  useEffect(() => {
    dispatch(getAdminBook());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Book deleted successfully");
      dispatch({ type: DELETE_BOOK_RESET });
      dispatch(getAdminBook());
    }
  }, [dispatch, error, isDeleted]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      dispatch(deleteBook(id));
    }
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Manage Books" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">All Books</h1>
            <Link
              to="/admin/book/new"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer text-sm sm:text-base"
            >
              <FiPlus size={18} /> Add Book
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-800">Book List</h2>
              <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                {books?.length || 0} {books?.length === 1 ? "book" : "books"}
              </span>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading books...</p>
              </div>
            ) : books?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No books found. Create one to get started!
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
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Writer
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Type
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {books?.map((book) => (
                      <tr key={book._id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex-shrink-0 h-10 w-10">
                            {book.image ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={book.image.url}
                                alt={book.name}
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
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[150px] sm:max-w-none">
                            {book.name}
                          </div>
                          <div className="text-sm text-gray-500 sm:hidden">
                            {book.writer}
                          </div>
                          <div className="text-sm text-gray-500">
                            {book.category}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                          {book.writer}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 line-through">
                            ${book.oldPrice}
                          </div>
                          <div className="text-sm font-bold text-indigo-600">
                            ${book.discountPrice}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              book.type === "ebook"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {book.type === "ebook" ? "E-Book" : "Book"}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-3">
                            <Link
                              to={`/admin/book/${book._id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit"
                            >
                              <FiEdit2 size={18} />
                            </Link>
                            <button
                              onClick={() => handleDelete(book._id)}
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

export default AllBooks;

// components/admin/AllBooks.jsx
import { useEffect, useMemo, useState } from "react";
import { FiChevronUp, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
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

  const [sortBy, setSortBy] = useState("name"); // "name" or "writer"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

  // Alphabetically sorted books
  const sortedBooks = useMemo(() => {
    if (!books) return [];

    return [...books].sort((a, b) => {
      let valueA, valueB;

      if (sortBy === "name") {
        valueA = a.name?.toLowerCase() || "";
        valueB = b.name?.toLowerCase() || "";
      } else if (sortBy === "writer") {
        valueA = a.writer?.toLowerCase() || "";
        valueB = b.writer?.toLowerCase() || "";
      } else if (sortBy === "price") {
        valueA = a.discountPrice || 0;
        valueB = b.discountPrice || 0;
      } else if (sortBy === "category") {
        valueA = a.category?.toLowerCase() || "";
        valueB = b.category?.toLowerCase() || "";
      }

      if (sortOrder === "asc") {
        return typeof valueA === "string"
          ? valueA.localeCompare(valueB)
          : valueA - valueB;
      } else {
        return typeof valueA === "string"
          ? valueB.localeCompare(valueA)
          : valueB - valueA;
      }
    });
  }, [books, sortBy, sortOrder]);

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

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const getSortIcon = () => {
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Manage Books" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {/* Header Section */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">All Books</h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage your book collection
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Sort Controls */}
              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
                <FiChevronUp className="text-gray-500" size={16} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm bg-transparent border-none outline-none cursor-pointer min-w-[120px]"
                >
                  <option value="name">Book Name</option>
                  <option value="writer">Writer</option>
                  <option value="category">Category</option>
                  <option value="price">Price</option>
                </select>
                <button
                  onClick={toggleSortOrder}
                  className="text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
                >
                  {getSortIcon()} {sortOrder === "asc" ? "A-Z" : "Z-A"}
                </button>
              </div>

              <Link
                to="/admin/book/new"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer text-sm sm:text-base shadow-sm hover:shadow-md"
              >
                <FiPlus size={18} /> Add New Book
              </Link>
            </div>
          </div>

          {/* Books Table */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Book Collection
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Sorted by {sortBy} ({sortOrder === "asc" ? "A-Z" : "Z-A"})
                </p>
              </div>
              <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                {sortedBooks?.length || 0}{" "}
                {sortedBooks?.length === 1 ? "book" : "books"}
              </span>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-2 text-gray-500">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></div>
                  Loading books...
                </div>
              </div>
            ) : sortedBooks?.length === 0 ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="text-gray-400 text-6xl mb-4">📚</div>
                  <p className="text-gray-500 text-lg mb-2">No books found</p>
                  <p className="text-gray-400 mb-6">
                    Get started by adding your first book to the collection
                  </p>
                  <Link
                    to="/admin/book/new"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors cursor-pointer"
                  >
                    <FiPlus size={18} /> Add Your First Book
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cover
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Book Details
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
                    {sortedBooks?.map((book, index) => (
                      <tr
                        key={book._id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 font-medium">
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex-shrink-0 h-12 w-12">
                            {book.image ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover border border-gray-200 shadow-sm"
                                src={book.image.url}
                                alt={book.name}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                                <span className="text-xs text-gray-400 font-medium">
                                  No Image
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <div className="max-w-[200px] sm:max-w-[250px]">
                            <div className="text-sm font-semibold text-gray-900 truncate">
                              {book.name}
                            </div>
                            <div className="text-xs text-gray-500 sm:hidden mt-1">
                              by {book.writer}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <span className="bg-gray-100 px-2 py-1 rounded-md">
                                {book.category}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Stock: {book.stock || 0}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">
                          <div className="max-w-[150px] truncate">
                            {book.writer}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            {book.oldPrice > book.discountPrice && (
                              <div className="text-xs text-gray-400 line-through">
                                ${book.oldPrice}
                              </div>
                            )}
                            <div className="text-sm font-bold text-green-600">
                              ${book.discountPrice}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize border ${
                              book.type === "ebook"
                                ? "bg-purple-100 text-purple-800 border-purple-200"
                                : book.type === "audiobook"
                                ? "bg-orange-100 text-orange-800 border-orange-200"
                                : "bg-blue-100 text-blue-800 border-blue-200"
                            }`}
                          >
                            {book.type === "ebook"
                              ? "E-Book"
                              : book.type === "audiobook"
                              ? "Audio Book"
                              : "Physical Book"}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/admin/book/${book._id}`}
                              className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                              title="Edit Book"
                            >
                              <FiEdit2 size={18} />
                            </Link>
                            <button
                              onClick={() => handleDelete(book._id)}
                              className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Delete Book"
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

            {/* Summary Footer */}
            {sortedBooks?.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
                  <div>
                    Showing{" "}
                    <span className="font-semibold">{sortedBooks.length}</span>{" "}
                    books
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
                      Physical:{" "}
                      {sortedBooks.filter((b) => b.type === "book").length}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded"></div>
                      E-Book:{" "}
                      {sortedBooks.filter((b) => b.type === "ebook").length}
                    </span>
                    {sortedBooks.some((b) => b.type === "audiobook") && (
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>
                        Audio:{" "}
                        {
                          sortedBooks.filter((b) => b.type === "audiobook")
                            .length
                        }
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBooks;

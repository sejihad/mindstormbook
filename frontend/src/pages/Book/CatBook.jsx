import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getBook } from "../../actions/bookAction";
import BookSection from "../../component/BookSection";
import Loader from "../../component/layout/Loader/Loader";

const CatBook = () => {
  const dispatch = useDispatch();
  const { loading, books } = useSelector((state) => state.books);
  const { category } = useParams(); // ✅ dynamic category from URL

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 15;

  useEffect(() => {
    dispatch(getBook());
  }, [dispatch]);

  const filteredBooks = books.filter(
    (book) => book.category.toLowerCase() === category?.toLowerCase()
  );

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="container min-h-screen mx-auto px-4 py-8">
      {loading ? (
        <Loader />
      ) : filteredBooks.length === 0 ? (
        <div className="text-center text-gray-500 text-lg py-10">
          No books found in "{category}" category.
        </div>
      ) : (
        <>
          <BookSection
            title={`${category.charAt(0).toUpperCase()}${category.slice(1)}`}
            books={currentBooks}
            loading={loading}
          />

          {/* Pagination */}
          <div className="flex justify-center mt-10">
            <div className="flex space-x-2">
              {[...Array(totalPages).keys()].map((num) => (
                <button
                  key={num + 1}
                  onClick={() => paginate(num + 1)}
                  className={`px-3 py-1 rounded-md border text-sm font-medium ${
                    currentPage === num + 1
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {num + 1}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default CatBook;

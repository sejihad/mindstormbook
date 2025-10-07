// 📁 src/pages/Shop.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getBook } from "../../actions/bookAction";
import BookSection from "../../component/BookSection";
import Loader from "../../component/layout/Loader/Loader";
// const StarRating = ({ rating }) => {
//   const fullStars = Math.floor(rating);
//   const halfStar = rating % 1 >= 0.5;
//   const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

//   return (
//     <div className="flex justify-center mt-2 text-yellow-400 text-sm">
//       {[...Array(fullStars)].map((_, i) => (
//         <FaStar key={i} />
//       ))}
//       {halfStar && <FaStarHalfAlt />}
//       {[...Array(emptyStars)].map((_, i) => (
//         <FaRegStar key={i} />
//       ))}
//     </div>
//   );
// };

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Shop = () => {
  const dispatch = useDispatch();
  const { loading, books } = useSelector((state) => state.books);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 15;

  const query = useQuery();

  useEffect(() => {
    dispatch(getBook());
  }, [dispatch]);

  useEffect(() => {
    const querySearch = query.get("search") || "";
    setSearchTerm(querySearch);
  }, [query]);

  const filteredBooks = books.filter(
    (book) =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.writer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="container min-h-screen mx-auto px-4 py-8">
      {/* <h2 className="text-2xl font-bold text-gray-800 mb-6">All Books</h2> */}
      {loading ? (
        <Loader />
      ) : filteredBooks.length === 0 ? (
        <div className="text-center text-gray-500 text-lg py-10">
          No books found.
        </div>
      ) : (
        <>
          {/* ✅ BookSection এ currentBooks পাঠানো */}
          <BookSection title="All " books={currentBooks} loading={loading} />

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

export default Shop;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBook } from "../../actions/bookAction";
import BookSection from "../../component/BookSection";
import Loader from "../../component/layout/Loader/Loader";

const EBookPage = () => {
  const dispatch = useDispatch();
  const { loading, books } = useSelector((state) => state.books);

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 15;

  useEffect(() => {
    dispatch(getBook());
  }, [dispatch]);

  const filteredBooks = books.filter((book) => book.type === "ebook");

  return (
    <section className="container min-h-screen mx-auto px-4 py-8">
      {loading ? (
        <Loader />
      ) : filteredBooks.length === 0 ? (
        <div className="text-center text-gray-500 text-lg py-10">
          No books found
        </div>
      ) : (
        <>
          <BookSection title={`E`} books={filteredBooks} loading={loading} />
        </>
      )}
    </section>
  );
};

export default EBookPage;

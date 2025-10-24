import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getBook } from "../../actions/bookAction";
import BookSection from "../../component/BookSection";
import Loader from "../../component/layout/Loader/Loader";

const CatBook = () => {
  const dispatch = useDispatch();
  const { loading, books } = useSelector((state) => state.books);
  const { category } = useParams(); // ✅ dynamic category from URL

  useEffect(() => {
    dispatch(getBook());
  }, [dispatch]);

  const filteredBooks = books.filter(
    (book) => book.category.toLowerCase() === category?.toLowerCase()
  );

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
            books={filteredBooks}
            loading={loading}
          />
        </>
      )}
    </section>
  );
};

export default CatBook;

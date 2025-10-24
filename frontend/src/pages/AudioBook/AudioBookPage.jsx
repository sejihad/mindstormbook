import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBook } from "../../actions/bookAction";
import BookSection from "../../component/BookSection";
import Loader from "../../component/layout/Loader/Loader";

const AudioBookPage = () => {
  const dispatch = useDispatch();
  const { loading, books } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(getBook());
  }, [dispatch]);

  const filteredBooks = books.filter((book) => book.type === "audiobook");

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
          <BookSection
            title={`Audio `}
            books={filteredBooks}
            loading={loading}
          />
        </>
      )}
    </section>
  );
};

export default AudioBookPage;

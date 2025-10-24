import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import { addItemsToCart } from "../actions/cartAction";
import Loader from "./layout/Loader/Loader";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex justify-center mt-2 text-yellow-400 text-sm">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} />
      ))}
      {halfStar && <FaStarHalfAlt />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={i} />
      ))}
    </div>
  );
};

const BookSection = ({ title, books, loading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleBuyNow = (type, item) => {
    if (!user) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }
    if (!user?.country || !user?.number) {
      toast.info("Please complete your profile before checkout");
      navigate("/profile/update", {
        state: {
          from: "/checkout",
          checkoutState: {
            cartItems: [item],
            type: type,
          },
        },
      });
      return;
    }

    navigate("/checkout", {
      state: {
        cartItems: [item],
        type: type,
      },
    });
  };

  const addToCartBookHandler = (type, id, q) => {
    dispatch(addItemsToCart(type, id, q));
    toast.success("Item Added To Cart");
  };

  const addToCartEbookHandler = (type, id, q) => {
    dispatch(addItemsToCart(type, id, q));
    toast.success("Item Added To Cart");
  };
  const addToCartAudiobookHandler = (type, id, q) => {
    dispatch(addItemsToCart(type, id, q));
    toast.success("Item Added To Cart");
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {title} <span className="text-indigo-600">Books</span>
            </h2>
            <Link
              to="/shop"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Show All →
            </Link>
          </div>

          {books.length === 0 ? (
            <div className="text-center text-gray-500 text-lg py-10">
              No books added yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[...books]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((book) => (
                  <div
                    key={book._id}
                    className="bg-white shadow hover:shadow-lg transition duration-300 border-amber-50 flex flex-col h-full"
                  >
                    <div className="relative group overflow-hidden border border-gray-200 p-2 bg-white">
                      <Link
                        to={`/${book.type}/${book.category}/${slugify(
                          book.name,
                          {
                            lower: true,
                            strict: true,
                          }
                        )}`}
                      >
                        <img
                          src={book.image?.url}
                          alt={book.name}
                          className="w-full h-75 object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </Link>
                      {book.oldPrice > book.discountPrice && (
                        <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                          -
                          {Math.round(
                            ((book.oldPrice - book.discountPrice) /
                              book.oldPrice) *
                              100
                          )}
                          %
                        </span>
                      )}
                    </div>

                    <div className="p-4 text-center flex-grow flex flex-col">
                      <Link
                        to={`/${book.type}/${book.category}/${slugify(
                          book.name,
                          {
                            lower: true,
                            strict: true,
                          }
                        )}`}
                        className="block hover:text-indigo-600" // Optional hover effect
                      >
                        <h3 className="text-md font-semibold text-gray-800 line-clamp-2 h-12">
                          {book.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 line-clamp-1 h-5">
                        {book.writer}
                      </p>
                      <StarRating rating={book.ratings} />
                      <div className="flex flex-wrap justify-center gap-1 my-2">
                        {/* <span className="inline-block text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                        {book.category}
                      </span> */}
                        <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {book.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-2 text-sm">
                        <span className="text-indigo-600 font-semibold">
                          ${book.discountPrice}
                        </span>
                        {book.oldPrice > book.discountPrice && (
                          <span className="line-through text-gray-400">
                            ${book.oldPrice}
                          </span>
                        )}
                      </div>
                      <div className="mt-auto">
                        <button
                          onClick={() =>
                            handleBuyNow(book.type, {
                              id: book._id,
                              name: book.name,
                              price: book.discountPrice,
                              image: book.image.url,
                              type: book.type,
                              quantity: 1,
                            })
                          }
                          className="mt-2 w-full bg-gradient-to-r from-indigo-500 to-indigo-500 text-white font-semibold py-2 hover:from-indigo-600 hover:to-indigo-600 transition-all duration-300 cursor-pointer"
                        >
                          Buy Now
                        </button>
                        {book.type === "ebook" && (
                          <button
                            onClick={() =>
                              addToCartEbookHandler("book", book._id, 1)
                            }
                            className="mt-2 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-2 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 cursor-pointer"
                          >
                            Add to Cart
                          </button>
                        )}
                        {book.type === "book" && (
                          <button
                            onClick={() =>
                              addToCartBookHandler("book", book._id, 1)
                            }
                            className="mt-2 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-2 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 cursor-pointer"
                          >
                            Add to Cart
                          </button>
                        )}
                        {book.type === "audiobook" && (
                          <button
                            onClick={() =>
                              addToCartBookHandler("book", book._id, 1)
                            }
                            className="mt-2 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-2 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 cursor-pointer"
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default BookSection;

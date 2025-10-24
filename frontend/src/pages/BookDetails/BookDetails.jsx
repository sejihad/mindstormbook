import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBook,
  FaCalendarAlt,
  FaMinus,
  FaPlay,
  FaPlus,
  FaRegStar,
  FaShoppingCart,
  FaStar,
  FaTimes,
  FaUserEdit,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getBook, getBookDetails, newReview } from "../../actions/bookAction";
import { addItemsToCart } from "../../actions/cartAction";
import { myOrders } from "../../actions/orderAction";
import BookSection from "../../component/BookSection";
import Loader from "../../component/layout/Loader/Loader";
import { NEW_REVIEW_RESET } from "../../constants/bookConstants";

const StarRating = ({ rating, interactive = false, onChange }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || rating;

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          className={`text-xl ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => handleClick(value)}
          onMouseEnter={() => handleMouseEnter(value)}
          onMouseLeave={handleMouseLeave}
        >
          {value <= displayRating ? (
            <FaStar className="text-yellow-400" />
          ) : (
            <FaRegStar className="text-yellow-400" />
          )}
        </span>
      ))}
    </div>
  );
};

const BookDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { loading, book } = useSelector((state) => state.bookDetails);
  const { orders } = useSelector((state) => state.myOrders);
  const { books } = useSelector((state) => state.books);
  const { user } = useSelector((state) => state.user);
  const { success: reviewSuccess } = useSelector((state) => state.newReview);

  const [quantity, setQuantity] = useState(1);
  const [showPdf, setShowPdf] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [review, setReview] = useState({ rating: 0, comment: "" });
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);

  useEffect(() => {
    dispatch(getBookDetails(slug));
    dispatch(getBook());
    dispatch(myOrders());
    if (reviewSuccess) {
      dispatch(getBookDetails(slug));
      toast.success("Review Created Success");
      dispatch({ type: NEW_REVIEW_RESET });
    }
  }, [dispatch, slug, reviewSuccess]);

  const addToCartBookHandler = () => {
    dispatch(addItemsToCart("book", book._id, quantity));
    navigate("/cart");
    toast.success("Item Added To Cart");
  };
  const addToCartEbookHandler = () => {
    dispatch(addItemsToCart("ebook", book._id, 1));
    navigate("/cart");
    toast.success("Item Added To Cart");
  };
  const addToCartAudiobookHandler = () => {
    dispatch(addItemsToCart("audiobook", book._id, 1));
    navigate("/cart");
    toast.success("Item Added To Cart");
  };

  const hasReviewed = book?.reviews?.some((r) => r.user === user?._id);
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

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  const submitReview = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(newReview({ ...review, bookId: book._id }));
    setReview({ rating: 0, comment: "" });
  };

  // Fullscreen image navigation
  const nextImage = () => {
    setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  // Keyboard navigation for fullscreen images
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showFullscreenImage) {
        if (e.key === "ArrowRight") {
          nextImage();
        } else if (e.key === "ArrowLeft") {
          prevImage();
        } else if (e.key === "Escape") {
          setShowFullscreenImage(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showFullscreenImage]);

  if (loading || !book) return <Loader />;

  const allImages = [book.image, ...(book.images || [])].filter(Boolean);
  const hasCompletedOrder = orders?.some((order) => {
    return order.orderItems?.some((item) => {
      if (item.type === "book") {
        return item.id === book._id && order.order_status === "completed";
      } else if (item.type === "ebook") {
        return item.id === book._id && order.payment?.status === "paid";
      } else if (item.type === "audiobook") {
        return item.id === book._id && order.payment?.status === "paid";
      }
      return false;
    });
  });

  // Get related books (same category, excluding current book)
  const relatedBooks = books
    .filter(
      (b) =>
        b._id !== book._id &&
        b.category === book.category &&
        b.type === book.type
    )
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Main Book Section - 3 Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-8">
        {/* Left Column - Book Images */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            {/* Main Image - Made smaller */}
            <div
              className="flex justify-center mb-4 h-48 cursor-zoom-in"
              onClick={() => setShowFullscreenImage(true)}
            >
              <img
                src={allImages[selectedImage]?.url}
                alt={book.name}
                className="h-full object-contain"
              />
            </div>

            {/* Thumbnail Slider */}
            {allImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto py-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-12 h-12 rounded border ${
                      selectedImage === index
                        ? "border-indigo-500"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Read Sample PDF Button - for Book and E-Book */}
            {(book.type === "book" || book.type === "ebook") &&
              book.demoPdf && (
                <button
                  onClick={() => setShowPdf(true)}
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition"
                >
                  Read Sample PDF
                </button>
              )}

            {/* Listen Sample Audio Button - for Audio-Book */}
            {book.type === "audiobook" && book.demoAudio && (
              <button
                onClick={() => setShowAudio(true)}
                className="w-full mt-4 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition"
              >
                <FaPlay className="mr-2" />
                Listen Sample Audio
              </button>
            )}

            {/* Book Metadata Below the Image */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <FaUserEdit className="text-gray-500 mr-2" />
                <span className="text-sm">Author: {book.writer}</span>
              </div>
              <div className="flex items-center">
                <FaBook className="text-gray-500 mr-2" />
                <span className="text-sm">
                  Publisher: {book.publisher || "N/A"}
                </span>
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="text-gray-500 mr-2" />
                <span className="text-sm">
                  Published:{" "}
                  {book.publishDate
                    ? new Date(book.publishDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              {book.isbn13 && (
                <div className="text-sm">
                  <span className="text-gray-600">ISBN-13:</span> {book.isbn13}
                </div>
              )}
              <div className="text-sm">
                <span className="text-gray-600">Type:</span>{" "}
                {book.type === "ebook"
                  ? "E-Book"
                  : book.type === "audiobook"
                  ? "Audio-Book"
                  : "Physical Book"}
              </div>
              <div>
                <span className="text-gray-600">Language:</span>{" "}
                {book.language || "N/A"}
              </div>
              <div>
                <span className="text-gray-600">Category:</span> {book.category}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Book Information */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-full">
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              {book.name}
            </h1>
            <p className="text-xl text-gray-700 mb-2">{book.title}</p>

            <div className="flex items-center mb-4">
              <StarRating rating={book.ratings || 0} />
              <span className="ml-2 text-gray-600">
                ({book.numOfReviews} reviews)
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {book.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Purchase Options */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-4">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-indigo-600">
                ${book.discountPrice}
              </span>
              {book.oldPrice > book.discountPrice && (
                <span className="text-lg text-gray-400 line-through ml-3">
                  ${book.oldPrice}
                </span>
              )}
            </div>

            {book.type === "book" ? (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Quantity:</span>
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <button
                        onClick={decrementQuantity}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                        disabled={quantity <= 1}
                      >
                        <FaMinus className="text-gray-600" />
                      </button>
                      <span className="px-4 py-1 bg-white w-12 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={incrementQuantity}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                      >
                        <FaPlus className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {book.deliveryTime && (
                    <div className="text-sm text-gray-600 mb-2">
                      <span>Delivery: </span>
                      <span className="font-medium">{book.deliveryTime}</span>
                    </div>
                  )}

                  {book.deliverToCountries && (
                    <div className="text-sm text-gray-600">
                      <span>Ships to: </span>
                      <span className="font-medium">
                        {book.deliverToCountries}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={addToCartBookHandler}
                    className="w-full flex items-center justify-center py-2 px-4 rounded-md font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
                  >
                    <FaShoppingCart className="mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() =>
                      handleBuyNow(book.type, {
                        id: book._id,
                        quantity: 1,
                        name: book.name,
                        price: book.discountPrice,
                        image: book.image.url,
                        type: book.type,
                      })
                    }
                    className="w-full py-2 px-4 rounded-md font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
                  >
                    Buy Now
                  </button>
                </div>
              </>
            ) : book.type === "ebook" ? (
              <div className="space-y-3">
                <button
                  onClick={addToCartEbookHandler}
                  className="w-full flex items-center justify-center py-2 px-4 rounded-md font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={() =>
                    handleBuyNow(book.type, {
                      id: book._id,
                      quantity: quantity,
                      name: book.name,
                      price: book.discountPrice,
                      image: book.image.url,
                      type: book.type,
                    })
                  }
                  className="w-full py-2 px-4 rounded-md font-medium text-white bg-red-500 hover:bg-red-600 transition"
                >
                  Buy Now (E-Book)
                </button>
              </div>
            ) : (
              // Audio-Book purchase options
              <div className="space-y-3">
                <button
                  onClick={addToCartAudiobookHandler}
                  className="w-full flex items-center justify-center py-2 px-4 rounded-md font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={() =>
                    handleBuyNow(book.type, {
                      id: book._id,
                      quantity: 1,
                      name: book.name,
                      price: book.discountPrice,
                      image: book.image.url,
                      type: book.type,
                    })
                  }
                  className="w-full py-2 px-4 rounded-md font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
                >
                  Buy Now (Audio Book)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Section */}
      {book.videoLink && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Book Preview</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={book.videoLink}
              title="Book Video"
              allowFullScreen
              className="w-full h-96 rounded-md"
            ></iframe>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Customer Reviews
        </h2>

        {/* Review Form */}
        {user && hasCompletedOrder && !hasReviewed && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Your Rating</label>
                <StarRating
                  rating={review.rating}
                  interactive={true}
                  onChange={(rating) => setReview({ ...review, rating })}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Your Review</label>
                <textarea
                  rows={4}
                  value={review.comment}
                  onChange={(e) =>
                    setReview({ ...review, comment: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Share your thoughts about this book..."
                ></textarea>
              </div>
              <button
                onClick={submitReview}
                disabled={review.rating === 0 || !review.comment.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
              >
                Submit Review
              </button>
            </div>
          </div>
        )}

        {/* Reviews List */}
        {book.reviews?.length > 0 ? (
          <div className="space-y-4">
            {book.reviews.map((review, index) => (
              <div key={index} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{review.name}</h4>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-gray-700 mb-2">{review.comment}</p>

                {/* Review Image */}
                {review.reviewImage?.url && (
                  <div className="mt-2">
                    <img
                      src={review.reviewImage.url}
                      alt="Review attachment"
                      className="w-[150px] h-auto rounded-lg shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() =>
                        window.open(review.reviewImage?.url, "_blank")
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>

      {/* Related Books - Only show if there are related books */}
      {relatedBooks.length > 0 && (
        <div className="mt-8">
          <BookSection title="Related Books" books={relatedBooks} />
        </div>
      )}

      {/* Fullscreen Image Modal with Navigation */}
      {showFullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowFullscreenImage(false)}
        >
          <div className="relative max-w-4xl w-full max-h-full">
            {/* Close Button */}
            <button
              className="absolute  right-0 text-white text-3xl z-50 p-2 hover:text-red-400 transition-colors"
              onClick={() => setShowFullscreenImage(false)}
            >
              <FaTimes className="text-3xl" />
            </button>

            {/* Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl z-50 p-2 hover:text-indigo-400 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  <FaArrowLeft className="text-3xl" />
                </button>
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl z-50 p-2 hover:text-indigo-400 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <FaArrowRight className="text-3xl" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg bg-black bg-opacity-50 px-3 py-1 rounded-full">
                {selectedImage + 1} / {allImages.length}
              </div>
            )}

            {/* Main Image */}
            <img
              src={allImages[selectedImage]?.url}
              alt={book.name}
              className="w-full h-full object-contain max-h-screen"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* PDF Modal */}
      {showPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full h-[90vh] max-w-6xl relative flex flex-col">
            {/* Close button */}
            <button
              onClick={() => setShowPdf(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-3xl font-bold z-50"
            >
              &times;
            </button>

            {/* Modal Header */}
            <div className="p-4 border-b">
              <h2 className="text-2xl font-semibold text-center text-gray-800">
                📘 Sample Book Preview
              </h2>
            </div>

            {/* PDF Container */}
            <div className="flex-1 relative overflow-hidden">
              {/* PDF Viewer with restricted interactions */}
              <div className="absolute inset-0">
                <iframe
                  src={`${book.demoPdf.url}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0`}
                  title="Sample PDF"
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>

                {/* Block right-click and other interactions */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none"
                  onContextMenu={(e) => e.preventDefault()}
                ></div>
              </div>
            </div>

            {/* Custom Controls */}
            <div className="p-4 border-t flex justify-between items-center bg-gray-50">
              <span className="text-sm text-gray-600">Read-only preview</span>
              <button
                onClick={() => setShowPdf(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio Modal */}
      {showAudio && book.demoAudio && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative">
            {/* Close button */}
            <button
              onClick={() => setShowAudio(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-3xl font-bold z-50"
            >
              &times;
            </button>

            {/* Modal Header */}
            <div className="p-6 border-b">
              <h2 className="text-2xl font-semibold text-center text-gray-800">
                🎧 Sample Audio Preview
              </h2>
            </div>

            {/* Audio Player */}
            <div className="p-6">
              <audio controls className="w-full" src={book.demoAudio.url}>
                Your browser does not support the audio element.
              </audio>
            </div>

            {/* Custom Controls */}
            <div className="p-4 border-t flex justify-between items-center bg-gray-50">
              <span className="text-sm text-gray-600">
                Sample audio preview
              </span>
              <button
                onClick={() => setShowAudio(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;

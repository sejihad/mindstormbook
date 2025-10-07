import { useEffect, useState } from "react";
import {
  FaMinus,
  FaPlus,
  FaRegStar,
  FaShoppingCart,
  FaStar,
  FaTimes,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { addItemsToCart } from "../../actions/cartAction";
import { myOrders } from "../../actions/orderAction";
import {
  getPackageDetails,
  newPacakgeReview,
} from "../../actions/packageAction";
import Loader from "../../component/layout/Loader/Loader";
import { NEW_REVIEW_RESET } from "../../constants/packageConstants";

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

const PackageDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { loading, package: pkg } = useSelector(
    (state) => state.packageDetails
  );
  const [showPdf, setShowPdf] = useState(false);
  const { orders } = useSelector((state) => state.myOrders);
  const { user } = useSelector((state) => state.user);
  const { success: reviewSuccess } = useSelector(
    (state) => state.newPackageReview
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeBookTab, setActiveBookTab] = useState(0); // Start with first book
  const [review, setReview] = useState({ rating: 0, comment: "" });
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);

  useEffect(() => {
    dispatch(getPackageDetails(slug));
    dispatch(myOrders());
    if (reviewSuccess) {
      dispatch(getPackageDetails(slug));
      toast.success("Review Created Success");
      dispatch({ type: NEW_REVIEW_RESET });
    }
  }, [dispatch, slug, reviewSuccess]);

  const addToCartHandler = () => {
    dispatch(addItemsToCart("package", pkg._id, quantity));
    navigate("/cart");
    toast.success("Package Added To Cart");
  };

  const hasReviewed = pkg?.reviews?.some((r) => r.user === user?._id);
  const handleBuyNow = (item) => {
    navigate("/checkout", {
      state: {
        cartItems: [item],
        type: "package",
      },
    });
  };

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => quantity > 1 && setQuantity(quantity - 1);
  const hasCompletedOrder = orders?.some(
    (order) =>
      order.order_status === "completed" &&
      order.orderItems?.some((item) => item.id === pkg._id)
  );

  const submitReview = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(newPacakgeReview({ ...review, packageId: pkg._id }));
    setReview({ rating: 0, comment: "" });
  };

  if (loading || !pkg) return <Loader />;

  const allImages = [pkg.image, ...(pkg.images || [])].filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Main Package Section - 3 Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-8">
        {/* Left Column - Package Images */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            {/* Main Image */}
            <div
              className="flex justify-center mb-4 h-48 cursor-zoom-in"
              onClick={() => setShowFullscreenImage(true)}
            >
              <img
                src={allImages[selectedImage]?.url}
                alt={pkg.name}
                className="h-full object-contain"
              />
            </div>

            {/* Thumbnail Slider */}
            {allImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto py-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setShowFullscreenImage(false);
                    }}
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
          </div>
        </div>

        {/* Middle Column - Package Information */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-full">
            <div className="mb-2">
              <h1 className="text-xl font-bold text-gray-900">{pkg.name}</h1>
              {pkg.title && (
                <p className="text-gray-500 opacity-80">{pkg.title}</p>
              )}
            </div>

            <div className="flex items-center mb-4">
              <StarRating rating={pkg.ratings || 0} />
              <span className="ml-2 text-gray-600">
                ({pkg.numOfReviews} reviews)
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {pkg.description}
              </p>
            </div>

            {/* Books in Package - Dynamic */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Books Included ({pkg.books?.length || 0})
              </h3>

              {pkg.books?.length > 0 && (
                <>
                  <div className="border-b border-gray-200 mb-4">
                    <nav className="-mb-px flex space-x-4 overflow-x-auto">
                      {pkg.books.map((book, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveBookTab(index)}
                          className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                            activeBookTab === index
                              ? "border-indigo-500 text-indigo-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          Book {index + 1}
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">
                        {pkg.books[activeBookTab]?.name}
                      </h4>
                      <p className="text-gray-600">
                        by {pkg.books[activeBookTab]?.writer}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Publisher:</span>{" "}
                        {pkg.books[activeBookTab]?.publisher || "N/A"}
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm">
                          Published:{" "}
                          {pkg.books[activeBookTab]?.publishDate &&
                            new Date(
                              pkg.books[activeBookTab].publishDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-500">Language:</span>{" "}
                        {pkg.books[activeBookTab]?.language || "N/A"}
                      </div>

                      <div>
                        <span className="text-gray-500">ISBN-13:</span>{" "}
                        {pkg.books[activeBookTab]?.isbn13 || "N/A"}
                      </div>
                    </div>
                    {pkg.books[activeBookTab]?.demoPdf?.url && (
                      <button
                        onClick={() => setShowPdf(true)}
                        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition"
                      >
                        Read Sample PDF
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* PDF Preview Modal */}
              {showPdf && pkg.books[activeBookTab]?.demoPdf?.url && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl shadow-2xl w-full h-[90vh] max-w-6xl relative flex flex-col">
                    <button
                      onClick={() => setShowPdf(false)}
                      className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-3xl font-bold z-50"
                    >
                      &times;
                    </button>

                    <div className="p-4 border-b">
                      <h2 className="text-2xl font-semibold text-center text-gray-800">
                        📘 Sample Book Preview
                      </h2>
                    </div>

                    <div className="flex-1 relative overflow-hidden">
                      <div className="absolute inset-0">
                        <iframe
                          src={`${pkg.books[activeBookTab].demoPdf.url}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0`}
                          title="Sample PDF"
                          className="w-full h-full"
                          frameBorder="0"
                          allowFullScreen
                        ></iframe>

                        <div
                          className="absolute inset-0 z-10 pointer-events-none"
                          onContextMenu={(e) => e.preventDefault()}
                        ></div>
                      </div>
                    </div>

                    <div className="p-4 border-t flex justify-between items-center bg-gray-50">
                      <span className="text-sm text-gray-600">
                        Read-only preview
                      </span>
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
            </div>
          </div>
        </div>

        {/* Right Column - Purchase Options */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-4">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-indigo-600">
                ${pkg.discountPrice}
              </span>
              {pkg.oldPrice > pkg.discountPrice && (
                <span className="text-lg text-gray-400 line-through ml-3">
                  ${pkg.oldPrice}
                </span>
              )}
            </div>

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

              {pkg.deliveryTime && (
                <div className="text-sm text-gray-600 mb-2">
                  <span>Delivery: </span>
                  <span className="font-medium">{pkg.deliveryTime}</span>
                </div>
              )}

              {pkg.deliverToCountries && (
                <div className="text-sm text-gray-600">
                  <span>Ships to: </span>
                  <span className="font-medium">{pkg.deliverToCountries}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={addToCartHandler}
                className="w-full flex items-center justify-center py-2 px-4 rounded-md font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
              >
                <FaShoppingCart className="mr-2" />
                Add to Cart
              </button>
              <button
                onClick={() =>
                  handleBuyNow({
                    id: pkg._id,
                    name: pkg.name,
                    image: pkg.image.url,
                    price: pkg.discountPrice,
                    quantity: quantity,
                    type: "package",
                  })
                }
                className="w-full py-2 px-4 rounded-md font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {showFullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowFullscreenImage(false)}
        >
          <div className="relative max-w-4xl w-full max-h-full">
            <button
              className="absolute -top-12 right-0 text-white text-3xl z-50 p-2"
              onClick={() => setShowFullscreenImage(false)}
            >
              <FaTimes className="text-3xl" />
            </button>
            <img
              src={allImages[selectedImage]?.url}
              alt={pkg.name}
              className="w-full h-full object-contain max-h-screen"
            />
          </div>
        </div>
      )}

      {/* Video Section */}
      {pkg.videoLink && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Package Preview
          </h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={pkg.videoLink}
              title="Package Video"
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
                  placeholder="Share your thoughts about this package..."
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
        {pkg.reviews?.length > 0 ? (
          <div className="space-y-4">
            {pkg.reviews.map((review, index) => (
              <div key={index} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{review.name}</h4>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default PackageDetails;

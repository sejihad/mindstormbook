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
import { Link, useNavigate, useParams } from "react-router-dom";
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
            type: "package",
          },
        },
      });
      return;
    }

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
      {/* Main Package Section - 3 Column Layout with equal height */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-8 items-stretch">
        {/* Left Column - Package Images */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 h-full flex flex-col">
            {/* Main Image */}
            <div
              className="flex justify-center mb-4 h-48 cursor-zoom-in flex-shrink-0"
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
              <div className="flex space-x-2 overflow-x-auto py-2 mt-auto">
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
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-full flex flex-col">
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
          </div>
        </div>

        {/* Right Column - Purchase Options */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-full sticky top-4">
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

      {/* Books Section - Moved below the 3 columns */}
      {pkg.books?.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            Books Included ({pkg.books?.length || 0})
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
            {pkg.books.map((book, index) => (
              <Link
                key={book._id}
                target="_blank"
                to={`/${book.type}/${book.category}/${book.slug}`}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                {/* Book Image Only */}
                <div className="mb-3">
                  <img
                    src={book.image?.url}
                    alt={book.name}
                    className="w-32 h-40 object-cover rounded border"
                  />
                </div>

                {/* Book Name Only */}
                <h4 className="font-medium text-gray-900 text-center text-sm">
                  {book.name}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}

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

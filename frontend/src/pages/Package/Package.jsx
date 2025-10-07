import { useEffect, useState } from "react";
import {
  FaBook,
  FaBox,
  FaRegStar,
  FaSearch,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import { addItemsToCart } from "../../actions/cartAction";
import { getPackages } from "../../actions/packageAction";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";

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

const PackagesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { packages, loading } = useSelector((state) => state.packages);
  const { user } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getPackages());
  }, [dispatch]);

  const handleBuyNow = (item) => {
    navigate("/checkout", {
      state: {
        cartItems: [item],
        type: "package",
      },
    });
  };

  const addToCartHandler = (id, q) => {
    dispatch(addItemsToCart("package", id, q));
    toast.success("Package Added To Cart");
  };

  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <MetaData title="All Book Packages" />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search packages..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 whitespace-nowrap">
                {filteredPackages.length} Packages Available
              </h2>
            </div>

            {/* No Packages Message */}
            {filteredPackages.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No packages found
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Try a different search term"
                    : "Check back later for new packages"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredPackages.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="bg-white border-amber-50 shadow-md hover:shadow-lg transition duration-300 overflow-hidden flex flex-col h-full"
                  >
                    {/* Image Section */}
                    <div className="relative border-gray-200 group">
                      <Link
                        to={`/package/${slugify(pkg.name, {
                          lower: true,
                          strict: true,
                        })}`}
                        className="block"
                      >
                        <img
                          src={pkg.image?.url}
                          alt={pkg.name}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                        />
                      </Link>
                      {pkg.oldPrice > pkg.discountPrice && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                          -
                          {Math.round(
                            ((pkg.oldPrice - pkg.discountPrice) /
                              pkg.oldPrice) *
                              100
                          )}
                          %
                        </span>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-4 flex-grow flex flex-col">
                      {/* Title */}
                      <Link
                        to={`/package/${slugify(pkg.name, {
                          lower: true,
                          strict: true,
                        })}`}
                        className="block"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 mb-1 line-clamp-2 h-14">
                          {pkg.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      <StarRating rating={pkg.ratings || 0} />

                      {/* Package Info */}
                      <div className="mt-3 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FaBook className="mr-2 text-blue-500 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {Object.keys(pkg.books || {}).length} books included
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FaBox className="mr-2 text-indigo-500 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {pkg.deliveryTime || "Standard shipping"}
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-indigo-600">
                            ${pkg.discountPrice}
                          </span>
                          {pkg.oldPrice > pkg.discountPrice && (
                            <span className="ml-2 text-sm line-through text-gray-400">
                              ${pkg.oldPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons - pushed to bottom */}
                      <div className="mt-auto pt-4 space-y-2">
                        <button
                          onClick={() =>
                            handleBuyNow({
                              id: pkg._id,
                              name: pkg.name,
                              image: pkg.image.url,
                              price: pkg.discountPrice,
                              quantity: 1,
                              type: "package",
                            })
                          }
                          className="w-full bg-gradient-to-r from-indigo-500 to-indigo-500 text-white font-medium py-2 rounded hover:from-indigo-600 hover:to-indigo-600 transition"
                        >
                          Buy Now
                        </button>
                        <button
                          onClick={() => addToCartHandler(pkg._id, 1)}
                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium py-2 rounded hover:from-blue-600 hover:to-indigo-600 transition"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;

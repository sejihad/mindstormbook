// src/component/PackageSection.jsx
import {
  FaBook,
  FaBox,
  FaRegStar,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
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

const PackageSection = ({ title, packages, loading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
              to="/packages"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Show All →
            </Link>
          </div>

          {packages.length === 0 ? (
            <div className="text-center text-gray-500 text-lg py-10">
              No packages added yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="bg-white shadow-md hover:shadow-lg transition duration-300 border-amber-50 overflow-hidden flex flex-col h-full"
                >
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
                          ((pkg.oldPrice - pkg.discountPrice) / pkg.oldPrice) *
                            100
                        )}
                        %
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-grow flex flex-col">
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
        </section>
      )}
    </>
  );
};

export default PackageSection;

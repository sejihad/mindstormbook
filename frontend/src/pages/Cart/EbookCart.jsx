import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { removeItemsEbookFromCart } from "../../actions/ebookCartAction";

const EbookCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ebookCartItems } = useSelector((state) => state.ebookCart);
  const { user } = useSelector((state) => state.user);

  const removeFromCart = (id) => {
    dispatch(removeItemsEbookFromCart(id));
    toast.success("Item Removed from Cart");
  };

  const goToCheckout = () => {
    navigate("/checkout", {
      state: {
        cartItems: ebookCartItems,
        type: "ebook",
      },
    });
  };

  // Total Price Calculation
  const totalPrice = ebookCartItems.reduce((acc, item) => {
    const price = item.price;
    return acc + price * (item.quantity || 1); // default quantity 1 if not present
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Your eBooks Cart
      </h2>

      {ebookCartItems.length === 0 ? (
        <div className="text-center text-gray-600">
          Your eBook cart is empty. <br />
          <Link to="/ebook" className="text-indigo-600 hover:underline">
            Browse eBooks
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 divide-y bg-white rounded shadow-md">
            {ebookCartItems.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 items-center"
              >
                <div className="col-span-1">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-32 object-cover rounded"
                  />
                </div>
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-indigo-600 font-medium">
                    ${item.discountPrice || item.price}
                  </p>
                </div>
                <div className="col-span-1 text-right">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Remove from cart"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total Price */}
          <div className="flex justify-end mt-4 text-lg font-semibold">
            Total:{" "}
            <span className="ml-2 text-indigo-700">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={goToCheckout}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EbookCart;

import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addItemsToCart, removeItemsFromCart } from "../../actions/cartAction";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { CartItems } = useSelector((state) => state.Cart);
  const { user } = useSelector((state) => state.user);

  const removeFromCart = (id) => {
    dispatch(removeItemsFromCart(id));
    toast.success("Item Removed from Cart");
  };

  const increaseQuantity = (type, id, quantity) => {
    dispatch(addItemsToCart(type, id, quantity + 1));
  };

  const decreaseQuantity = (type, id, quantity) => {
    if (quantity <= 1) return;
    dispatch(addItemsToCart(type, id, quantity - 1));
  };

  const goToCheckout = () => {
    CartItems.map((item, i) => {
      console.log(item.type);
      navigate("/checkout", {
        state: {
          cartItems: CartItems,
          type: item.type,
        },
      });
    });
  };

  const totalPrice = CartItems.reduce((acc, item) => {
    const price = item.price;
    return acc + price * item.quantity;
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">Your Cart</h2>

      {CartItems.length === 0 ? (
        <div className="text-center text-gray-600">
          Your cart is empty. <br />
          <Link to="/shop" className="text-blue-600 hover:underline">
            Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 divide-y bg-white rounded shadow-md">
            {CartItems.map((item) => {
              const price = item.discountPrice || item.price;
              const subtotal = price * item.quantity;

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 items-center"
                >
                  <div className="col-span-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-32 object-cover rounded"
                    />
                  </div>
                  <div className="col-span-2">
                    <h3 className="text-lg font-semibold">
                      {item.name}
                      {""}
                      {item.title}
                    </h3>
                    <p className="text-indigo-600 font-medium">
                      Price: ${price.toFixed(2)}
                    </p>
                    <p className="text-green-600 font-medium">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full 
                ${
                  item.type === "ebook"
                    ? "bg-purple-100 text-purple-800"
                    : item.type === "book"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-orange-100 text-orange-800"
                }`}
                      >
                        {item.type}
                      </span>
                    </p>
                  </div>
                  <div className="col-span-1">
                    {item.type === "ebook" ? (
                      <span className="px-2">{item.quantity}</span>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            decreaseQuantity(item.type, item.id, item.quantity)
                          }
                          className="bg-gray-300 px-2 rounded"
                        >
                          -
                        </button>
                        <span className="px-2">{item.quantity}</span>
                        <button
                          onClick={() =>
                            increaseQuantity(item.type, item.id, item.quantity)
                          }
                          className="bg-gray-300 px-2 rounded"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="col-span-1 text-right font-semibold">
                    ${subtotal.toFixed(2)}
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
              );
            })}
          </div>

          <div className="flex justify-end mt-6">
            <div className="bg-white shadow-md rounded p-4 w-full max-w-sm">
              <h3 className="text-xl font-semibold mb-4 text-center">
                Order Summary
              </h3>
              <div className="flex justify-between mb-2">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={goToCheckout}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

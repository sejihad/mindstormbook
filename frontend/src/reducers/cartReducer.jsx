import { ADD_TO_CART, REMOVE_CART_ITEM } from "../constants/cartContants";

export const CartReducer = (
  state = { CartItems: [], cartCount: 0 },
  action
) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const item = action.payload;
      const isItemExist = state.CartItems.find((i) => i.id === item.id);

      let updatedCart;
      if (isItemExist) {
        updatedCart = state.CartItems.map((i) => (i.id === item.id ? item : i));
      } else {
        updatedCart = [...state.CartItems, item];
      }

      return {
        ...state,
        CartItems: updatedCart,
        cartCount: updatedCart.reduce(
          (total, i) => total + (i.quantity || 1),
          0
        ),
      };
    }

    case REMOVE_CART_ITEM: {
      const updatedCart = state.CartItems.filter(
        (i) => i.id !== action.payload
      );
      return {
        ...state,
        CartItems: updatedCart,
        cartCount: updatedCart.reduce(
          (total, i) => total + (i.quantity || 1),
          0
        ),
      };
    }

    default:
      return state;
  }
};

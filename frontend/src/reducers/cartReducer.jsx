import { ADD_TO_CART, REMOVE_CART_ITEM } from "../constants/cartContants";

export const CartReducer = (state = { CartItems: [] }, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;

      const isItemExist = state.CartItems.find((i) => i.id === item.id);

      if (isItemExist) {
        return {
          ...state,
          CartItems: state.CartItems.map((i) =>
            i.id === isItemExist.id ? item : i
          ),
        };
      } else {
        return {
          ...state,
          CartItems: [...state.CartItems, item],
        };
      }

    case REMOVE_CART_ITEM:
      return {
        ...state,
        CartItems: state.CartItems.filter((i) => i.id !== action.payload),
      };

    default:
      return state;
  }
};

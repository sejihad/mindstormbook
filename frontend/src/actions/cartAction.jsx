import axios from "axios";

import { ADD_TO_CART, REMOVE_CART_ITEM } from "../constants/cartContants.jsx";
const API_URL = import.meta.env.VITE_API_URL;
// Add to Cart

export const addItemsToCart =
  (type, id, quantity) => async (dispatch, getState) => {
    let pluralType = "";
    if (type === "book" || type === "ebook" || type === "audiobook") {
      pluralType = "books";
    } else if (type === "package") {
      pluralType = "packages";
    } else {
      throw new Error(`Invalid type: ${type}`);
    }

    const { data } = await axios.get(`${API_URL}/api/v1/${pluralType}/${id}`);

    const item = data.book || data.package;

    // Package হলে books array পাঠানো হবে
    const payload = {
      id: item._id,
      name: item.name,
      title: item.title,
      price: item.discountPrice,
      image: item.image.url,
      type: type === "package" ? "package" : item.type,
      quantity,
      ...(type === "package" && { books: item.books || [] }), // শুধুমাত্র package-এর জন্য
    };

    dispatch({
      type: ADD_TO_CART,
      payload,
    });

    localStorage.setItem(
      "CartItems",
      JSON.stringify(getState().Cart.CartItems)
    );
  };

// REMOVE FROM CART
export const removeItemsFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_CART_ITEM,
    payload: id,
  });

  localStorage.setItem("CartItems", JSON.stringify(getState().Cart.CartItems));
};

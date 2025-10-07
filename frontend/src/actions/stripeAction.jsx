import axios from "axios";
import {
  CREATE_STRIPE_FAIL,
  CREATE_STRIPE_REQUEST,
  CREATE_STRIPE_SUCCESS,
} from "../constants/paymentContants";

const API_URL = import.meta.env.VITE_API_URL;

export const stripeOrderCreate = (orderData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_STRIPE_REQUEST });

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    // 👇 POST orderData to backend to create a Stripe session
    const { data } = await axios.post(
      `${API_URL}/api/v1/stripe/checkout`,
      orderData,
      config
    );

    // 👇 Redirect to Stripe checkout URL
    if (data.url) {
      window.location.href = data.url;
    }

    dispatch({
      type: CREATE_STRIPE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: CREATE_STRIPE_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

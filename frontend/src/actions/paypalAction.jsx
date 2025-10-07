import axios from "axios";
import {
  CREATE_PAYPAL_FAIL,
  CREATE_PAYPAL_REQUEST,
  CREATE_PAYPAL_SUCCESS,
} from "../constants/paymentContants";

const API_URL = import.meta.env.VITE_API_URL;

export const paypalOrderCreate = (orderData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_PAYPAL_REQUEST });

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    // 👇 POST orderData to backend to create a Stripe session
    const { data } = await axios.post(
      `${API_URL}/api/v1/paypal/checkout`,
      orderData,
      config
    );

    // 👇 Redirect to Stripe checkout URL
    if (data.id) {
      window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${data.id}`;
    }
    //     if (data.id) {
    //   window.location.href = `https://www.paypal.com/checkoutnow?token=${data.id}`;
    // }

    dispatch({
      type: CREATE_PAYPAL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: CREATE_PAYPAL_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

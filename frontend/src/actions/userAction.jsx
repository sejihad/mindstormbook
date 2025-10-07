import axios from "axios";
import {
  ACCOUNT_DELETE_FAIL,
  ACCOUNT_DELETE_REQUEST,
  ACCOUNT_DELETE_SUCCESS,
  ALL_USERS_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  CLEAR_ERRORS,
  CONTACT_USER_FAIL,
  CONTACT_USER_REQUEST,
  CONTACT_USER_SUCCESS,
  DELETE_USER_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  LOAD_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_FAIL,
  LOGOUT_SUCCESS,
  OTP_REQUIRED,
  REGISTER_USER_FAIL,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  RESET_OTP_MESSAGE,
  RESET_OTP_STATE,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  TOGGLE_2FA_FAIL,
  TOGGLE_2FA_REQUEST,
  TOGGLE_2FA_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
} from "../constants/userContants.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.post(
      `${API_URL}/api/v1/login`,
      { email, password },
      config
    );

    if (data.twoFactorRequired) {
      // 2FA OTP দরকার, সরাসরি login নয়
      dispatch({
        type: OTP_REQUIRED,
        payload: {
          message: data.message,
          userId: data.userId,
        },
      });
    } else {
      // ✅ সরাসরি login
      localStorage.setItem("token", data.token);
      dispatch({ type: LOGIN_SUCCESS, payload: data.user });
    }
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response?.data?.message || "Login Failed",
    });
  }
};

export const verifyOtp = (userId, otp) => async (dispatch) => {
  try {
    dispatch({ type: "VERIFY_OTP_REQUEST" });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.post(
      `${API_URL}/api/v1/verify-otp`,
      { userId, otp },
      config
    );

    localStorage.setItem("token", data.token);

    dispatch({ type: "VERIFY_OTP_SUCCESS", payload: data.user });
  } catch (error) {
    dispatch({
      type: "VERIFY_OTP_FAIL",
      payload: error.response?.data?.message || "OTP verification failed",
    });
  }
};

export const resetOtpState = () => async (dispatch) => {
  dispatch({ type: RESET_OTP_STATE });
};
export const resetOtpMessage = () => async (dispatch) => {
  dispatch({ type: RESET_OTP_MESSAGE });
};
// google login
export const googleLogin = (userData) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    // এখানে তোমার Google Login API Call হবে
    const { data } = await axios.post(`${API_URL}/api/v1/google`, userData);

    // Token localStorage এ সংরক্ষণ (যদি দরকার হয়)
    localStorage.setItem("token", data.token);

    // Redux এ user persist
    dispatch({ type: LOGIN_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response?.data?.message || "Google Login Failed",
    });
  }
};

// ✅ Register
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    const { data } = await axios.post(
      `${API_URL}/api/v1/register`,
      userData,
      config
    );

    dispatch({ type: REGISTER_USER_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({
      type: REGISTER_USER_FAIL,
      payload: error.response?.data?.message || "Registration Failed",
    });
  }
};
// loadUser
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });

    const token = localStorage.getItem("token"); // ✅ LocalStorage থেকে Token নিন

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Bearer সহ পাঠানো হচ্ছে
      },
    };

    const { data } = await axios.get(`${API_URL}/api/v1/me`, config);

    dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: LOAD_USER_FAIL,
      payload: error.response?.data?.message || "Failed to load user",
    });
  }
};

// logout
export const logout = () => async (dispatch) => {
  try {
    // Request to backend to log the user out
    await axios.post(`${API_URL}/api/v1/logout`);

    // ✅ Remove token from LocalStorage
    localStorage.removeItem("token");

    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    dispatch({
      type: LOGOUT_FAIL,
      payload: error.response?.data?.message || "Logout failed",
    });
  }
};

// update profile
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/v1/me/update`,
      userData,
      config
    );

    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Password
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PASSWORD_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/v1/password/update`,
      passwords,
      config
    );

    dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.post(
      `${API_URL}/api/v1/password/forgot`,
      email,
      config
    );

    dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Reset Password
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.put(
      `${API_URL}/api/v1/password/reset/${token}`,
      passwords,
      config
    );

    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

// get All Users
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_USERS_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${API_URL}/api/v1/admin/users`, config);

    dispatch({ type: ALL_USERS_SUCCESS, payload: data.users });
  } catch (error) {
    dispatch({ type: ALL_USERS_FAIL, payload: error.response.data.message });
  }
};

// get  User Details
export const getUserDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${API_URL}/api/v1/admin/user/${id}`,
      config
    );

    dispatch({ type: USER_DETAILS_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: USER_DETAILS_FAIL, payload: error.response.data.message });
  }
};

// Update User
export const updateUser = (id, userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST });
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/v1/admin/user/${id}`,
      userData,
      config
    );

    dispatch({ type: UPDATE_USER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete User
export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.delete(
      `${API_URL}/api/v1/admin/user/${id}`,
      config
    );

    dispatch({ type: DELETE_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DELETE_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const toggleTwoFactor = () => async (dispatch) => {
  try {
    dispatch({ type: TOGGLE_2FA_REQUEST });
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.put(
      `${API_URL}/api/v1/twofactor/toggle`,
      {},
      config
    );

    dispatch({
      type: TOGGLE_2FA_SUCCESS,
      payload: data, // updated user
    });
  } catch (error) {
    dispatch({
      type: TOGGLE_2FA_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
export const DeleteAccountRequest = (userData) => async (dispatch) => {
  try {
    dispatch({ type: ACCOUNT_DELETE_REQUEST });
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.post(
      `${API_URL}/api/v1/me/delete`,
      userData,
      config
    );

    dispatch({
      type: ACCOUNT_DELETE_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: ACCOUNT_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
export const ContactUs = (userData) => async (dispatch) => {
  try {
    dispatch({ type: CONTACT_USER_REQUEST });
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.post(
      `${API_URL}/api/v1/contact/us`,
      userData,
      config
    );

    dispatch({
      type: CONTACT_USER_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: CONTACT_USER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Clear Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

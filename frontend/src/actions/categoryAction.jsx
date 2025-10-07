import axios from "axios";
import {
  ADMIN_CATEGORY_FAIL,
  ADMIN_CATEGORY_REQUEST,
  ADMIN_CATEGORY_SUCCESS,
  ALL_CATEGORY_FAIL,
  ALL_CATEGORY_REQUEST,
  ALL_CATEGORY_SUCCESS,
  CATEGORY_DETAILS_FAIL,
  CATEGORY_DETAILS_REQUEST,
  CATEGORY_DETAILS_SUCCESS,
  CLEAR_ERRORS,
  DELETE_CATEGORY_FAIL,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  NEW_CATEGORY_FAIL,
  NEW_CATEGORY_REQUEST,
  NEW_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAIL,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_SUCCESS,
} from "../constants/categoryContants";

const API_URL = import.meta.env.VITE_API_URL;
export const getCategory = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_CATEGORY_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/categories`);

    dispatch({
      type: ALL_CATEGORY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_CATEGORY_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getAdminCategory = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_CATEGORY_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${API_URL}/api/v1/admin/categories`,
      config
    );

    dispatch({
      type: ADMIN_CATEGORY_SUCCESS,
      payload: data.categories,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_CATEGORY_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getCategoryDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_DETAILS_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/category/${id}`);

    dispatch({
      type: CATEGORY_DETAILS_SUCCESS,
      payload: data.category,
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_DETAILS_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};
// Create BLOG
export const createCategory = (categoryData) => async (dispatch) => {
  try {
    // Dispatching NEW_BLOG_REQUEST action to show loading
    dispatch({ type: NEW_CATEGORY_REQUEST });

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data", // Make sure to add content-type if it's multipart form-data
        Authorization: `Bearer ${token}`,
      },
    };

    // Sending POST request
    const { data } = await axios.post(
      `${API_URL}/api/v1/admin/category/new`,
      categoryData,
      config
    );

    // Dispatch success action with the response data
    dispatch({
      type: NEW_CATEGORY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    // Dispatching failure action with error message
    dispatch({
      type: NEW_CATEGORY_FAIL,
      payload: error.response?.data?.message || "Something went wrong!",
    });
  }
};

export const deleteCategory = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_CATEGORY_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.delete(
      `${API_URL}/api/v1/admin/category/${id}`,
      config
    );

    dispatch({
      type: DELETE_CATEGORY_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_CATEGORY_FAIL,
      payload: error.response.data.message,
    });
  }
};
export const updateCategory = (id, blogData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_CATEGORY_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/v1/admin/category/${id}`,
      blogData,
      config
    );

    dispatch({
      type: UPDATE_CATEGORY_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_CATEGORY_FAIL,
      payload: error.response.data.message,
    });
  }
};
// ✅ Errors Clear
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

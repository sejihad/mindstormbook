import axios from "axios";
import {
  ADMIN_BLOG_FAIL,
  ADMIN_BLOG_REQUEST,
  ADMIN_BLOG_SUCCESS,
  ALL_BLOG_FAIL,
  ALL_BLOG_REQUEST,
  ALL_BLOG_SUCCESS,
  BLOG_DETAILS_FAIL,
  BLOG_DETAILS_REQUEST,
  BLOG_DETAILS_SUCCESS,
  CLEAR_ERRORS,
  DELETE_BLOG_FAIL,
  DELETE_BLOG_REQUEST,
  DELETE_BLOG_SUCCESS,
  NEW_BLOG_FAIL,
  NEW_BLOG_REQUEST,
  NEW_BLOG_SUCCESS,
  UPDATE_BLOG_FAIL,
  UPDATE_BLOG_REQUEST,
  UPDATE_BLOG_SUCCESS,
} from "../constants/blogContants";
const API_URL = import.meta.env.VITE_API_URL;
export const getBlog = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_BLOG_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/blogs`);

    dispatch({
      type: ALL_BLOG_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_BLOG_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getAdminBlog = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_BLOG_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${API_URL}/api/v1/admin/blogs`, config);

    dispatch({
      type: ADMIN_BLOG_SUCCESS,
      payload: data.blogs,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_BLOG_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getBlogDetails = (slug) => async (dispatch) => {
  try {
    dispatch({ type: BLOG_DETAILS_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/blog/${slug}`);

    dispatch({
      type: BLOG_DETAILS_SUCCESS,
      payload: data.blog,
    });
  } catch (error) {
    dispatch({
      type: BLOG_DETAILS_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};
export const getAdminBlogDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: BLOG_DETAILS_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${API_URL}/api/v1/admin/blog/${id}`,
      config
    );

    dispatch({
      type: BLOG_DETAILS_SUCCESS,
      payload: data.blog,
    });
  } catch (error) {
    dispatch({
      type: BLOG_DETAILS_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};
// Create BLOG
export const createBlog = (blogData) => async (dispatch) => {
  try {
    // Dispatching NEW_BLOG_REQUEST action to show loading
    dispatch({ type: NEW_BLOG_REQUEST });

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data", // Make sure to add content-type if it's multipart form-data
        Authorization: `Bearer ${token}`,
      },
    };

    // Sending POST request
    const { data } = await axios.post(
      `${API_URL}/api/v1/admin/blog/new`,
      blogData,
      config
    );

    // Dispatch success action with the response data
    dispatch({
      type: NEW_BLOG_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_BLOG_FAIL,
      payload: error.response?.data?.message || "Something went wrong!",
    });
  }
};

export const deleteBlog = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_BLOG_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.delete(
      `${API_URL}/api/v1/admin/blog/${id}`,
      config
    );

    dispatch({
      type: DELETE_BLOG_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_BLOG_FAIL,
      payload: error.response.data.message,
    });
  }
};
export const updateBlog = (id, blogData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_BLOG_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/v1/admin/blog/${id}`,
      blogData,
      config
    );

    dispatch({
      type: UPDATE_BLOG_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_BLOG_FAIL,
      payload: error.response.data.message,
    });
  }
};
// ✅ Errors Clear
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

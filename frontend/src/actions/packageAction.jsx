import axios from "axios";
import {
  ADMIN_PACKAGE_FAIL,
  ADMIN_PACKAGE_REQUEST,
  ADMIN_PACKAGE_SUCCESS,
  ALL_PACKAGE_FAIL,
  ALL_PACKAGE_REQUEST,
  ALL_PACKAGE_SUCCESS,
  CLEAR_ERRORS,
  DELETE_PACKAGE_FAIL,
  DELETE_PACKAGE_REQUEST,
  DELETE_PACKAGE_SUCCESS,
  NEW_PACKAGE_FAIL,
  NEW_PACKAGE_REQUEST,
  NEW_PACKAGE_SUCCESS,
  NEW_REVIEW_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  PACKAGE_DETAILS_FAIL,
  PACKAGE_DETAILS_REQUEST,
  PACKAGE_DETAILS_SUCCESS,
  UPDATE_PACKAGE_FAIL,
  UPDATE_PACKAGE_REQUEST,
  UPDATE_PACKAGE_SUCCESS,
} from "../constants/packageConstants";
const API_URL = import.meta.env.VITE_API_URL;

// Get All Packages
export const getPackages = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_PACKAGE_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/packages`);

    dispatch({
      type: ALL_PACKAGE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PACKAGE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get Admin Packages
export const getAdminPackages = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_PACKAGE_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${API_URL}/api/v1/admin/packages`,
      config
    );

    dispatch({
      type: ADMIN_PACKAGE_SUCCESS,
      payload: data.packages,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_PACKAGE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get Package Details
export const getPackageDetails = (slug) => async (dispatch) => {
  try {
    dispatch({ type: PACKAGE_DETAILS_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/package/${slug}`);

    dispatch({
      type: PACKAGE_DETAILS_SUCCESS,
      payload: data.package,
    });
  } catch (error) {
    dispatch({
      type: PACKAGE_DETAILS_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};
export const getAdminPackageDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PACKAGE_DETAILS_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${API_URL}/api/v1/admin/package/${id}`,
      config
    );

    dispatch({
      type: PACKAGE_DETAILS_SUCCESS,
      payload: data.package,
    });
  } catch (error) {
    dispatch({
      type: PACKAGE_DETAILS_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// Create New Package
export const createPackage = (packageData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_PACKAGE_REQUEST });

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/v1/admin/package/new`,
      packageData,
      config
    );

    dispatch({
      type: NEW_PACKAGE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: NEW_PACKAGE_FAIL,
      payload: error.response?.data?.message,
    });
  }
};

// Update Package
export const updatePackage = (id, packageData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PACKAGE_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/v1/admin/package/${id}`,
      packageData,
      config
    );

    dispatch({
      type: UPDATE_PACKAGE_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PACKAGE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete Package
export const deletePackage = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PACKAGE_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.delete(
      `${API_URL}/api/v1/admin/package/${id}`,
      config
    );

    dispatch({
      type: DELETE_PACKAGE_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_PACKAGE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Create Package Review
export const newPacakgeReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_REVIEW_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/v1/review/package`,
      reviewData,
      config
    );

    dispatch({
      type: NEW_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

import axios from "axios";
import {
  CLEAR_ERRORS,
  DELETE_NOTIFICATION_FAIL,
  DELETE_NOTIFICATION_REQUEST,
  DELETE_NOTIFICATION_SUCCESS,
  GET_NOTIFICATION_FAIL,
  GET_NOTIFICATION_REQUEST,
  GET_NOTIFICATION_SUCCESS,
  NEW_NOTIFICATION_FAIL,
  NEW_NOTIFICATION_REQUEST,
  NEW_NOTIFICATION_SUCCESS,
  UPDATE_NOTIFICATION_FAIL,
  UPDATE_NOTIFICATION_REQUEST,
  UPDATE_NOTIFICATION_SUCCESS,
} from "../constants/notificationContants";
const API_URL = import.meta.env.VITE_API_URL;
// Create Notification
export const createNotification = (notificationData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_NOTIFICATION_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/v1/admin/notification`,
      notificationData,
      config
    );

    dispatch({
      type: NEW_NOTIFICATION_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_NOTIFICATION_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get Notification
export const getNotification = () => async (dispatch) => {
  try {
    dispatch({ type: GET_NOTIFICATION_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/notification`);

    dispatch({
      type: GET_NOTIFICATION_SUCCESS,
      payload: data.notification,
    });
  } catch (error) {
    dispatch({
      type: GET_NOTIFICATION_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Notification
export const updateNotification =
  (id, notificationData) => async (dispatch) => {
    try {
      dispatch({ type: UPDATE_NOTIFICATION_REQUEST });
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/api/v1/admin/notification/${id}`,
        notificationData,
        config
      );

      dispatch({
        type: UPDATE_NOTIFICATION_SUCCESS,
        payload: data.success,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_NOTIFICATION_FAIL,
        payload: error.response.data.message,
      });
    }
  };

// Delete Notification
export const deleteNotification = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_NOTIFICATION_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.delete(
      `${API_URL}/api/v1/admin/notification/${id}`,
      config
    );

    dispatch({
      type: DELETE_NOTIFICATION_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_NOTIFICATION_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

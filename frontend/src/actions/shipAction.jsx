import axios from "axios";
import {
  ADMIN_SHIP_FAIL,
  ADMIN_SHIP_REQUEST,
  ADMIN_SHIP_SUCCESS,
  ALL_SHIP_FAIL,
  ALL_SHIP_REQUEST,
  ALL_SHIP_SUCCESS,
  CLEAR_ERRORS,
  DELETE_SHIP_FAIL,
  DELETE_SHIP_REQUEST,
  DELETE_SHIP_SUCCESS,
  NEW_SHIP_FAIL,
  NEW_SHIP_REQUEST,
  NEW_SHIP_SUCCESS,
  SHIP_DETAILS_FAIL,
  SHIP_DETAILS_REQUEST,
  SHIP_DETAILS_SUCCESS,
  UPDATE_SHIP_FAIL,
  UPDATE_SHIP_REQUEST,
  UPDATE_SHIP_SUCCESS,
} from "../constants/shipContants";

const API_URL = import.meta.env.VITE_API_URL;

export const getShips = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_SHIP_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/ships`);

    dispatch({
      type: ALL_SHIP_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_SHIP_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

export const getAdminShips = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_SHIP_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${API_URL}/api/v1/admin/ships`, config);

    dispatch({
      type: ADMIN_SHIP_SUCCESS,
      payload: data.ships,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_SHIP_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

export const getShipDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: SHIP_DETAILS_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/ship/${id}`);

    dispatch({
      type: SHIP_DETAILS_SUCCESS,
      payload: data.ship,
    });
  } catch (error) {
    dispatch({
      type: SHIP_DETAILS_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

export const createShip = (shipData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_SHIP_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/v1/admin/ship/new`,
      shipData,
      config
    );

    dispatch({
      type: NEW_SHIP_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_SHIP_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

export const deleteShip = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_SHIP_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(
      `${API_URL}/api/v1/admin/ship/${id}`,
      config
    );

    dispatch({
      type: DELETE_SHIP_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_SHIP_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

export const updateShip = (id, shipData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_SHIP_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/v1/admin/ship/${id}`,
      shipData,
      config
    );

    dispatch({
      type: UPDATE_SHIP_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_SHIP_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

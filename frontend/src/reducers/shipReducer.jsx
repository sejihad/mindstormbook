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
  DELETE_SHIP_RESET,
  DELETE_SHIP_SUCCESS,
  NEW_SHIP_FAIL,
  NEW_SHIP_REQUEST,
  NEW_SHIP_RESET,
  NEW_SHIP_SUCCESS,
  SHIP_DETAILS_FAIL,
  SHIP_DETAILS_REQUEST,
  SHIP_DETAILS_SUCCESS,
  UPDATE_SHIP_FAIL,
  UPDATE_SHIP_REQUEST,
  UPDATE_SHIP_RESET,
  UPDATE_SHIP_SUCCESS,
} from "../constants/shipContants";

// All Ships Reducer
export const shipsReducer = (state = { ships: [] }, action) => {
  switch (action.type) {
    case ALL_SHIP_REQUEST:
    case ADMIN_SHIP_REQUEST:
      return {
        loading: true,
        ships: [],
      };
    case ALL_SHIP_SUCCESS:
      return {
        loading: false,
        ships: action.payload.ships,
      };
    case ADMIN_SHIP_SUCCESS:
      return {
        loading: false,
        ships: action.payload,
      };
    case ALL_SHIP_FAIL:
    case ADMIN_SHIP_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create New Ship Reducer
export const newShipReducer = (state = { ship: {} }, action) => {
  switch (action.type) {
    case NEW_SHIP_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_SHIP_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        ship: action.payload.ship,
      };
    case NEW_SHIP_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_SHIP_RESET:
      return {
        ...state,
        success: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Update/Delete Ship Reducer
export const shipReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_SHIP_REQUEST:
    case UPDATE_SHIP_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_SHIP_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case UPDATE_SHIP_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_SHIP_FAIL:
    case UPDATE_SHIP_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_SHIP_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case UPDATE_SHIP_RESET:
      return {
        ...state,
        isUpdated: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Ship Details Reducer
export const shipDetailsReducer = (state = { ship: {} }, action) => {
  switch (action.type) {
    case SHIP_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case SHIP_DETAILS_SUCCESS:
      return {
        loading: false,
        ship: action.payload,
      };
    case SHIP_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

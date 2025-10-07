import {
  CLEAR_ERRORS,
  DELETE_NOTIFICATION_FAIL,
  DELETE_NOTIFICATION_REQUEST,
  DELETE_NOTIFICATION_RESET,
  DELETE_NOTIFICATION_SUCCESS,
  GET_NOTIFICATION_FAIL,
  GET_NOTIFICATION_REQUEST,
  GET_NOTIFICATION_SUCCESS,
  NEW_NOTIFICATION_FAIL,
  NEW_NOTIFICATION_REQUEST,
  NEW_NOTIFICATION_RESET,
  NEW_NOTIFICATION_SUCCESS,
  UPDATE_NOTIFICATION_FAIL,
  UPDATE_NOTIFICATION_REQUEST,
  UPDATE_NOTIFICATION_RESET,
  UPDATE_NOTIFICATION_SUCCESS,
} from "../constants/notificationContants";

export const newNotificationReducer = (
  state = { notification: {} },
  action
) => {
  switch (action.type) {
    case NEW_NOTIFICATION_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case NEW_NOTIFICATION_SUCCESS:
      return {
        loading: false,
        success: true,
        notification: action.payload,
      };

    case NEW_NOTIFICATION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case NEW_NOTIFICATION_RESET:
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
export const notificationReducer = (state = { notification: {} }, action) => {
  switch (action.type) {
    case GET_NOTIFICATION_REQUEST:
      return {
        loading: true,
        notification: {},
      };

    case GET_NOTIFICATION_SUCCESS:
      return {
        loading: false,
        notification: action.payload,
      };

    case GET_NOTIFICATION_FAIL:
      return {
        loading: false,
        error: action.payload,
        notification: {},
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

export const notificationUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_NOTIFICATION_REQUEST:
    case DELETE_NOTIFICATION_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case UPDATE_NOTIFICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };

    case DELETE_NOTIFICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };

    case UPDATE_NOTIFICATION_FAIL:
    case DELETE_NOTIFICATION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_NOTIFICATION_RESET:
      return {
        ...state,
        isUpdated: false,
      };

    case DELETE_NOTIFICATION_RESET:
      return {
        ...state,
        isDeleted: false,
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

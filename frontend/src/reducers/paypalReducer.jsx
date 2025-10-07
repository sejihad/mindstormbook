import {
  CLEAR_ERRORS,
  CREATE_PAYPAL_FAIL,
  CREATE_PAYPAL_REQUEST,
  CREATE_PAYPAL_SUCCESS,
} from "../constants/paymentContants";

export const newPaypalReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_PAYPAL_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CREATE_PAYPAL_SUCCESS:
      return {
        loading: false,
        success: true,
        url: action.payload.url,
      };
    case CREATE_PAYPAL_FAIL:
      return {
        ...state,
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

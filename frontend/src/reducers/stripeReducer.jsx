import {
  CLEAR_ERRORS,
  CREATE_STRIPE_FAIL,
  CREATE_STRIPE_REQUEST,
  CREATE_STRIPE_SUCCESS,
} from "../constants/paymentContants";

export const newStripeReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_STRIPE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CREATE_STRIPE_SUCCESS:
      return {
        loading: false,
        success: true,
        url: action.payload.url,
      };
    case CREATE_STRIPE_FAIL:
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

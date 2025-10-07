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
  DELETE_PACKAGE_RESET,
  DELETE_PACKAGE_SUCCESS,
  NEW_PACKAGE_FAIL,
  NEW_PACKAGE_REQUEST,
  NEW_PACKAGE_RESET,
  NEW_PACKAGE_SUCCESS,
  NEW_REVIEW_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_RESET,
  NEW_REVIEW_SUCCESS,
  PACKAGE_CART_FAIL,
  PACKAGE_CART_REQUEST,
  PACKAGE_CART_SUCCESS,
  PACKAGE_DETAILS_FAIL,
  PACKAGE_DETAILS_REQUEST,
  PACKAGE_DETAILS_SUCCESS,
  UPDATE_PACKAGE_FAIL,
  UPDATE_PACKAGE_REQUEST,
  UPDATE_PACKAGE_RESET,
  UPDATE_PACKAGE_SUCCESS,
} from "../constants/packageConstants";

// Packages List Reducer
export const packagesReducer = (state = { packages: [] }, action) => {
  switch (action.type) {
    case ALL_PACKAGE_REQUEST:
    case ADMIN_PACKAGE_REQUEST:
      return {
        loading: true,
        packages: [],
      };
    case ALL_PACKAGE_SUCCESS:
      return {
        loading: false,
        packages: action.payload.packages,
        packagesCount: action.payload.packagesCount,
        resPerPage: action.payload.resPerPage,
      };
    case ADMIN_PACKAGE_SUCCESS:
      return {
        loading: false,
        packages: action.payload,
      };
    case ALL_PACKAGE_FAIL:
    case ADMIN_PACKAGE_FAIL:
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

// Package Details Reducer
export const packageDetailsReducer = (state = { package: {} }, action) => {
  switch (action.type) {
    case PACKAGE_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case PACKAGE_DETAILS_SUCCESS:
      return {
        loading: false,
        package: action.payload,
      };
    case PACKAGE_DETAILS_FAIL:
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
export const packageAdminDetailsReducer = (state = { package: {} }, action) => {
  switch (action.type) {
    case PACKAGE_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case PACKAGE_DETAILS_SUCCESS:
      return {
        loading: false,
        package: action.payload,
      };
    case PACKAGE_DETAILS_FAIL:
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

// Package Cart Reducer (for quick cart views)
export const packageCartReducer = (state = { package: {} }, action) => {
  switch (action.type) {
    case PACKAGE_CART_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case PACKAGE_CART_SUCCESS:
      return {
        loading: false,
        package: action.payload,
      };
    case PACKAGE_CART_FAIL:
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

// New Package Reducer
export const newPackageReducer = (state = { package: {} }, action) => {
  switch (action.type) {
    case NEW_PACKAGE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_PACKAGE_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        package: action.payload.package,
      };
    case NEW_PACKAGE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_PACKAGE_RESET:
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

// Package CRUD Reducer (Update/Delete)
export const packageReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_PACKAGE_REQUEST:
    case UPDATE_PACKAGE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_PACKAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case UPDATE_PACKAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_PACKAGE_FAIL:
    case UPDATE_PACKAGE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_PACKAGE_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case UPDATE_PACKAGE_RESET:
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

// Review Reducer (can be shared between books and packages)
export const newPackageReviewReducer = (state = {}, action) => {
  switch (action.type) {
    case NEW_REVIEW_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_REVIEW_SUCCESS:
      return {
        loading: false,
        success: action.payload,
      };
    case NEW_REVIEW_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_REVIEW_RESET:
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

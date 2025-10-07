import { composeWithDevTools } from "@redux-devtools/extension";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // LocalStorage use korar jonno
import { thunk } from "redux-thunk"; // ✅ Named import
import {
  blogAdminDetailsReducer,
  blogDetailsReducer,
  blogReducer,
  blogsReducer,
  newBlogReducer,
} from "./reducers/blogReducer";
import {
  bookAdminDetailsReducer,
  bookDetailsReducer,
  bookReducer,
  BookReviewsReducer,
  booksReducer,
  newBookReducer,
  newReviewReducer,
  reviewReducer,
  reviewUpdateReducer,
} from "./reducers/bookReducer";
import { CartReducer } from "./reducers/cartReducer";
import {
  categoriesReducer,
  categoryDetailsReducer,
  categoryReducer,
  newCategoryReducer,
} from "./reducers/categoryReducer";
import {
  newNotificationReducer,
  notificationReducer,
  notificationUpdateReducer,
} from "./reducers/notificationReducer";
import {
  allOrdersReducer,
  myOrdersReducer,
  orderDetailsReducer,
  orderReducer,
} from "./reducers/orderReducer";
import {
  newPackageReducer,
  newPackageReviewReducer,
  packageAdminDetailsReducer,
  packageDetailsReducer,
  packageReducer,
  packagesReducer,
} from "./reducers/packageReducer";
import {
  newShipReducer,
  shipDetailsReducer,
  shipReducer,
  shipsReducer,
} from "./reducers/shipReducer";
import {
  allUsersReducer,
  forgotPasswordReducer,
  profileReducer,
  userDetailsReducer,
  userEmailRequestReducer,
  userReducer,
} from "./reducers/userReducer";

// Persist Config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
  userEmail: userEmailRequestReducer,
  forgotPassword: forgotPasswordReducer,
  userDetails: userDetailsReducer,
  allUsers: allUsersReducer,
  newBlog: newBlogReducer,
  blogs: blogsReducer,
  blog: blogReducer,
  blogDetails: blogDetailsReducer,
  blogAdminDetails: blogAdminDetailsReducer,
  newCategory: newCategoryReducer,
  categories: categoriesReducer,
  category: categoryReducer,
  categoryDetails: categoryDetailsReducer,
  newShip: newShipReducer,
  ships: shipsReducer,
  ship: shipReducer,
  shipDetails: shipDetailsReducer,
  books: booksReducer,
  newBook: newBookReducer,
  book: bookReducer,
  bookDetails: bookDetailsReducer,
  bookAdminDetails: bookAdminDetailsReducer,
  newReview: newReviewReducer,
  reviewUpdate: reviewUpdateReducer,
  packages: packagesReducer,
  newPackage: newPackageReducer,
  package: packageReducer,
  packageDetails: packageDetailsReducer,
  packageAdminDetails: packageAdminDetailsReducer,
  newPackageReview: newPackageReviewReducer,
  bookReview: reviewReducer,
  bookReviews: BookReviewsReducer,

  //order
  myOrders: myOrdersReducer,
  allOrders: allOrdersReducer,
  order: orderReducer,
  orderDetails: orderDetailsReducer,
  adminOrderDetails: orderDetailsReducer,

  //notification
  newNotification: newNotificationReducer,
  notification: notificationReducer,
  notificationUpdate: notificationUpdateReducer,
  notificationDelete: notificationUpdateReducer,
  // cart
  Cart: CartReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

let initialState = {
  Cart: {
    CartItems: localStorage.getItem("CartItems")
      ? JSON.parse(localStorage.getItem("CartItems"))
      : [],
  },
};

// Middleware setup
const middleware = [thunk];

// Create store with persisted reducer
const store = createStore(
  persistedReducer,
  initialState,
  // applyMiddleware(...middleware),
  composeWithDevTools(applyMiddleware(...middleware))
);

// Persistor
export const persistor = persistStore(store);

export default store;

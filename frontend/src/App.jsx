import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./component/layout/Footer";
import Header from "./component/layout/Header";
import ScrollToTop from "./component/layout/ScrollToTop";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import AboutUs from "./pages/About/AboutUs";
import AdminOrderDetails from "./pages/Admin/AdminOrderDetails";
import AllBlogs from "./pages/Admin/AllBlogs";
import AllBooks from "./pages/Admin/AllBooks";
import AllCategories from "./pages/Admin/AllCategories";
import AllOrders from "./pages/Admin/AllOrders";
import AllPackages from "./pages/Admin/AllPackages";
import AllReviews from "./pages/Admin/AllReviews";
import AllShips from "./pages/Admin/AllShips";
import AllUsers from "./pages/Admin/AllUsers";
import Dashboard from "./pages/Admin/Dashboard";
import NewBlog from "./pages/Admin/NewBlog";
import NewBook from "./pages/Admin/NewBook";
import NewPackage from "./pages/Admin/NewPackage";
import NotificationManager from "./pages/Admin/NotificationManager";
import Reviews from "./pages/Admin/Reviews";
import UpdateBlog from "./pages/Admin/UpdateBlog";
import UpdateBook from "./pages/Admin/UpdateBook";
import UpdatePackage from "./pages/Admin/UpdatePackage";
import UserDetails from "./pages/Admin/UserDetails";
import UserEmails from "./pages/Admin/UserEmails";
import AudioBookPage from "./pages/AudioBook/AudioBookPage";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import GoogleSuccess from "./pages/Auth/GoogleSuccess";
import Login from "./pages/Auth/Login";
import ResetPassword from "./pages/Auth/ResetPassword";
import AuthorPage from "./pages/Author/Author";
import BlogDetails from "./pages/Blogs/BlogDetails";
import Blogs from "./pages/Blogs/Blogs";
import BookPage from "./pages/Book/BookPage";
import CatBook from "./pages/Book/CatBook";
import AudiobookLibrary from "./pages/BookDetails/AudioBookLibrary";
import BookDetails from "./pages/BookDetails/BookDetails";
import EbookLibrary from "./pages/BookDetails/EbookLibrary";
import Cart from "./pages/Cart/Cart";
import Contact from "./pages/Contact/Contact";
import EBookPage from "./pages/Ebook/EBookPage";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import MyOrders from "./pages/Orders/MyOrders";
import OrderDetails from "./pages/Orders/OrderDetails";
import PackageSection from "./pages/Package/Package";
import PackageDetails from "./pages/Package/PackageDetails";
import Checkout from "./pages/Payment/Checkout";
import PaymentCancel from "./pages/Payment/PaymentCancel";
import PaymentSuccess from "./pages/Payment/PaymentSuccess";
import PrivacyPolicy from "./pages/Privacy/PrivacyPolicy";
import ShippingPolicy from "./pages/Privacy/ShippingPolicy";
import Shop from "./pages/Shop/Shop";
import TermsConditions from "./pages/Terms/TermsAndConditions";
import Delete from "./pages/User/Delete";
import Profile from "./pages/User/Profile";
import Setting from "./pages/User/Setting";
import UpdatePassword from "./pages/User/UpdatePassword";
import UpdateProfile from "./pages/User/UpdateProfile";

const App = () => {
  useEffect(() => {
    // enableContentProtection();
  }, []);
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:slug" element={<BlogDetails />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/shipping" element={<ShippingPolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/author" element={<AuthorPage />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/packages" element={<PackageSection />} />
        <Route path="/package/:slug" element={<PackageDetails />} />
        <Route path="/ebook" element={<EBookPage />} />
        <Route path="/audiobook" element={<AudioBookPage />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/books/:category" element={<BookPage />} />
        <Route path="/category/:category" element={<CatBook />} />
        <Route path="/:type/:category/:slug" element={<BookDetails />} />
        <Route path="/login" element={<Login />} />

        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/facebook-success" element={<GoogleSuccess />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        {/* notfound  */}
        <Route path="*" element={<NotFound />} />

        {/* protected routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/update"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/delete"
          element={
            <ProtectedRoute>
              <Delete />
            </ProtectedRoute>
          }
        />
        <Route
          path="/password/update"
          element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/setting"
          element={
            <ProtectedRoute>
              <Setting />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-cancel"
          element={
            <ProtectedRoute>
              <PaymentCancel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ebook-library"
          element={
            <ProtectedRoute>
              <EbookLibrary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/audiobook-library"
          element={
            <ProtectedRoute>
              <AudiobookLibrary />
            </ProtectedRoute>
          }
        />

        {/* admin route */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute isAdmin={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blog"
          element={
            <ProtectedRoute isAdmin={true}>
              <NewBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blogs"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllBlogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blog/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <UpdateBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <UserDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ships"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllShips />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/book/new"
          element={
            <ProtectedRoute isAdmin={true}>
              <NewBook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/book/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <UpdateBook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/package/new"
          element={
            <ProtectedRoute isAdmin={true}>
              <NewPackage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/package/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <UpdatePackage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/packages"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllPackages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/order/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <AdminOrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviews/:type/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <Reviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute isAdmin={true}>
              <AllReviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notification"
          element={
            <ProtectedRoute isAdmin={true}>
              <NotificationManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/emails"
          element={
            <ProtectedRoute isAdmin={true}>
              <UserEmails />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
      <Footer />
    </BrowserRouter>
  );
};

export default App;

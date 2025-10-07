import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleIcon from "@mui/icons-material/People";
import PostAddIcon from "@mui/icons-material/PostAdd";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { BellIcon, Mail } from "lucide-react";
import { FaBook, FaBoxOpen, FaShippingFast } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  // Active link checking function
  const isActive = (path) => {
    if (path === "/admin/dashboard") {
      return location.pathname === "/admin/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  // Active and inactive classes
  const activeClasses =
    "text-red-600 bg-red-50 border-r-2 border-red-500 font-semibold";
  const inactiveClasses =
    "text-gray-600 hover:text-red-500 hover:bg-red-50 font-normal";

  // Active icon color
  const getIconColor = (path) => {
    return isActive(path) ? "text-red-600" : "text-gray-500";
  };

  return (
    <div className="bg-white flex flex-col p-6 h-auto md:h-screen sticky md:top-0 shadow-md overflow-y-auto w-full md:w-[260px]">
      {/* Dashboard */}
      <Link
        to="/admin/dashboard"
        className={`flex items-center text-base py-3 px-6 transition-all duration-300 ${
          isActive("/admin/dashboard") ? activeClasses : inactiveClasses
        }`}
      >
        <DashboardIcon
          className={`mr-4 text-[1.2rem] ${getIconColor("/admin/dashboard")}`}
        />
        <span>Dashboard</span>
      </Link>

      {/* Blogs */}
      <Link
        to="/admin/blogs"
        className={`flex items-center text-base py-3 px-6 transition-all duration-300 ${
          isActive("/admin/blogs") ? activeClasses : inactiveClasses
        }`}
      >
        <LibraryBooksIcon
          className={`mr-4 text-[1.2rem] ${getIconColor("/admin/blogs")}`}
        />
        <span>Blogs</span>
      </Link>

      {/* Add Blog */}
      <Link
        to="/admin/blog"
        className={`flex items-center text-base py-3 px-6 transition-all duration-300 ${
          isActive("/admin/blog") ? activeClasses : inactiveClasses
        }`}
      >
        <PostAddIcon
          className={`mr-4 text-[1.2rem] ${getIconColor("/admin/blog")}`}
        />
        <span>Add Blog</span>
      </Link>

      {/* Categories */}
      <Link
        to="/admin/categories"
        className={`flex items-center text-base py-3 px-6 transition-all duration-300 ${
          isActive("/admin/categories") ? activeClasses : inactiveClasses
        }`}
      >
        <CategoryIcon
          className={`mr-4 text-[1.2rem] ${getIconColor("/admin/categories")}`}
        />
        <span>Categories</span>
      </Link>

      {/* Shipping */}
      <Link
        to="/admin/ships"
        className={`flex items-center text-base py-3 px-6 transition-all duration-300 ${
          isActive("/admin/ships") ? activeClasses : inactiveClasses
        }`}
      >
        <FaShippingFast
          className={`mr-4 text-[1.2rem] ${getIconColor("/admin/ships")}`}
        />
        <span>Shipping</span>
      </Link>

      {/* Add Book */}
      <Link
        to="/admin/book/new"
        className={`flex items-center text-base py-3 px-6 transition-all duration-300 ${
          isActive("/admin/book/new") ? activeClasses : inactiveClasses
        }`}
      >
        <PostAddIcon
          className={`mr-4 text-[1.2rem] ${getIconColor("/admin/book/new")}`}
        />
        <span>Add Book</span>
      </Link>

      {/* Books */}
      <Link
        to="/admin/books"
        className={`flex items-center text-base py-3 px-6 transition-all duration-300 ${
          isActive("/admin/books") ? activeClasses : inactiveClasses
        }`}
      >
        <FaBook
          className={`mr-4 text-[1.2rem] ${getIconColor("/admin/books")}`}
        />
        <span>Books</span>
      </Link>

      {/* Add Package */}
      <Link
        to="/admin/package/new"
        className={`flex items-center text-base py-3 px-6 transition-all duration-300 ${
          isActive("/admin/package/new") ? activeClasses : inactiveClasses
        }`}
      >
        <PostAddIcon
          className={`mr-4 text-[1.2rem] ${getIconColor("/admin/package/new")}`}
        />
        <span>Add Package</span>
      </Link>

      {/* Packages */}
      <Link
        to="/admin/packages"
        className={`flex items-center text-base py-3 px-6 transition-all duration-300 ${
          isActive("/admin/packages") ? activeClasses : inactiveClasses
        }`}
      >
        <FaBoxOpen
          className={`mr-4 text-[1.2rem] ${getIconColor("/admin/packages")}`}
        />
        <span>Packages</span>
      </Link>

      {/* Orders */}
      <Link
        to="/admin/orders"
        className={`flex items-center text-base py-3 px-6 transition-all duration-300 ${
          isActive("/admin/orders") ? activeClasses : inactiveClasses
        }`}
      >
        <ListAltIcon
          className={`mr-4 text-[1.2rem] ${getIconColor("/admin/orders")}`}
        />
        <span>Orders</span>
      </Link>

      {/* Users */}
      <Link
        to="/admin/users"
        className={`flex items-center text-base py-3 px-6 transition-all duration-300 ${
          isActive("/admin/users") ? activeClasses : inactiveClasses
        }`}
      >
        <PeopleIcon
          className={`mr-4 text-[1.2rem] ${getIconColor("/admin/users")}`}
        />
        <span>Users</span>
      </Link>

      {/* Reviews */}
      <Link
        to="/admin/reviews"
        className={`flex items-center text-base py-3 px-6 transition-all duration-300 ${
          isActive("/admin/reviews") ? activeClasses : inactiveClasses
        }`}
      >
        <RateReviewIcon
          className={`mr-4 text-[1.2rem] ${getIconColor("/admin/reviews")}`}
        />
        <span>Reviews</span>
      </Link>

      {/* Notification */}
      <Link
        to="/admin/notification"
        className={`flex items-center text-base py-3 px-6 transition-all duration-300 ${
          isActive("/admin/notification") ? activeClasses : inactiveClasses
        }`}
      >
        <BellIcon
          className={`mr-4 text-[1.2rem] ${getIconColor(
            "/admin/notification"
          )}`}
        />
        <span>Notification</span>
      </Link>

      {/* Emails */}
      <Link
        to="/admin/emails"
        className={`flex items-center text-base py-3 px-6 transition-all duration-300 ${
          isActive("/admin/emails") ? activeClasses : inactiveClasses
        }`}
      >
        <Mail
          className={`mr-4 text-[1.2rem] ${getIconColor("/admin/emails")}`}
        />
        <span>Emails</span>
      </Link>
    </div>
  );
};

export default Sidebar;

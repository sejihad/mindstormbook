import { Book, Home, Package, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  FaAngleDown,
  FaCloudDownloadAlt,
  FaCog,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaTachometerAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { FiMenu, FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCategory } from "../../actions/categoryAction";
import { logout } from "../../actions/userAction";
import logo from "../../assets/logo.svg";

const Header = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // const [cartItemCount, setCartItemCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [showCategories, setShowCategories] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const userMenuRef = useRef();
  const searchModalRef = useRef();
  const searchInputRef = useRef();
  const dropdownTimeoutRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { categories } = useSelector((state) => state.categories);
  const { cartCount } = useSelector((state) => state.Cart);
  // useEffect(() => {
  //   const Cart = JSON.parse(localStorage.getItem("CartItems")) || [];

  //   const cartCount = Cart.reduce(
  //     (total, item) => total + (item.quantity || 1),
  //     0
  //   );

  //   setCartItemCount(cartCount);
  // }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (
        searchModalRef.current &&
        !searchModalRef.current.contains(event.target)
      ) {
        setSearchModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    dispatch(getCategory());
    if (searchModalOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchModalOpen, dispatch]);

  const handleCategoryEnter = () => {
    clearTimeout(dropdownTimeoutRef.current);
    setShowCategories(true);
  };

  const handleCategoryLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowCategories(false);
    }, 200);
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchModalOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav className="w-full shadow-md bg-white sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-2 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap"
          >
            {/* Logo */}
            <img
              src={logo}
              alt="MindStorm Book Shop Logo"
              className="h-6 sm:h-8 md:h-10 w-auto object-contain"
            />

            {/* Brand Name */}
            <div className="flex flex-col sm:flex-row sm:items-center leading-tight">
              <p className="font-bold text-sm sm:text-lg md:text-xl text-indigo-600">
                MindStorm Books
              </p>
              <span className="font-bold text-sm sm:text-lg md:text-xl text-gray-700 sm:ml-1">
                Shop
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700">
            <Link
              to="/"
              className={`hover:text-indigo-600 transition ${
                isActive("/") ? "text-indigo-600" : ""
              }`}
            >
              HOME
            </Link>

            <div
              className="relative"
              onMouseEnter={handleCategoryEnter}
              onMouseLeave={handleCategoryLeave}
            >
              <button
                className={`flex items-center gap-1 hover:text-indigo-600 transition cursor-pointer ${
                  location.pathname.startsWith("/books/")
                    ? "text-indigo-600"
                    : ""
                }`}
              >
                BOOKS <FaAngleDown className="mt-[1px]" />
              </button>
              {showCategories && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border shadow-md rounded-md z-50">
                  <Link
                    to={`/shop`}
                    className={`block px-4 py-2 hover:bg-gray-100 text-sm ${
                      isActive(`/shop`)
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700"
                    }`}
                    onClick={() => setShowCategories(false)}
                  >
                    {"BOOKS"}
                  </Link>
                  <Link
                    to={`/ebook`}
                    className={`block px-4 py-2 hover:bg-gray-100 text-sm ${
                      isActive(`/ebook`)
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700"
                    }`}
                    onClick={() => setShowCategories(false)}
                  >
                    {"EBOOKS"}
                  </Link>
                  <Link
                    to={`/audiobook`}
                    className={`block px-4 py-2 hover:bg-gray-100 text-sm ${
                      isActive(`/audiobook`)
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700"
                    }`}
                    onClick={() => setShowCategories(false)}
                  >
                    {"AUDIO BOOKS"}
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/packages"
              className={`hover:text-indigo-600 transition ${
                isActive("/packages") ? "text-indigo-600" : ""
              }`}
            >
              PACKAGES
            </Link>
            <Link
              to="/author"
              className={`hover:text-indigo-600 transition ${
                isActive("/author") ? "text-indigo-600" : ""
              }`}
            >
              AUTHOR
            </Link>
            <Link
              to="/shop"
              className={`hover:text-indigo-600 transition ${
                isActive("/shop") ? "text-indigo-600" : ""
              }`}
            >
              SHOP
            </Link>
            <Link
              to="/blogs"
              className={`hover:text-indigo-600 transition ${
                isActive("/blogs") ? "text-indigo-600" : ""
              }`}
            >
              BLOGS
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 text-gray-700 text-xl relative">
            <div className="relative">
              <Link to="/cart">
                <FiShoppingCart
                  className={`hover:text-indigo-600 transition cursor-pointer text-2xl ${
                    isActive("/cart") ? "text-indigo-600" : ""
                  }`}
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Search Icon */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="hidden md:inline cursor-pointer hover:text-indigo-600 transition"
            >
              <FiSearch />
            </button>

            {/* User Menu */}
            <div ref={userMenuRef} className="relative">
              {isAuthenticated ? (
                <img
                  src={user?.avatar?.url}
                  alt="User Avatar"
                  className={`w-8 h-8 rounded-full cursor-pointer border hover:border-indigo-600 transition ${
                    isActive("/profile") ||
                    isActive("/orders") ||
                    isActive("/ebook-library") ||
                    isActive("/audiobook-library") ||
                    isActive("/profile/setting")
                      ? "border-indigo-600"
                      : ""
                  }`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                />
              ) : (
                <FiUser
                  className={`cursor-pointer hover:text-indigo-600 transition ${
                    isActive("/login") ? "text-indigo-600" : ""
                  }`}
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate("/login");
                    } else {
                      setShowUserMenu(!showUserMenu);
                    }
                  }}
                />
              )}

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white border shadow-xl rounded-lg z-50">
                  {isAuthenticated ? (
                    <div className="flex flex-col">
                      {user?.role === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-indigo-700 transition-colors duration-200 rounded-md ${
                            isActive("/admin/dashboard")
                              ? "bg-indigo-50 text-indigo-600"
                              : "text-gray-700"
                          }`}
                        >
                          <FaTachometerAlt /> Dashboard
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-indigo-700 transition-colors duration-200 rounded-md ${
                          isActive("/profile")
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-gray-700"
                        }`}
                      >
                        <FaUser /> Profile
                      </Link>
                      {user?.provider === "local" && (
                        <Link
                          to="/profile/setting"
                          onClick={() => setShowUserMenu(false)}
                          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-indigo-700 transition-colors duration-200 rounded-md ${
                            isActive("/profile/setting")
                              ? "bg-indigo-50 text-indigo-600"
                              : "text-gray-700"
                          }`}
                        >
                          <FaCog /> Security
                        </Link>
                      )}
                      <Link
                        to="/ebook-library"
                        onClick={() => setShowUserMenu(false)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-indigo-700 transition-colors duration-200 rounded-md ${
                          isActive("/ebook-library")
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-gray-700"
                        }`}
                      >
                        <FaCloudDownloadAlt /> E-Book Library
                      </Link>
                      <Link
                        to="/audiobook-library"
                        onClick={() => setShowUserMenu(false)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-indigo-700 transition-colors duration-200 rounded-md ${
                          isActive("/audiobook-library")
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-gray-700"
                        }`}
                      >
                        <FaCloudDownloadAlt /> Audio-Book Library
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setShowUserMenu(false)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-indigo-700 transition-colors duration-200 rounded-md ${
                          isActive("/orders")
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-gray-700"
                        }`}
                      >
                        <FaShoppingBag /> Orders
                      </Link>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-100 hover:text-red-700 transition-colors duration-200 rounded-md"
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate("/login");
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-200 rounded-md"
                    >
                      <FaSignInAlt /> Login
                    </button>
                  )}
                </div>
              )}
            </div>
            <FiMenu
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden cursor-pointer hover:text-indigo-600 transition"
            />
          </div>
        </div>

        {/* Search Modal */}
        {searchModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div
              ref={searchModalRef}
              className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Search Books</h3>
                <button
                  onClick={() => setSearchModalOpen(false)}
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-indigo-600"
                  >
                    <FiSearch />
                  </button>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Press Enter to search</p>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white px-4 pb-4 pt-2 text-gray-700 text-sm font-semibold shadow-inner space-y-2">
            <Link
              to="/"
              className={`block hover:text-indigo-600 ${
                isActive("/") ? "text-indigo-600" : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              HOME
            </Link>

            <div>
              <button
                className={`flex justify-between w-full hover:text-indigo-600 ${
                  location.pathname.startsWith("/books/")
                    ? "text-indigo-600"
                    : ""
                }`}
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
              >
                BOOKS{" "}
                <FaAngleDown
                  className={`transition-transform duration-200 ${
                    mobileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileDropdownOpen && (
                <div className="pl-4 mt-2 space-y-1 text-gray-600">
                  {categories?.map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/books/${cat.slug}`}
                      className={`block hover:text-indigo-600 ${
                        isActive(`/books/${cat.slug}`) ? "text-indigo-600" : ""
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <Link
                    to={`/ebook`}
                    className={`block hover:text-indigo-600 ${
                      isActive(`/ebook`) ? "text-indigo-600" : ""
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {"EBOOKS"}
                  </Link>
                  <Link
                    to={`/audiobook`}
                    className={`block hover:text-indigo-600 ${
                      isActive(`/audiobook`) ? "text-indigo-600" : ""
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {"AUDIO BOOKS"}
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/packages"
              className={`block hover:text-indigo-600 ${
                isActive("/packages") ? "text-indigo-600" : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              PACKAGES
            </Link>
            <Link
              to="/author"
              className={`block hover:text-indigo-600 ${
                isActive("/author") ? "text-indigo-600" : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              AUTHOR
            </Link>
            <Link
              to="/shop"
              className={`block hover:text-indigo-600 ${
                isActive("/shop") ? "text-indigo-600" : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              SHOP
            </Link>
            <Link
              to="/blogs"
              className={`block hover:text-indigo-600 ${
                isActive("/blogs") ? "text-indigo-600" : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              BLOGS
            </Link>

            {/* Mobile Search */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setSearchModalOpen(true);
                }}
                className="flex items-center gap-2 w-full text-left py-2 hover:text-indigo-600"
              >
                <FiSearch /> Search
              </button>
            </div>

            {/* Mobile User */}
            <div className="pt-2 border-t border-gray-200">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left py-2 hover:text-red-600"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/login");
                  }}
                  className={`block w-full text-left py-2 hover:text-indigo-600 ${
                    isActive("/login") ? "text-indigo-600" : ""
                  }`}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* mobile icons */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#222222] flex justify-around items-center py-2 lg:hidden shadow-md">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center ${
            isActive("/") ? "text-indigo-500" : "text-white"
          }`}
        >
          <Home size={20} />
          <span className="text-xs">HOME</span>
        </Link>

        {/* Shop */}
        <Link
          to="/shop"
          className={`flex flex-col items-center ${
            isActive("/shop") ? "text-indigo-500" : "text-white"
          }`}
        >
          <ShoppingBag size={20} /> {/* shop icon */}
          <span className="text-xs">SHOP</span>
        </Link>

        {/* Ebooks */}
        <Link
          to="/ebook"
          className={`flex flex-col items-center ${
            isActive("/ebook") ? "text-indigo-500" : "text-white"
          }`}
        >
          <Book size={20} /> {/* ebook icon */}
          <span className="text-xs">EBOOKS</span>
        </Link>

        {/* Packages */}
        <Link
          to="/packages"
          className={`flex flex-col items-center ${
            isActive("/packages") ? "text-indigo-500" : "text-white"
          }`}
        >
          <Package size={20} /> {/* package icon */}
          <span className="text-xs">PACKAGES</span>
        </Link>
      </div>
    </>
  );
};

export default Header;

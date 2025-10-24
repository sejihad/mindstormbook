import { useEffect, useState } from "react";
import {
  FiEdit2,
  FiFilter,
  FiPlus,
  FiSearch,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getAdminBook } from "../../actions/bookAction";
import {
  clearErrors,
  getAdminPackageDetails,
  updatePackage,
} from "../../actions/packageAction";
import MetaData from "../../component/layout/MetaData";
import { UPDATE_PACKAGE_RESET } from "../../constants/packageConstants";
import Sidebar from "./Sidebar";

const UpdatePackage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { package: pkg } = useSelector((state) => state.packageAdminDetails);
  const { loading, error, isUpdated } = useSelector((state) => state.package);
  const { books } = useSelector((state) => state.books);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    oldPrice: "",
    discountPrice: "",
    deliveryTime: "7–10 days",
    deliverToCountries:
      "United States, Canada, Mexico, Spain, Central & South America",
    videoLink: "",
    books: [], // Array of selected book IDs only
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  // Book selection states
  const [searchTerm, setSearchTerm] = useState("");
  const [bookTypeFilter, setBookTypeFilter] = useState("all");
  const [selectedBooks, setSelectedBooks] = useState([]); // Array of full book objects for display
  const [showBookSelector, setShowBookSelector] = useState(false);

  useEffect(() => {
    dispatch(getAdminBook());
    dispatch(getAdminPackageDetails(id));

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Package updated successfully");
      dispatch({ type: UPDATE_PACKAGE_RESET });
      navigate("/admin/packages");
    }
  }, [dispatch, error, isUpdated, id, navigate]);

  // Initialize form with package data when pkg is available
  useEffect(() => {
    if (pkg && pkg._id === id) {
      setFormData({
        name: pkg.name || "",
        title: pkg.title || "",
        description: pkg.description || "",
        oldPrice: pkg.oldPrice || "",
        discountPrice: pkg.discountPrice || "",
        deliveryTime: pkg.deliveryTime || "7–10 days",
        deliverToCountries:
          pkg.deliverToCountries ||
          "United States, Canada, Mexico, Spain, Central & South America",
        videoLink: pkg.videoLink || "",
        books: pkg.books?.map((book) => book._id) || [],
      });

      // Set selected books with full book objects
      setSelectedBooks(pkg.books || []);

      // Set image previews
      if (pkg.image) setImagePreview(pkg.image.url);
      if (pkg.images) setImagesPreview(pkg.images.map((img) => img.url));
    }
  }, [pkg, id]);

  // Filter books based on search and type
  const filteredBooks = books?.filter((book) => {
    const matchesSearch =
      book.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.writer?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      bookTypeFilter === "all" || book.type === bookTypeFilter;

    return matchesSearch && matchesType;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add book to selection
  const addBookToSelection = (book) => {
    // Check if already selected
    if (selectedBooks.find((b) => b._id === book._id)) {
      toast.warning("Book already added to package");
      return;
    }

    const newSelectedBooks = [...selectedBooks, book];
    setSelectedBooks(newSelectedBooks);

    // Update formData with only book IDs
    setFormData({
      ...formData,
      books: newSelectedBooks.map((book) => book._id),
    });

    toast.success("Book added to package");
  };

  // Remove book from selection
  const removeBookFromSelection = (bookId) => {
    const newSelectedBooks = selectedBooks.filter(
      (book) => book._id !== bookId
    );
    setSelectedBooks(newSelectedBooks);

    // Update formData with only book IDs
    setFormData({
      ...formData,
      books: newSelectedBooks.map((book) => book._id),
    });

    toast.info("Book removed from package");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (selectedBooks.length === 0) {
      toast.error("Please select at least one book");
      return;
    }

    const data = new FormData();

    // Package data
    data.set("name", formData.name);
    data.set("title", formData.title);
    data.set("description", formData.description);
    data.set("oldPrice", formData.oldPrice);
    data.set("discountPrice", formData.discountPrice);
    data.set("deliveryTime", formData.deliveryTime);
    data.set("deliverToCountries", formData.deliverToCountries);
    if (formData.videoLink) data.set("videoLink", formData.videoLink);

    // Books data - only IDs
    formData.books.forEach((bookId) => {
      data.append("books", bookId);
    });

    // Images
    if (image) data.append("image", image);
    images.forEach((img) => {
      data.append("images", img);
    });

    dispatch(updatePackage(id, data));
  };

  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPreview(reader.result);
        setFile(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);

    if (imagesPreview.length + files.length > 4) {
      toast.warning("Maximum 4 additional images allowed");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, file]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (setFile, setPreview) => {
    setFile(null);
    setPreview(null);
  };

  const removeImage = (index) => {
    const newImagesPreview = [...imagesPreview];
    newImagesPreview.splice(index, 1);
    setImagesPreview(newImagesPreview);

    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Book type badge styling
  const getBookTypeBadge = (type) => {
    const styles = {
      book: "bg-blue-100 text-blue-800 border-blue-200",
      ebook: "bg-purple-100 text-purple-800 border-purple-200",
      audiobook: "bg-orange-100 text-orange-800 border-orange-200",
    };

    const labels = {
      book: "Physical",
      ebook: "E-Book",
      audiobook: "Audio",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${
          styles[type] || "bg-gray-100 text-gray-800"
        }`}
      >
        {labels[type] || type}
      </span>
    );
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Update Package" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Update Package</h1>
            <p className="text-gray-600 mt-1">
              Update package details and book selection
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Package Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter package name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter package title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="oldPrice"
                    placeholder="Enter original price"
                    required
                    value={formData.oldPrice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="discountPrice"
                    placeholder="Enter discount price"
                    required
                    value={formData.discountPrice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Time
                  </label>
                  <input
                    type="text"
                    name="deliveryTime"
                    placeholder="e.g. 3-5 days"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deliver To Countries
                  </label>
                  <input
                    type="text"
                    name="deliverToCountries"
                    placeholder="Country Name.."
                    value={formData.deliverToCountries}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video Link (Optional)
                  </label>
                  <input
                    type="text"
                    name="videoLink"
                    placeholder="Enter YouTube video link"
                    value={formData.videoLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Enter package description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                ></textarea>
              </div>

              {/* Book Selection Section */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Selected Books
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedBooks.length} book
                      {selectedBooks.length !== 1 ? "s" : ""} selected
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowBookSelector(!showBookSelector)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <FiPlus size={16} />
                    {showBookSelector ? "Hide Book List" : "Manage Books"}
                  </button>
                </div>

                {/* Selected Books Preview */}
                {selectedBooks.length > 0 && (
                  <div className="mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedBooks.map((book) => (
                        <div
                          key={book._id}
                          className="flex items-center gap-3 bg-white p-3 rounded-lg border"
                        >
                          <img
                            src={book.image?.url || "/default-book.png"}
                            alt={book.name}
                            className="w-12 h-12 rounded object-cover border"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {book.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              by {book.writer}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {getBookTypeBadge(book.type)}
                              <span className="text-xs font-medium text-green-600">
                                ${book.discountPrice || book.price}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeBookFromSelection(book._id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove book"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Book Selector Modal */}
                {showBookSelector && (
                  <div className="border rounded-lg bg-white p-4 max-h-96 overflow-y-auto">
                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                      <div className="flex-1 relative">
                        <FiSearch
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type="text"
                          placeholder="Search books by name or writer..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <select
                        value={bookTypeFilter}
                        onChange={(e) => setBookTypeFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="all">All Types</option>
                        <option value="book">Physical Books</option>
                        <option value="ebook">E-Books</option>
                        <option value="audiobook">Audio Books</option>
                      </select>
                    </div>

                    {/* Books List */}
                    <div className="space-y-2">
                      {filteredBooks?.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FiFilter
                            size={32}
                            className="mx-auto mb-2 opacity-50"
                          />
                          <p>No books found matching your criteria</p>
                        </div>
                      ) : (
                        filteredBooks?.map((book) => (
                          <div
                            key={book._id}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedBooks.find((b) => b._id === book._id)
                                ? "bg-indigo-50 border-indigo-200"
                                : "bg-white border-gray-200 hover:bg-gray-50"
                            }`}
                            onClick={() => addBookToSelection(book)}
                          >
                            <img
                              src={book.image?.url || "/default-book.png"}
                              alt={book.name}
                              className="w-10 h-10 rounded object-cover border"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {book.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                by {book.writer}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getBookTypeBadge(book.type)}
                              <span className="text-xs font-medium text-green-600">
                                ${book.discountPrice || book.price}
                              </span>
                              {selectedBooks.find((b) => b._id === book._id) ? (
                                <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Image Upload Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Image
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                      <FiUpload className="text-gray-400 mb-2" size={24} />
                      <span className="text-sm text-gray-500 text-center">
                        {imagePreview ? "Change Image" : "Upload Package Image"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange(e, setImage, setImagePreview)
                        }
                        className="hidden"
                      />
                    </label>
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-24 h-24 rounded-lg border object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(setImage, setImagePreview)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Images (Max 4)
                  </label>
                  <div className="space-y-3">
                    <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                      <FiUpload className="text-gray-400 mb-2" size={24} />
                      <span className="text-sm text-gray-500 text-center">
                        {imagesPreview.length
                          ? "Add More Images"
                          : "Upload Additional Images"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImagesChange}
                        className="hidden"
                        disabled={imagesPreview.length >= 4}
                      />
                    </label>
                    {imagesPreview.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {imagesPreview.map((img, index) => (
                          <div key={index} className="relative">
                            <img
                              src={img}
                              alt={`Preview ${index}`}
                              className="w-16 h-16 rounded-lg border object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <FiX size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || selectedBooks.length === 0}
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold flex items-center justify-center gap-2 ${
                  loading || selectedBooks.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                }`}
              >
                {loading ? (
                  "Updating Package..."
                ) : (
                  <>
                    <FiEdit2 size={18} />
                    Update Package ({selectedBooks.length}{" "}
                    {selectedBooks.length === 1 ? "book" : "books"})
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePackage;

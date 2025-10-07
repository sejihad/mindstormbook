import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiUpload, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCategory } from "../../actions/categoryAction";
import { clearErrors, createPackage } from "../../actions/packageAction";
import MetaData from "../../component/layout/MetaData";
import { NEW_PACKAGE_RESET } from "../../constants/packageConstants";
import Sidebar from "./Sidebar";

const NewPackage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.newPackage);
  const { categories } = useSelector((state) => state.categories);

  const initialBookData = {
    name: "",
    writer: "",
    language: "",
    publisher: "",
    publishDate: "",

    isbn13: "",
    category: "",
    demoPdfFile: null,
    demoPdfPreview: null,
  };

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    oldPrice: "",
    discountPrice: "",
    deliveryTime: "",
    deliverToCountries: "",
    videoLink: "",
    books: [JSON.parse(JSON.stringify(initialBookData))],
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [activeBookTab, setActiveBookTab] = useState(0);

  useEffect(() => {
    dispatch(getCategory());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Package created successfully");
      dispatch({ type: NEW_PACKAGE_RESET });
      navigate("/admin/packages");
    }
  }, [dispatch, error, success, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBookInputChange = (e, bookIndex) => {
    const { name, value } = e.target;
    const updatedBooks = [...formData.books];
    updatedBooks[bookIndex] = {
      ...updatedBooks[bookIndex],
      [name]: value,
    };
    setFormData({
      ...formData,
      books: updatedBooks,
    });
  };

  const addNewBook = () => {
    if (formData.books.length >= 20) {
      toast.warning("Maximum 20 books allowed per package");
      return;
    }
    setFormData({
      ...formData,
      books: [...formData.books, JSON.parse(JSON.stringify(initialBookData))],
    });
    setActiveBookTab(formData.books.length);
  };

  const removeBook = (index) => {
    if (formData.books.length <= 1) {
      toast.warning("At least one book is required");
      return;
    }

    // Clean up the preview URL if it exists
    if (formData.books[index].demoPdfPreview) {
      URL.revokeObjectURL(formData.books[index].demoPdfPreview);
    }

    const updatedBooks = formData.books.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      books: updatedBooks,
    });

    if (activeBookTab >= updatedBooks.length) {
      setActiveBookTab(updatedBooks.length - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.books.length < 1) {
      toast.error("Please add at least one book");
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

    // Books data
    formData.books.forEach((book, index) => {
      data.set(`books[${index}][name]`, book.name);
      data.set(`books[${index}][writer]`, book.writer);
      data.set(`books[${index}][language]`, book.language);
      data.set(`books[${index}][publisher]`, book.publisher || "");
      data.set(`books[${index}][publishDate]`, book.publishDate || "");

      data.set(`books[${index}][isbn13]`, book.isbn13 || "");
      data.set(`books[${index}][category]`, book.category);

      if (book.demoPdfFile) {
        data.append(`books[${index}][demoPdf]`, book.demoPdfFile);
      }
    });

    // Images
    if (image) data.append("image", image);
    images.forEach((img) => {
      data.append("images", img);
    });

    dispatch(createPackage(data));
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

  const handleBookFileChange = (e, bookIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedBooks = [...formData.books];

    // Clean up previous preview URL if exists
    if (updatedBooks[bookIndex].demoPdfPreview) {
      URL.revokeObjectURL(updatedBooks[bookIndex].demoPdfPreview);
    }

    updatedBooks[bookIndex] = {
      ...updatedBooks[bookIndex],
      demoPdfFile: file,
      demoPdfPreview: URL.createObjectURL(file),
    };

    setFormData({
      ...formData,
      books: updatedBooks,
    });
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

  const removeBookFile = (bookIndex) => {
    const updatedBooks = [...formData.books];

    if (updatedBooks[bookIndex].demoPdfPreview) {
      URL.revokeObjectURL(updatedBooks[bookIndex].demoPdfPreview);
    }

    updatedBooks[bookIndex] = {
      ...updatedBooks[bookIndex],
      demoPdfFile: null,
      demoPdfPreview: null,
    };

    setFormData({
      ...formData,
      books: updatedBooks,
    });
  };

  const removeImage = (index) => {
    const newImagesPreview = [...imagesPreview];
    newImagesPreview.splice(index, 1);
    setImagesPreview(newImagesPreview);

    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  useEffect(() => {
    return () => {
      // Clean up all object URLs when component unmounts
      formData.books.forEach((book) => {
        if (book.demoPdfPreview) {
          URL.revokeObjectURL(book.demoPdfPreview);
        }
      });
    };
  }, [formData.books]);

  const renderBookTab = (bookIndex) => {
    const book = formData.books[bookIndex];

    return (
      <div className="bg-gray-50 p-4 rounded-lg relative">
        {formData.books.length > 1 && (
          <button
            type="button"
            onClick={() => removeBook(bookIndex)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            title="Remove this book"
          >
            <FiTrash2 size={18} />
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter book name"
              required
              value={book.name}
              onChange={(e) => handleBookInputChange(e, bookIndex)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Writer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="writer"
              placeholder="Enter writer name"
              required
              value={book.writer}
              onChange={(e) => handleBookInputChange(e, bookIndex)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              required
              value={book.category}
              onChange={(e) => handleBookInputChange(e, bookIndex)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="language"
              placeholder="Enter language"
              required
              value={book.language}
              onChange={(e) => handleBookInputChange(e, bookIndex)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publisher
            </label>
            <input
              type="text"
              name="publisher"
              placeholder="Enter publisher name"
              value={book.publisher}
              onChange={(e) => handleBookInputChange(e, bookIndex)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publish Date
            </label>
            <input
              type="date"
              name="publishDate"
              value={book.publishDate}
              onChange={(e) => handleBookInputChange(e, bookIndex)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN-13
            </label>
            <input
              type="text"
              name="isbn13"
              placeholder="Enter ISBN-13"
              value={book.isbn13}
              onChange={(e) => handleBookInputChange(e, bookIndex)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Demo PDF
          </label>
          <div className="flex items-center gap-4">
            <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
              <FiUpload className="text-gray-400 mb-2" size={24} />
              <span className="text-sm text-gray-500 text-center">
                {book.demoPdfPreview ? "Change PDF" : "Upload Demo PDF"}
              </span>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleBookFileChange(e, bookIndex)}
                className="hidden"
              />
            </label>
            {book.demoPdfPreview && (
              <div className="relative">
                <div className="w-24 h-24 bg-gray-100 rounded-lg border flex items-center justify-center">
                  <span className="text-xs text-gray-500">PDF Preview</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeBookFile(bookIndex)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FiX size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Create New Package" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Create New Package
            </h1>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    Package Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter package title"
                    required
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

                <div>
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

              {/* Book tabs */}
              <div>
                <div className="flex justify-between items-center border-b border-gray-200 mb-4">
                  <nav className="-mb-px flex space-x-8">
                    {formData.books.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveBookTab(index);
                        }}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                          activeBookTab === index
                            ? "border-indigo-500 text-indigo-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Book {index + 1}
                      </button>
                    ))}
                  </nav>
                  <button
                    type="button"
                    onClick={addNewBook}
                    disabled={formData.books.length >= 20}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    <FiPlus size={16} /> Add Book
                  </button>
                </div>
                {formData.books.length > 0 && renderBookTab(activeBookTab)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Image <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                      <FiUpload className="text-gray-400 mb-2" size={24} />
                      <span className="text-sm text-gray-500 text-center">
                        {imagePreview ? "Change Image" : "Upload Image"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange(e, setImage, setImagePreview)
                        }
                        className="hidden"
                        required={!imagePreview}
                      />
                    </label>
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-24 h-24 rounded-lg border"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Images (Max 4)
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                      <FiUpload className="text-gray-400 mb-2" size={24} />
                      <span className="text-sm text-gray-500 text-center">
                        {imagesPreview.length ? "Add More" : "Upload Images"}
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
                    <div className="flex flex-wrap gap-2">
                      {imagesPreview.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={img}
                            alt={`Preview ${index}`}
                            className="w-16 h-16 rounded-lg border"
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
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 cursor-pointer rounded-lg text-white font-semibold flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <FiPlus size={18} /> Create Package
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

export default NewPackage;

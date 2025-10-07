// components/admin/UpdateBook.jsx
import { useEffect, useState } from "react";
import { FiEdit2, FiUpload, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearErrors,
  getAdminBookDetails,
  updateBook,
} from "../../actions/bookAction";
import { getCategory } from "../../actions/categoryAction";
import MetaData from "../../component/layout/MetaData";
import { UPDATE_BOOK_RESET } from "../../constants/bookConstants";
import Sidebar from "./Sidebar";

const UpdateBook = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { book } = useSelector((state) => state.bookAdminDetails);
  const { loading, error, isUpdated } = useSelector((state) => state.book);
  const { categories } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    writer: "",
    type: "book",
    oldPrice: "",
    discountPrice: "",
    language: "",
    publisher: "",
    publishDate: "",
    deliveryTime: "",
    deliverToCountries: "",
    isbn13: "",
    category: "",
    videoLink: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [demoPdf, setDemoPdf] = useState(null);
  const [fullPdf, setFullPdf] = useState(null);
  const [demoAudio, setDemoAudio] = useState(null);
  const [fullAudio, setFullAudio] = useState(null);

  useEffect(() => {
    dispatch(getCategory());

    if (!book || book._id !== id) {
      dispatch(getAdminBookDetails(id));
    } else {
      setFormData({
        name: book.name,
        title: book.title,
        description: book.description,
        writer: book.writer,
        type: book.type,
        oldPrice: book.oldPrice,
        discountPrice: book.discountPrice,
        language: book.language || "",
        publisher: book.publisher || "",
        publishDate: book.publishDate || "",
        deliveryTime: book.deliveryTime || "",
        deliverToCountries: book.deliverToCountries || "",
        isbn13: book.isbn13 || "",
        category: book.category,
        videoLink: book.videoLink || "",
      });

      if (book.image) setImagePreview(book.image.url);
      if (book.images) setImagesPreview(book.images.map((img) => img.url));
      if (book.demoPdf) setDemoPdf(book.demoPdf);
      if (book.fullPdf) setFullPdf(book.fullPdf);
      if (book.demoAudio) setDemoAudio(book.demoAudio);
      if (book.fullAudio) setFullAudio(book.fullAudio);
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Book updated successfully");
      dispatch({ type: UPDATE_BOOK_RESET });
      dispatch(getAdminBookDetails(id));
    }
  }, [dispatch, error, isUpdated, id, book]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    data.set("name", formData.name);
    data.set("title", formData.title);
    data.set("description", formData.description);
    data.set("writer", formData.writer);
    data.set("type", formData.type);
    data.set("oldPrice", formData.oldPrice);
    data.set("discountPrice", formData.discountPrice);
    data.set("language", formData.language);
    data.set("publisher", formData.publisher);
    data.set("publishDate", formData.publishDate);
    data.set("deliveryTime", formData.deliveryTime);
    data.set("deliverToCountries", formData.deliverToCountries);
    data.set("isbn13", formData.isbn13);
    data.set("category", formData.category);

    if (formData.videoLink) data.set("videoLink", formData.videoLink);
    if (image) data.append("image", image);

    images.forEach((img) => {
      data.append("images", img);
    });

    // PDF files for book and ebook
    if (demoPdf && typeof demoPdf === "object") data.append("demoPdf", demoPdf);
    if (fullPdf && typeof fullPdf === "object") data.append("fullPdf", fullPdf);

    // Audio files for audiobook
    if (demoAudio && typeof demoAudio === "object")
      data.append("demoAudio", demoAudio);
    if (fullAudio && typeof fullAudio === "object")
      data.append("fullAudio", fullAudio);

    dispatch(updateBook(id, data));
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

  const handleAudioChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) setFile(file);
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);

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

  const removeAudio = (setFile) => {
    setFile(null);
  };

  const removeImage = (index) => {
    const newImagesPreview = [...imagesPreview];
    newImagesPreview.splice(index, 1);
    setImagesPreview(newImagesPreview);

    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Update Book" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Update Book</h1>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Book Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter book name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Book Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter book title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
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
                    value={formData.writer}
                    onChange={handleInputChange}
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
                    value={formData.category}
                    onChange={handleInputChange}
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
                    Book Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="book">Book</option>
                    <option value="ebook">E-Book</option>
                    <option value="audiobook">Audio-Book</option>
                  </select>
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
                    Language <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="language"
                    placeholder="Enter language"
                    required
                    value={formData.language}
                    onChange={handleInputChange}
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
                    value={formData.publisher}
                    onChange={handleInputChange}
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
                    value={formData.publishDate}
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
                    ISBN-13
                  </label>
                  <input
                    type="text"
                    name="isbn13"
                    placeholder="Enter ISBN-13"
                    value={formData.isbn13}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video Link (Optional)
                  </label>
                  <input
                    type="url"
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
                  placeholder="Enter book description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                ></textarea>
              </div>

              {/* File Upload Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Book Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Book Image <span className="text-red-500">*</span>
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

                {/* Additional Images */}
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

                {/* Demo PDF (for Book and E-Book) */}
                {formData.type !== "audiobook" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Demo PDF
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                        <FiUpload className="text-gray-400 mb-2" size={24} />
                        <span className="text-sm text-gray-500 text-center">
                          {demoPdf ? "Change PDF" : "Upload Demo PDF"}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) setDemoPdf(file);
                          }}
                          className="hidden"
                        />
                      </label>
                      {demoPdf && (
                        <div className="relative">
                          <div className="w-24 h-24 bg-gray-100 rounded-lg border flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              {typeof demoPdf === "object"
                                ? "New PDF"
                                : "Existing PDF"}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setDemoPdf(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Full PDF (for E-Book only) */}
                {formData.type === "ebook" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full PDF
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                        <FiUpload className="text-gray-400 mb-2" size={24} />
                        <span className="text-sm text-gray-500 text-center">
                          {fullPdf ? "Change PDF" : "Upload Full PDF"}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) setFullPdf(file);
                          }}
                          className="hidden"
                        />
                      </label>
                      {fullPdf && (
                        <div className="relative">
                          <div className="w-24 h-24 bg-gray-100 rounded-lg border flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              {typeof fullPdf === "object"
                                ? "New PDF"
                                : "Existing PDF"}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFullPdf(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Demo Audio (for Audio-Book only) */}
                {formData.type === "audiobook" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Demo Audio
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                        <FiUpload className="text-gray-400 mb-2" size={24} />
                        <span className="text-sm text-gray-500 text-center">
                          {demoAudio ? "Change Audio" : "Upload Demo Audio"}
                        </span>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => handleAudioChange(e, setDemoAudio)}
                          className="hidden"
                        />
                      </label>
                      {demoAudio && (
                        <div className="relative">
                          <div className="w-24 h-24 bg-gray-100 rounded-lg border flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              {typeof demoAudio === "object"
                                ? demoAudio.name
                                : "Existing Audio"}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAudio(setDemoAudio)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Full Audio (for Audio-Book only) */}
                {formData.type === "audiobook" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Audio
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                        <FiUpload className="text-gray-400 mb-2" size={24} />
                        <span className="text-sm text-gray-500 text-center">
                          {fullAudio ? "Change Audio" : "Upload Full Audio"}
                        </span>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => handleAudioChange(e, setFullAudio)}
                          className="hidden"
                        />
                      </label>
                      {fullAudio && (
                        <div className="relative">
                          <div className="w-24 h-24 bg-gray-100 rounded-lg border flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              {typeof fullAudio === "object"
                                ? fullAudio.name
                                : "Existing Audio"}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAudio(setFullAudio)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
                  "Updating..."
                ) : (
                  <>
                    <FiEdit2 size={18} /> Update Book
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

export default UpdateBook;

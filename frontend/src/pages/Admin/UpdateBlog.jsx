// components/admin/UpdateBlog.jsx
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  clearErrors,
  getAdminBlogDetails,
  updateBlog,
} from "../../actions/blogAction";

import MetaData from "../../component/layout/MetaData";
import { UPDATE_BLOG_RESET } from "../../constants/blogContants";
import Sidebar from "./Sidebar";

const UpdateBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: blogId } = useParams();

  const { blog } = useSelector((state) => state.blogDetails);
  const { loading, error, isUpdated } = useSelector((state) => state.blog);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!blog || blog._id !== blogId) {
      dispatch(getAdminBlogDetails(blogId));
    } else {
      setTitle(blog.title);
      setDesc(blog.desc);
      setImagePreview(blog.image?.url || "");
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Blog updated successfully");
      navigate("/admin/dashboard");
      dispatch({ type: UPDATE_BLOG_RESET });
    }
  }, [dispatch, blog, blogId, error, isUpdated, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      return toast.error("Only image files are allowed!");
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagePreview(reader.result);
        setImage(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("title", title);
    formData.set("desc", desc);
    if (image) formData.append("image", image);

    dispatch(updateBlog(blogId, formData));
  };

  return (
    <div className="w-full container min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <MetaData title="Update Blog" />
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-500 p-4 md:p-6">
              <h1 className="text-xl md:text-2xl font-bold text-white text-center">
                Update Blog Post
              </h1>
            </div>

            <form
              className="p-4 md:p-8 space-y-4 md:space-y-6"
              encType="multipart/form-data"
              onSubmit={submitHandler}
            >
              {/* Title */}
              <div className="space-y-1 md:space-y-2">
                <label className="block text-sm md:text-base font-medium text-gray-700">
                  Blog Title
                </label>
                <input
                  type="text"
                  placeholder="Enter blog title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                />
              </div>

              {/* Description */}
              <div className="space-y-1 md:space-y-2">
                <label className="block text-sm md:text-base font-medium text-gray-700">
                  Blog Description
                </label>
                <textarea
                  placeholder="Write your blog content here..."
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                ></textarea>
              </div>

              {/* Image Upload */}
              <div className="space-y-1 md:space-y-2">
                <label className="block text-sm md:text-base font-medium text-gray-700">
                  Upload New Image (optional)
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col w-full h-24 md:h-32 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg cursor-pointer transition duration-300 hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 md:pt-7">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 md:w-8 md:h-8 text-gray-400 group-hover:text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="pt-1 text-xs md:text-sm tracking-wider text-gray-400">
                        {image
                          ? `1 file selected`
                          : "Select image or drag and drop"}
                      </p>
                    </div>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="opacity-0"
                    />
                  </label>
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="space-y-1 md:space-y-2">
                  <label className="block text-sm md:text-base font-medium text-gray-700">
                    Image Preview
                  </label>
                  <div className="flex flex-wrap gap-2 md:gap-4 p-2 border border-gray-200 rounded-lg">
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-md shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 md:py-3 px-4 rounded-lg text-sm md:text-base font-medium text-white transition duration-300 cursor-pointer ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-600 shadow-md hover:shadow-lg"
                } flex items-center justify-center`}
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={20}
                      color="inherit"
                      className="mr-2"
                    />
                    Updating...
                  </>
                ) : (
                  "Update Blog Post"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateBlog;

import { useEffect, useState } from "react";
import { FiArrowLeft, FiEdit, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearErrors,
  deleteReview,
  getReviews,
  newReview,
  updateReview,
} from "../../actions/bookAction";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";
import {
  DELETE_REVIEW_RESET,
  NEW_REVIEW_RESET,
  UPDATE_REVIEW_RESET,
} from "../../constants/bookConstants";
import Sidebar from "./Sidebar";

// Star Rating Component
const StarRating = ({ rating, interactive = false, onChange }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange(star)}
          className={`text-2xl ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          } ${
            interactive
              ? "cursor-pointer hover:scale-110 transition-transform"
              : "cursor-default"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const Reviews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { type, id } = useParams();
  const [itemName, setItemName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [review, setReview] = useState({
    rating: 0,
    comment: "",
    image: null,
  });

  const { reviews, loading, error } = useSelector((state) => state.bookReviews);
  const { isDeleted, error: deleteError } = useSelector(
    (state) => state.bookReview
  );
  const { user } = useSelector((state) => state.user);
  const { success: reviewSubmitted, error: newReviewError } = useSelector(
    (state) => state.newReview
  );
  const { success: reviewUpdated, error: updateError } = useSelector(
    (state) => state.reviewUpdate
  );

  useEffect(() => {
    dispatch(getReviews(type, id));

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }

    if (newReviewError) {
      toast.error(newReviewError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Review deleted successfully");
      dispatch({ type: DELETE_REVIEW_RESET });
      dispatch(getReviews(type, id));
    }

    if (reviewSubmitted) {
      toast.success("Review added successfully");
      dispatch({ type: NEW_REVIEW_RESET });
      dispatch(getReviews(type, id));
      resetReviewForm();
    }

    if (reviewUpdated) {
      toast.success("Review updated successfully");
      dispatch({ type: UPDATE_REVIEW_RESET });
      dispatch(getReviews(type, id));
      resetReviewForm();
    }
  }, [
    dispatch,
    error,
    deleteError,
    updateError,
    newReviewError,
    isDeleted,
    reviewSubmitted,
    reviewUpdated,
    type,
    id,
  ]);

  const resetReviewForm = () => {
    setReview({
      rating: 0,
      comment: "",
    });
    setImage(null);
    setImagePreview(null);
    setShowReviewForm(false);
    setEditingReview(null);
  };

  const handleImageChange = (e, setFile, setPreview) => {
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

  const removeFile = (setFile, setPreview) => {
    setFile(null);
    setPreview(null);
  };

  const submitReview = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (review.rating === 0 || !review.comment.trim()) {
      toast.error("Please provide both rating and comment");
      return;
    }

    const formData = new FormData();
    formData.append("rating", review.rating);
    formData.append("comment", review.comment);
    formData.append("bookId", id);

    if (image) {
      formData.append("image", image);
    }

    if (editingReview) {
      dispatch(updateReview(editingReview._id, formData));
    } else {
      dispatch(newReview(formData));
    }
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(deleteReview(type, id, reviewId));
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReview({
      rating: review.rating,
      comment: review.comment,
    });
    if (review.reviewImage) setImagePreview(review.reviewImage?.url);
    setShowReviewForm(true);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title={`${itemName} Reviews`} />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-auto">
          <div className="mb-6">
            <button
              onClick={goBack}
              className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4 transition-colors"
            >
              <FiArrowLeft className="mr-2" /> Back to{" "}
              {type === "book" ? "Books" : "Packages"}
            </button>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                Reviews for {itemName || `${type} #${id}`}
              </h1>
              <button
                onClick={() => {
                  if (!user) {
                    navigate("/login");
                    return;
                  }
                  setShowReviewForm(!showReviewForm);
                  if (showReviewForm) {
                    resetReviewForm();
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center transition-colors w-full sm:w-auto justify-center"
              >
                <FiPlus className="mr-2" />
                {showReviewForm ? "Cancel" : "Add Review"}
              </button>
            </div>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                {editingReview ? "Edit Review" : "Write a Review"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Your Rating *
                  </label>
                  <StarRating
                    rating={review.rating}
                    interactive={true}
                    onChange={(rating) => setReview({ ...review, rating })}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Your Review *
                  </label>
                  <textarea
                    rows={4}
                    value={review.comment}
                    onChange={(e) =>
                      setReview({ ...review, comment: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Share your thoughts about this book..."
                  ></textarea>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Review Image (Optional){" "}
                    {imagePreview ? "Change Image" : "Upload Image"}
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(e, setImage, setImagePreview)
                        }
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
                      />
                    </div>
                    {imagePreview && (
                      <div className="relative flex-shrink-0">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-20 h-20 sm:w-16 sm:h-16 object-cover rounded-lg border"
                        />

                        <button
                          type="button"
                          onClick={() => removeFile(setImage, setImagePreview)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={submitReview}
                    disabled={review.rating === 0 || !review.comment.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {editingReview ? "Update Review" : "Submit Review"}
                  </button>
                  <button
                    onClick={resetReviewForm}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <Loader />
          ) : reviews?.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500 text-lg">
                No reviews found for this {type}
              </p>
              <p className="text-gray-400 mt-2">
                Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Mobile View - Cards */}
              <div className="block md:hidden">
                <div className="p-4 space-y-4">
                  {reviews?.map((review) => {
                    return (
                      <div
                        key={review._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-base">
                              {review?.name || "Deleted User"}
                            </h3>
                            <div className="flex items-center mt-1">
                              <StarRating rating={review.rating} />
                              <span className="text-sm text-gray-600 ml-2 font-medium">
                                {review.rating}/5
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-2">
                            <button
                              onClick={() => handleEditReview(review)}
                              className="text-indigo-600 hover:text-indigo-800 p-1 rounded transition-colors"
                              title="Edit Review"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                              title="Delete Review"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700 mb-3 leading-relaxed">
                          {review.comment || "No comment provided"}
                        </div>
                        {review.reviewImage?.url && (
                          <div className="mt-3">
                            <img
                              src={review.reviewImage.url}
                              alt="Review"
                              className="w-full max-w-[200px] h-auto object-cover rounded-lg border"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Desktop View - Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Comment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reviews?.map((review) => (
                      <tr
                        key={review._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {review?.name || "Deleted User"}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <StarRating rating={review.rating} />
                            <span className="ml-2 text-sm font-medium text-gray-600">
                              {review.rating}/5
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900 max-w-md break-words">
                            {review.comment || "No comment provided"}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {review.reviewImage?.url ? (
                            <img
                              src={review.reviewImage.url}
                              alt="Review"
                              className="w-16 h-16 object-cover rounded-lg border"
                            />
                          ) : (
                            <span className="text-sm text-gray-400 italic">
                              No image
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditReview(review)}
                              className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium transition-colors"
                              title="Edit Review"
                            >
                              <FiEdit className="mr-1" size={16} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              className="text-red-600 hover:text-red-800 flex items-center font-medium transition-colors"
                              title="Delete Review"
                            >
                              <FiTrash2 className="mr-1" size={16} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;

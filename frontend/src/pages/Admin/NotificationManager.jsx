import { useEffect, useState } from "react";
import { FiEdit2, FiRotateCw, FiSave, FiTrash2, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  clearErrors,
  createNotification,
  deleteNotification,
  getNotification,
  updateNotification,
} from "../../actions/notificationAction";
import MetaData from "../../component/layout/MetaData";
import {
  DELETE_NOTIFICATION_RESET,
  NEW_NOTIFICATION_RESET,
  UPDATE_NOTIFICATION_RESET,
} from "../../constants/notificationContants";
import Sidebar from "./Sidebar";

const NotificationManager = () => {
  const dispatch = useDispatch();

  const { notification, loading } = useSelector((state) => state.notification);
  const { error, success: createSuccess } = useSelector(
    (state) => state.newNotification
  );
  const { error: updateError, isUpdated } = useSelector(
    (state) => state.notificationUpdate
  );
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.notificationDelete
  );

  const [formData, setFormData] = useState({
    text: "",
    isActive: false,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(getNotification());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (createSuccess) {
      toast.success("Notification created successfully");
      dispatch({ type: NEW_NOTIFICATION_RESET });
      setIsEditing(false);
    }

    if (isUpdated) {
      toast.success("Notification updated successfully");
      dispatch({ type: UPDATE_NOTIFICATION_RESET });
      setIsEditing(false);
    }

    if (isDeleted) {
      toast.success("Notification deleted successfully");
      dispatch({ type: DELETE_NOTIFICATION_RESET });
      setFormData({ text: "", isActive: false });
    }
  }, [
    dispatch,
    error,
    updateError,
    deleteError,
    createSuccess,
    isUpdated,
    isDeleted,
  ]);

  useEffect(() => {
    if (notification) {
      setFormData({
        text: notification.text || "",
        isActive: notification.isActive || false,
      });
    }
  }, [notification]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.text.trim()) {
      toast.error("Notification text is required");
      return;
    }

    const notificationData = {
      text: formData.text.trim(),
      isActive: formData.isActive,
    };

    if (notification && notification._id) {
      // Update existing notification
      dispatch(updateNotification(notification._id, notificationData));
    } else {
      // Create new notification
      dispatch(createNotification(notificationData));
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      dispatch(deleteNotification(notification._id));
    }
  };

  const toggleNotificationStatus = () => {
    if (!notification || !notification._id) {
      toast.error(
        "Please save the notification first before enabling/disabling it"
      );
      return;
    }

    const updatedData = {
      text: formData.text,
      isActive: !formData.isActive,
    };

    dispatch(updateNotification(notification._id, updatedData));
  };

  const resetForm = () => {
    setFormData({
      text: "",
      isActive: false,
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Manage Notification" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Notification Manager
            </h1>
            <p className="text-gray-600 mt-2">
              Manage the notification banner that appears at the top of your
              website
            </p>
          </div>

          <div className="grid grid-cols-1  gap-6">
            {/* Editor Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6 h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FiEdit2 className="text-indigo-500" />
                    {notification && notification._id
                      ? "Edit Notification"
                      : "Create Notification"}
                  </h2>

                  {notification && notification._id && (
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="flex items-center gap-2 text-red-600 hover:text-red-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiTrash2 size={16} />
                      Delete
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notification Text <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.text}
                      onChange={(e) =>
                        setFormData({ ...formData, text: e.target.value })
                      }
                      placeholder="Enter your notification message (e.g., Welcome to Mind Storm Book)"
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This text will appear in the notification banner at the
                      top of your website.
                    </p>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <FiRotateCw className="animate-spin" size={18} />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FiSave size={18} />
                          {notification && notification._id
                            ? "Update Notification"
                            : "Create Notification"}
                        </>
                      )}
                    </button>

                    {notification && notification._id && (
                      <button
                        type="button"
                        onClick={resetForm}
                        disabled={loading}
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiX size={18} />
                        Reset
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationManager;

import { useEffect, useState } from "react";
import { FiBell, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getNotification } from "../../actions/notificationAction";

const NotificationBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const dispatch = useDispatch();
  const { notification, loading } = useSelector((state) => state.notification);
  const handleDismiss = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    dispatch(getNotification());
  }, [dispatch]);

  if (!isVisible) return null;
  return (
    notification && (
      <div className="bg-indigo-100 container border-b border-indigo-200 text-indigo-700 px-4 py-3 relative overflow-hidden">
        {/* Animated sliding background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-slide"></div>

        <div className=" mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <FiBell className="mr-3 text-indigo-500 animate-pulse" />
            {loading ? (
              "loading"
            ) : (
              <p className="font-medium">{notification?.text}</p>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="text-indigo-500 hover:text-indigo-700 transition-colors"
            aria-label="Dismiss notification"
          >
            <FiX className="text-lg" />
          </button>
        </div>
      </div>
    )
  );
};

export default NotificationBanner;

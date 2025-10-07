import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";

const Profile = () => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <MetaData title={`${user?.name || "User"}'s Profile`} />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">Manage your personal information</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Profile Banner */}
            <div className="h-32 bg-gradient-to-r from-indigo-500 to-blue-600 relative">
              <div className="absolute -bottom-16 left-8">
                <div className="relative group">
                  <img
                    src={user?.avatar?.url || "/default-avatar.png"}
                    loading="lazy"
                    alt={user?.name || "User"}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                  />
                  <Link
                    to="/profile/update"
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                    title="Edit Profile"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-20 px-8 pb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Quick Actions */}
              <div className="md:col-span-1 space-y-4">
                <div className="bg-indigo-50 rounded-xl p-6">
                  <h3 className="font-medium text-indigo-800 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Link
                      to="/profile/update"
                      className="flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit Profile
                    </Link>
                    {user?.provider === "local" && (
                      <Link
                        to="/password/update"
                        className="flex items-center text-indigo-600 hover:text-indigo-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Change Password
                      </Link>
                    )}
                    <Link
                      to="/profile/delete"
                      className="flex items-center text-red-600 hover:text-red-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 8a1 1 0 011-1h6a1 1 0 011 1v7a2 2 0 01-2 2H8a2 2 0 01-2-2V8zm3-5a1 1 0 00-1 1v1H5.5a.5.5 0 000 1h9a.5.5 0 000-1H12V4a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Delete Account
                    </Link>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-medium text-blue-800 mb-4">
                    Account Status
                  </h3>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-indigo-500 mr-2"></div>
                    <span className="text-sm text-gray-700">Active</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Member since{" "}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Right Column - Profile Details */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Personal Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Full Name
                      </label>
                      <p className="text-lg font-medium text-gray-800 bg-gray-50 p-3 rounded-lg">
                        {user?.name || "N/A"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Email Address
                      </label>
                      <p className="text-lg font-medium text-gray-800 bg-gray-50 p-3 rounded-lg">
                        {user?.email || "N/A"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Phone Number
                      </label>
                      <p className="text-lg font-medium text-gray-800 bg-gray-50 p-3 rounded-lg">
                        {user?.number || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Country Name
                      </label>
                      <p className="text-lg font-medium text-gray-800 bg-gray-50 p-3 rounded-lg capitalize">
                        {user?.country || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Account Type
                      </label>
                      <p className="text-lg font-medium text-gray-800 bg-gray-50 p-3 rounded-lg capitalize">
                        {user?.provider || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Info Section */}
                <div className="mt-6 bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Additional Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Account Created
                      </label>
                      <p className="text-gray-800">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

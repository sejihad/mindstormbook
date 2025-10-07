import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import {
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiKey,
  FiLock,
  FiUnlock,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearErrors, logout, updatePassword } from "../../actions/userAction";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";
import { UPDATE_PASSWORD_RESET } from "../../constants/userContants.jsx";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, isUpdated, loading } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.user);

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    showPassword: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setPasswords((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const updatePasswordSubmit = (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    const formData = new FormData();
    formData.set("oldPassword", passwords.oldPassword);
    formData.set("newPassword", passwords.newPassword);
    formData.set("confirmPassword", passwords.confirmPassword);

    dispatch(updatePassword(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Password changed successfully!");
      dispatch(logout());
      navigate("/login");
      dispatch({ type: UPDATE_PASSWORD_RESET });
    }
  }, [dispatch, error, isUpdated, navigate]);

  if (loading) return <Loader />;

  return (
    <>
      <MetaData title="Change Password" />
      {user?.provider === "local" ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
            >
              <FiArrowLeft className="mr-1" /> Back to Profile
            </button>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header with animated gradient */}
              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-10"></div>
                <h2 className="text-2xl font-bold text-white relative z-10">
                  Update Your Password
                </h2>
                <p className="text-indigo-100 mt-1 relative z-10">
                  Secure your account with a new password
                </p>
              </div>

              {/* Form */}
              <form className="p-6 space-y-5" onSubmit={updatePasswordSubmit}>
                {/* Current Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center">
                    <FiKey className="mr-2" /> Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwords.showPassword ? "text" : "password"}
                      name="oldPassword"
                      value={passwords.oldPassword}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                      placeholder="Enter current password"
                    />
                    <FiKey className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center">
                    <FiUnlock className="mr-2" /> New Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwords.showPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handleChange}
                      required
                      minLength="6"
                      className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                      placeholder="Enter new password"
                    />
                    <FiUnlock className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center">
                    <FiLock className="mr-2" /> Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwords.showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                      placeholder="Confirm new password"
                    />
                    <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>

                {/* Show/Hide toggle */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                  >
                    {passwords.showPassword ? (
                      <>
                        <FiEyeOff className="mr-1" /> Hide Passwords
                      </>
                    ) : (
                      <>
                        <FiEye className="mr-1" /> Show Passwords
                      </>
                    )}
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 cursor-pointer to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 mt-4"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-2 text-sm text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-md px-4 py-2">
          <FaExclamationTriangle className="text-yellow-600" />
          You cannot change your password because you are logged in with{" "}
          <span className="font-semibold">{user?.provider}</span>.
        </div>
      )}
    </>
  );
};

export default UpdatePassword;

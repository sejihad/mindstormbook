import { useEffect, useState } from "react";
import { FaExclamationTriangle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { clearErrors, resetPassword } from "../../actions/userAction";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const { error, success, loading } = useSelector(
    (state) => state.forgotPassword
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    dispatch(resetPassword(token, { password, confirmPassword }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Password updated successfully!");
      navigate("/login");
    }
  }, [dispatch, error, success, navigate]);

  if (loading) return <Loader />;

  return (
    <>
      <MetaData title="Reset Password" />
      <div className="flex items-center justify-center gap-2 mt-2 text-sm text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-md px-4 py-2 ">
        <FaExclamationTriangle className="text-yellow-600" />
        If you are logged in with google or facebook.You can login without
        password
      </div>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] px-4">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.2)] p-10 overflow-hidden">
          <h2 className="text-3xl font-extrabold text-center text-[#333] mb-6">
            Reset Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#555] mb-2 font-medium">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                  className="w-full px-5 py-3 pl-5 pr-12 bg-[#eee] text-[#333] rounded-xl outline-none text-base font-medium placeholder-[#888]"
                />
                <span
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-[#888] cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[#555] mb-2 font-medium">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                  className="w-full px-5 py-3 pl-5 pr-12 bg-[#eee] text-[#333] rounded-xl outline-none text-base font-medium placeholder-[#888]"
                />
                <span
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-[#888] cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-500 text-white cursor-pointer py-3 rounded-xl font-semibold shadow-md transition"
            >
              Reset Password
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            Remembered your password?
            <Link
              to="/login"
              className="text-green-500 font-medium hover:underline ml-1"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;

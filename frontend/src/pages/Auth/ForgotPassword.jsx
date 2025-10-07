import { useEffect, useState } from "react";
import { FiMail } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearErrors, forgotPassword } from "../../actions/userAction"; // <-- path adjust করে নিও
const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const { loading, message, error } = useSelector(
    (state) => state.forgotPassword
  );
  const { isAuthenticated } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email })); // sending as { email } object
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (message) {
      toast.success(message);
    }
  }, [message, error, dispatch, isAuthenticated, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] px-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.2)] p-10 overflow-hidden">
        <h2 className="text-3xl font-extrabold text-center text-[#333] mb-6">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3 pl-5 pr-12 bg-[#eee] text-[#333] rounded-xl outline-none text-base font-medium placeholder-[#888]"
            />
            <FiMail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-[#888]" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00A63E] hover:bg-[#00A63F] text-white py-3 rounded-xl font-semibold shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Back to
          <Link
            to="/login"
            className="text-[#00A63E] font-medium hover:underline ml-1"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

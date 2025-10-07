import { useEffect, useState } from "react";
import { FiFileText, FiMail, FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearErrors, ContactUs } from "../../actions/userAction";
import MetaData from "../../component/layout/MetaData";
import { CONTACT_USER_RESET } from "../../constants/userContants";

const Contact = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { success, error } = useSelector((state) => state.userEmail);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (success) {
      toast.success("Your message sent successfully");
      setLoading(false);
      dispatch({ type: CONTACT_USER_RESET });
      navigate("/");
    }
    if (error) {
      toast.error("Failed to send message");
      setLoading(false);
      dispatch(clearErrors());
    }
  }, [dispatch, navigate, success, error]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      return toast.error("Please fill all fields");
    }
    setLoading(true);
    await dispatch(ContactUs(formData));
  };

  return (
    <>
      <MetaData title="Contact Us" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back Button */}

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-center">
              <h2 className="text-2xl font-bold text-white">Contact Us</h2>
            </div>

            {/* Form */}
            <form className="p-6 space-y-5" onSubmit={submitHandler}>
              {/* Information Text */}
              <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm">
                <p>
                  Have any questions, feedback, or concerns? Fill out the form
                  below and our team will get back to you as soon as possible.
                </p>
              </div>

              {/* Name Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 flex items-center">
                  <FiUser className="mr-2" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 flex items-center">
                  <FiMail className="mr-2" /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Reason Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 flex items-center">
                  <FiFileText className="mr-2" /> Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition min-h-[120px]"
                  placeholder="Enter your message..."
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-600 cursor-pointer hover:from-indigo-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;

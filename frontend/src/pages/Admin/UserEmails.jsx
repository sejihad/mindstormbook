import axios from "axios";
import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiCopy,
  FiMail,
  FiPaperclip,
  FiRotateCw,
  FiSearch,
  FiSend,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllUsers } from "../../actions/userAction";
import MetaData from "../../component/layout/MetaData";
import Sidebar from "./Sidebar";
import "./UserEmails.css";

const UserEmails = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.allUsers);
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);

  // Email sending states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: "",
    message: "",
    recipients: [], // Selected emails
  });
  const [attachments, setAttachments] = useState([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users) {
      const userEmails = users
        .filter((user) => user.role === "user")
        .map((user) => user.email);
      setEmails(userEmails);
      setFilteredEmails(userEmails);
    }
  }, [users]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = emails.filter((email) =>
        email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmails(filtered);
    } else {
      setFilteredEmails(emails);
    }
  }, [searchTerm, emails]);

  const copyAllEmails = () => {
    const emailString = emails.join(", ");
    navigator.clipboard
      .writeText(emailString)
      .then(() => {
        setCopied(true);
        toast.success("All emails copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        toast.error("Failed to copy emails");
        console.error("Copy failed:", err);
      });
  };

  const copyEmail = (email) => {
    navigator.clipboard
      .writeText(email)
      .then(() => {
        toast.success("Email copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy email");
        console.error("Copy failed:", err);
      });
  };

  // Email Sending Functions
  const openEmailModal = (specificEmail = null) => {
    if (specificEmail) {
      setEmailData({
        subject: "",
        message: "",
        recipients: [specificEmail],
      });
    } else {
      setEmailData({
        subject: "",
        message: "",
        recipients: [...emails], // All emails by default
      });
    }
    setShowEmailModal(true);
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
    setEmailData({ subject: "", message: "", recipients: [] });
    setAttachments([]);
  };

  const handleEmailChange = (e) => {
    setEmailData({
      ...emailData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRecipientToggle = (email) => {
    setEmailData((prev) => ({
      ...prev,
      recipients: prev.recipients.includes(email)
        ? prev.recipients.filter((e) => e !== email)
        : [...prev.recipients, email],
    }));
  };

  const selectAllRecipients = () => {
    setEmailData((prev) => ({
      ...prev,
      recipients: [...emails],
    }));
  };

  const clearAllRecipients = () => {
    setEmailData((prev) => ({
      ...prev,
      recipients: [],
    }));
  };

  // Handle file input
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    const filePromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          // Remove "data:*/*;base64," prefix
          resolve({ name: file.name, data: reader.result.split(",")[1] });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    const base64Files = await Promise.all(filePromises);
    setAttachments((prev) => [...prev, ...base64Files]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Send email function
  const sendEmail = async () => {
    if (
      !emailData.subject ||
      !emailData.message ||
      emailData.recipients.length === 0
    ) {
      toast.error("Please fill all fields and select at least one recipient");
      return;
    }

    setIsSending(true);

    try {
      const payload = {
        subject: emailData.subject,
        message: emailData.message,
        recipients: JSON.stringify(emailData.recipients),
        attachments: JSON.stringify(attachments),
      };

      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/send-bulk-email`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(
          `Email sent to ${emailData.recipients.length} recipients successfully!`
        );
        closeEmailModal();
        setAttachments([]); // clear attachments
      } else {
        throw new Error(data.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Email sending failed:", error);
      toast.error(
        "Failed to send email: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="User Email Management" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FiMail className="text-indigo-500" />
              User Email Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and send emails to your users
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FiMail className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Emails</p>
                <p className="text-xl font-bold">{emails.length}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4">
              <button
                onClick={copyAllEmails}
                disabled={emails.length === 0 || loading}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors ${
                  emails.length === 0 || loading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {copied ? (
                  <>
                    <FiCheckCircle size={18} />
                    Copied!
                  </>
                ) : (
                  <>
                    <FiCopy size={18} />
                    Copy All Emails
                  </>
                )}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4">
              <button
                onClick={() => openEmailModal()}
                disabled={emails.length === 0 || loading}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors ${
                  emails.length === 0 || loading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <FiSend size={18} />
                Send Email
              </button>
            </div>
          </div>

          {/* Search and Email List */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h2 className="text-lg font-semibold text-gray-800">
                User Emails ({filteredEmails.length})
              </h2>

              <div className="flex gap-3">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <FiRotateCw className="animate-spin text-indigo-600 text-2xl" />
              </div>
            ) : filteredEmails.length > 0 ? (
              <div className="email-list-container">
                <div className="email-list-header">
                  <span>Email Address</span>
                  <span>Actions</span>
                </div>
                <div className="email-list">
                  {filteredEmails.map((email, index) => (
                    <div key={index} className="email-item">
                      <span className="email-text">{email}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyEmail(email)}
                          className="copy-btn"
                          title="Copy email"
                        >
                          <FiCopy size={16} />
                        </button>
                        <button
                          onClick={() => openEmailModal(email)}
                          className="send-btn"
                          title="Send email to this user"
                        >
                          <FiSend size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchTerm
                  ? "No emails match your search"
                  : "No user emails found"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Sending Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-600 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  Send Email to Users
                </h2>
                <button
                  onClick={closeEmailModal}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Recipients Selection */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Recipients ({emailData.recipients.length} selected)
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={selectAllRecipients}
                      className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                    >
                      Select All
                    </button>
                    <button
                      onClick={clearAllRecipients}
                      className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                <div className="border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto">
                  {emails.map((email) => (
                    <label
                      key={email}
                      className="flex items-center gap-2 mb-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={emailData.recipients.includes(email)}
                        onChange={() => handleRecipientToggle(email)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm">{email}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={emailData.subject}
                  onChange={handleEmailChange}
                  placeholder="Enter email subject"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Message */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={emailData.message}
                  onChange={handleEmailChange}
                  placeholder="Write your email message here..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Attachments */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept="image/*,.pdf,.doc,.docx,.mp3,.wav,.mp4"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center cursor-pointer p-4 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <FiPaperclip className="text-gray-400 text-xl mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload files or drag and drop
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      Supports: Images, PDF, Word, Audio, Video
                    </span>
                  </label>
                </div>

                {/* Attachments List */}
                {attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FiPaperclip className="text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {file.name}
                          </span>
                        </div>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={closeEmailModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={sendEmail}
                disabled={isSending || emailData.recipients.length === 0}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                  isSending || emailData.recipients.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {isSending ? (
                  <>
                    <FiRotateCw className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend />
                    Send Email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserEmails;

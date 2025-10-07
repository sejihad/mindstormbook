import { Country } from "country-state-city";
import { useEffect, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiCamera,
  FiChevronDown,
  FiGlobe,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearErrors, loadUser, updateProfile } from "../../actions/userAction";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";
import { UPDATE_PROFILE_RESET } from "../../constants/userContants";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const countryDropdownRef = useRef(null);

  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [country, setCountry] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");
  const [isHovering, setIsHovering] = useState(false);

  // Load all countries on component mount
  useEffect(() => {
    const countries = Country.getAllCountries();
    setFilteredCountries(countries);

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target)
      ) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter countries based on search input
  useEffect(() => {
    if (countrySearch) {
      const filtered = Country.getAllCountries().filter((c) =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(Country.getAllCountries());
    }
  }, [countrySearch]);

  const updateProfileSubmit = async (e) => {
    e.preventDefault();

    const formData = {};

    if (name !== user.name) {
      formData.name = name;
    }
    if (country !== user.country) {
      formData.country = country;
    }
    if (number !== user.number) {
      formData.number = number;
    }

    if (avatar) {
      const reader = new FileReader();
      reader.readAsDataURL(avatar);
      reader.onload = async () => {
        const base64Image = reader.result.split(",")[1];
        formData.avatar = base64Image;

        if (Object.keys(formData).length === 0) {
          return toast.info("No changes detected.");
        }

        await dispatch(updateProfile(formData));
      };
    } else {
      if (Object.keys(formData).length === 0) {
        return toast.info("No changes detected.");
      }

      await dispatch(updateProfile(formData));
    }
  };

  const updateProfileDataChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleCountrySelect = (countryName) => {
    setCountry(countryName);
    setShowCountryDropdown(false);
    setCountrySearch("");
  };

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setCountry(user.country || "");
      setNumber(user.number || "");
      setAvatarPreview(user.avatar?.url || "/Profile.png");
    }
  }, [user]);

  useEffect(() => {
    if (isUpdated) {
      toast.success("Profile Updated Successfully");
      dispatch(loadUser());
      navigate("/profile");
      dispatch({ type: UPDATE_PROFILE_RESET });
    }
  }, [isUpdated, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Update Profile" />
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
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-center">
                  <h2 className="text-2xl font-bold text-white">
                    Update Your Profile
                  </h2>
                  <p className="text-indigo-100 mt-1">
                    Keep your information up to date
                  </p>
                </div>

                {/* Form */}
                <form className="p-6 space-y-5" onSubmit={updateProfileSubmit}>
                  {/* Avatar Upload */}
                  <div className="flex justify-center">
                    <div
                      className="relative group cursor-pointer"
                      onClick={handleAvatarClick}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                    >
                      <div className="relative group">
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg transition-all duration-300 group-hover:scale-105"
                        />
                        {/* Pencil Icon */}
                        <div className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full shadow-md transition-all duration-300 group-hover:bg-indigo-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </div>
                      </div>
                      <div
                        className={`absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center transition-opacity duration-300 ${
                          isHovering ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <FiCamera className="text-white text-xl" />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={updateProfileDataChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Name Field */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <FiUser className="mr-2" /> Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Country Field */}
                  <div className="space-y-1" ref={countryDropdownRef}>
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <FiGlobe className="mr-2" /> Country
                    </label>
                    <div className="relative">
                      <div
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition flex items-center justify-between cursor-pointer"
                        onClick={() =>
                          setShowCountryDropdown(!showCountryDropdown)
                        }
                      >
                        <span>{country || "Select your country"}</span>
                        <FiChevronDown
                          className={`transition-transform ${
                            showCountryDropdown ? "transform rotate-180" : ""
                          }`}
                        />
                      </div>

                      {showCountryDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                          <div className="p-2 sticky top-0 bg-white border-b">
                            <input
                              type="text"
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                              placeholder="Search country..."
                              autoFocus
                            />
                          </div>
                          <div className="py-1">
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((c) => (
                                <div
                                  key={c.isoCode}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                  onClick={() => handleCountrySelect(c.name)}
                                >
                                  <span className="mr-2">{c.flag}</span>
                                  {c.name}
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-gray-500">
                                No countries found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <FiPhone className="mr-2" /> Phone Number
                    </label>
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 cursor-pointer hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 ${
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
                        Updating...
                      </span>
                    ) : (
                      "Update Profile"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UpdateProfile;

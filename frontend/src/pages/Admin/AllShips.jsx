// components/admin/ShippingManager.jsx
import { Country } from "country-state-city";
import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  clearErrors,
  createShip,
  deleteShip,
  getAdminShips,
  updateShip,
} from "../../actions/shipAction";
import MetaData from "../../component/layout/MetaData";
import {
  DELETE_SHIP_RESET,
  NEW_SHIP_RESET,
  UPDATE_SHIP_RESET,
} from "../../constants/shipContants";
import Sidebar from "./Sidebar";

const AllShips = () => {
  const dispatch = useDispatch();

  const { ships } = useSelector((state) => state.ships);
  const { loading, error, success } = useSelector((state) => state.newShip);
  const {
    error: updateDeleteError,
    isDeleted,
    isUpdated,
  } = useSelector((state) => state.ship);

  const [country, setCountry] = useState("");
  const [charge, setCharge] = useState("");
  const [editId, setEditId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Get all countries from the library
  const allCountries = Country.getAllCountries();

  // Filter out countries that already have shipping charges
  const availableCountries = allCountries.filter(
    (countryObj) => !ships?.some((ship) => ship.country === countryObj.name)
  );

  useEffect(() => {
    dispatch(getAdminShips());

    if (error || updateDeleteError) {
      toast.error(error || updateDeleteError);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success(
        editId
          ? "Shipping charge updated successfully"
          : "Shipping charge created successfully"
      );
      dispatch({ type: NEW_SHIP_RESET });
      resetForm();
      setIsFormOpen(false);
    }

    if (isDeleted) {
      toast.success("Shipping charge deleted");
      dispatch({ type: DELETE_SHIP_RESET });
      dispatch(getAdminShips());
    }

    if (isUpdated) {
      toast.success("Shipping charge updated");
      dispatch({ type: UPDATE_SHIP_RESET });
      dispatch(getAdminShips());
      resetForm();
    }
  }, [
    dispatch,
    error,
    success,
    isDeleted,
    isUpdated,
    updateDeleteError,
    editId,
  ]);

  const resetForm = () => {
    setEditId(null);
    setCountry("");
    setCharge("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!country || !charge) {
      return toast.error("Please fill all fields");
    }

    // Validate charge is a positive number
    if (Number(charge) <= 0) {
      return toast.error("Shipping charge must be greater than 0");
    }

    const formData = {
      country,
      charge: Number(charge),
    };

    if (editId) {
      dispatch(updateShip(editId, formData));
    } else {
      // Check if country already exists (shouldn't happen due to filtered dropdown)
      if (ships.some((ship) => ship.country === country)) {
        return toast.error("This country already has a shipping charge");
      }
      dispatch(createShip(formData));
    }
  };

  const handleEdit = (shipping) => {
    setEditId(shipping._id);
    setCountry(shipping.country);
    setCharge(shipping.charge);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (
      window.confirm("Are you sure you want to delete this shipping charge?")
    ) {
      dispatch(deleteShip(id));
    }
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Manage Shipping Charges" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Shipping Charge Manager
            </h1>
            <button
              onClick={() => {
                resetForm();
                setIsFormOpen(!isFormOpen);
              }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              {isFormOpen ? (
                <>
                  <FiX size={18} /> Close
                </>
              ) : (
                <>
                  <FiPlus size={18} /> Add Shipping Charge
                </>
              )}
            </button>
          </div>

          {isFormOpen && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {editId ? "Edit Shipping Charge" : "Create New Shipping Charge"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    disabled={editId !== null} // Disable country selection when editing
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      editId ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  >
                    <option value="">Select a country</option>
                    {editId ? (
                      <option value={country}>{country}</option>
                    ) : (
                      availableCountries.map((country) => (
                        <option key={country.isoCode} value={country.name}>
                          {country.name}
                        </option>
                      ))
                    )}
                  </select>
                  {editId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Country cannot be changed when editing. Delete and
                      recreate if needed.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Charge (USD){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter shipping charge"
                    required
                    min="0.01"
                    step="0.01"
                    value={charge}
                    onChange={(e) => setCharge(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 cursor-pointer rounded-lg text-white font-semibold flex items-center justify-center gap-2 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {loading ? (
                    "Processing..."
                  ) : editId ? (
                    <>
                      <FiEdit2 size={18} /> Update Charge
                    </>
                  ) : (
                    <>
                      <FiPlus size={18} /> Create Charge
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                All Shipping Charges
              </h2>
              <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                {ships?.length || 0} charges
              </span>
            </div>

            {ships?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No shipping charges found. Create one to get started!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Country
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Charge (USD)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ships?.map((charge) => (
                      <tr key={charge._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {charge.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${charge.charge.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(charge)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 cursor-pointer rounded-full transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(charge._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllShips;

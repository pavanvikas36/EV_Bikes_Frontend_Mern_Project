import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function EditVehicleModal({ isOpen, onClose, vehicle, onUpdated }) {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    price: "",
    fuelType: "Petrol",
    transmission: "Manual",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Prefill form
  useEffect(() => {
    if (vehicle) {
      setFormData({
        brand: vehicle.brand || "",
        model: vehicle.model || "",
        price: vehicle.price || "",
        fuelType: vehicle.fuelType || "Petrol",
        transmission: vehicle.transmission || "Manual",
        description: vehicle.description || "",
      });
    }
  }, [vehicle]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      await axios.put(
        `https://evbikesservermernproject-jenv.onrender.com/dealers/updateVehicle/${vehicle._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        title: "Updated!",
        text: "Vehicle updated successfully",
        icon: "success",
        background: "#000",
        color: "#fff",
        confirmButtonColor: "#f97316",
        timer: 2000,
        showConfirmButton: false,
      });

      onUpdated();
      onClose();
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Update failed",
        icon: "error",
        background: "#000",
        color: "#fff",
        confirmButtonColor: "#f97316",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="max-w-2xl w-full bg-black p-8 rounded-xl shadow-2xl border border-orange-500/30 relative">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-orange-500 mb-2">
            Edit Vehicle
          </h2>
          <p className="text-white/70">
            Update your vehicle information
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleUpdate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brand */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Model *
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Price *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fuel */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Fuel Type *
              </label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
              >
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
                <option>Hybrid</option>
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Transmission *
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
              >
                <option>Manual</option>
                <option>Automatic</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white resize-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-orange-500 text-black rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditVehicleModal;

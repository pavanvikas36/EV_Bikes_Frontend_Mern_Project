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

  const token = localStorage.getItem("token");

  // Prefill data when modal opens
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
        icon: "success",
        title: "Updated!",
        text: "Vehicle updated successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      onUpdated();
      onClose();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Update failed",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 relative">
        <h2 className="text-xl font-bold mb-4">Edit Vehicle</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Model"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border p-2 rounded"
            required
          />

          <select
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option>Petrol</option>
            <option>Diesel</option>
            <option>Electric</option>
            <option>Hybrid</option>
          </select>

          <select
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option>Manual</option>
            <option>Automatic</option>
          </select>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 rounded"
            rows="3"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditVehicleModal;

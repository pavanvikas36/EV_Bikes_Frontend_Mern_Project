import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function AddVehicle({ onVehicleAdded }) {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    price: "",
    fuelType: "Petrol",
    transmission: "Manual",
    description: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [, setSuccessMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, images: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSuccessMessage("");

      const data = new FormData();
      data.append("brand", formData.brand);
      data.append("model", formData.model);
      data.append("price", formData.price);
      data.append("fuelType", formData.fuelType);
      data.append("transmission", formData.transmission);
      data.append("description", formData.description);

      formData.images.forEach((img) => {
        data.append("images", img);
      });

      console.log("Submitting vehicle:", formData);

      const res = await axios.post(
        "https://evbikesservermernproject-jenv.onrender.com/dealers/vehicles",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", res.data);

      Swal.fire({
        title: "Success!",
        text: "Vehicle added successfully!",
        icon: "success",
        background: "#000",
        color: "#fff",
        confirmButtonColor: "#f97316",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      setFormData({
        brand: "",
        model: "",
        price: "",
        fuelType: "Petrol",
        transmission: "Manual",
        description: "",
        images: [],
      });

      if (onVehicleAdded) onVehicleAdded();
    } catch (error) {
      console.error("Add vehicle error:", error.response?.data || error.message);

      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to add vehicle",
        icon: "error",
        background: "#000",
        color: "#fff",
        confirmButtonColor: "#f97316",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-black p-8 rounded-xl shadow-2xl border border-orange-500/30 relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-orange-500/10 rounded-full"></div>
      <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-orange-500/5 rounded-full"></div>

      <div className="relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-orange-500 mb-2">
            Add New Vehicle
          </h2>
          <p className="text-white/70">List a new vehicle in your inventory</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                placeholder="e.g., Tesla, Honda, Toyota"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Model *
              </label>
              <input
                type="text"
                name="model"
                placeholder="e.g., Model 3, Civic, Camry"
                value={formData.model}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Price ($) *
            </label>
            <input
              type="number"
              name="price"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Fuel Type *
              </label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
              >
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
                <option>Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Transmission *
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
              >
                <option>Manual</option>
                <option>Automatic</option>
              </select>
            </div>
          </div>

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
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Images *
            </label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleChange}
              required
              className="text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-black py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? "Adding Vehicle..." : "Add Vehicle"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddVehicle;

import { useState, } from "react";
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
      
      // Show success alert
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

      // reset form
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
      
      // Show error alert
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
      {/* Decorative elements */}
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
            {/* Brand */}
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
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
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
                placeholder="e.g., Model 3, Civic, Camry"
                value={formData.model}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Price */}
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
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fuel Type */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Fuel Type *
              </label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              >
                <option value="Petrol" className="bg-gray-900">Petrol</option>
                <option value="Diesel" className="bg-gray-900">Diesel</option>
                <option value="Electric" className="bg-gray-900">Electric</option>
                <option value="Hybrid" className="bg-gray-900">Hybrid</option>
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
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              >
                <option value="Manual" className="bg-gray-900">Manual</option>
                <option value="Automatic" className="bg-gray-900">Automatic</option>
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
              placeholder="Describe the vehicle features, condition, and specifications..."
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Images *
            </label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center bg-gray-900/50 transition hover:border-orange-500/50">
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleChange}
                className="hidden"
                id="vehicle-images"
                required
              />
              <label htmlFor="vehicle-images" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-12 h-12 text-orange-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p className="text-white font-medium">Click to upload images</p>
                  <p className="text-gray-400 text-sm mt-1">Upload multiple vehicle images</p>
                  {formData.images.length > 0 && (
                    <p className="text-orange-400 text-sm mt-2">
                      {formData.images.length} file(s) selected
                    </p>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-black py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Vehicle...
              </>
            ) : (
              "Add Vehicle"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddVehicle;
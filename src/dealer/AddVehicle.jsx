import { useState, useEffect } from "react";
import axios from "axios";

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
  const [successMessage, setSuccessMessage] = useState("");

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

      console.log("Response:", res.data); // ✅ only log data, not whole res
      setSuccessMessage("Vehicle added successfully!");

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
      alert(error.response?.data?.message || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Optional useEffect: clear success message after 3s
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Vehicle</h2>
      {successMessage && (
        <p className="text-green-600 text-center mb-2">{successMessage}</p>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded bg-gray-50 focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={formData.model}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded bg-gray-50 focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded bg-gray-50 focus:ring-2 focus:ring-orange-500"
        />
        <select
          name="fuelType"
          value={formData.fuelType}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        <select
          name="transmission"
          value={formData.transmission}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
        </select>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
        >
          {loading ? "Adding..." : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
}

export default AddVehicle;

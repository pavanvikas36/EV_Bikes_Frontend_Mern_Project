import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Profile from "../pages/Profile";
import AddVehicle from "./AddVehicle"; // Add Vehicle component

function DealerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const userRole = localStorage.getItem("role");

  // Redirect non-dealer users
  useEffect(() => {
    if (userRole !== "dealer") {
      navigate("/login", { replace: true });
    }
  }, [navigate, userRole]);

  // Fetch dealer vehicles
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://evbikesservermernproject-jenv.onrender.com/dealers/getAllVehicles",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Vehicles response:", res.data);
      setVehicles(res.data.data || []);
    } catch (err) {
      console.error("Fetch vehicles error:", err);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch vehicles on mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Delete vehicle
  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm("Are you sure to delete this vehicle?")) return;
    try {
      await axios.delete(
        `https://evbikesservermernproject-jenv.onrender.com/dealer/vehicles/${vehicleId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Vehicle deleted successfully!");
      fetchVehicles();
    } catch (err) {
      console.error("Delete vehicle error:", err);
      alert("Failed to delete vehicle");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-5 flex-shrink-0">
        <h2 className="text-2xl font-bold text-orange-500 mb-6">RevVolt</h2>
        <ul className="space-y-4">
          <li
            className={`cursor-pointer ${
              activeTab === "overview" ? "text-orange-400" : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Dashboard
          </li>
          <li
            className={`cursor-pointer ${
              activeTab === "add" ? "text-orange-400" : ""
            }`}
            onClick={() => setActiveTab("add")}
          >
            Add Vehicle
          </li>
          <li
            className={`cursor-pointer ${
              activeTab === "manage" ? "text-orange-400" : ""
            }`}
            onClick={() => setActiveTab("manage")}
          >
            Manage Vehicles
          </li>
          <li
            className={`cursor-pointer ${
              activeTab === "orders" ? "text-orange-400" : ""
            }`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </li>
          <li
            className={`cursor-pointer ${
              activeTab === "profile" ? "text-orange-400" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto h-full">
        {/* Dashboard Overview */}
        {activeTab === "overview" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white shadow p-6 rounded-lg">
                <h2 className="text-lg font-semibold">Total Vehicles</h2>
                <p className="text-3xl font-bold text-orange-500">
                  {vehicles.length}
                </p>
              </div>
              <div className="bg-white shadow p-6 rounded-lg">
                <h2 className="text-lg font-semibold">Active Orders</h2>
                <p className="text-3xl font-bold text-orange-500">5</p>
              </div>
              <div className="bg-white shadow p-6 rounded-lg">
                <h2 className="text-lg font-semibold">Earnings</h2>
                <p className="text-3xl font-bold text-orange-500">₹1,20,000</p>
              </div>
            </div>

            {/* Show a few vehicles as cards on overview */}
            <h2 className="text-xl font-bold mb-3">Your Vehicles</h2>
            {vehicles.length === 0 ? (
              <p>No vehicles found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {vehicles.map((v) => (
                  <div key={v._id} className="bg-white rounded shadow p-4">
                    {v.images && v.images[0] ? (
                      <img
                        src={v.images[0].url}
                        alt={v.model}
                        className="w-full h-40 object-cover rounded mb-2"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded mb-2">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold">
                      {v.brand} {v.model}
                    </h3>
                    <p className="text-gray-600">{v.description}</p>
                    <p className="font-medium mt-1">Price: ₹{v.price}</p>
                    <p className="text-sm text-gray-500">
                      Fuel: {v.fuelType} | Transmission: {v.transmission}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Vehicle */}
        {activeTab === "add" && <AddVehicle onVehicleAdded={fetchVehicles} />}

        {/* Manage Vehicles */}
        {activeTab === "manage" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Manage Vehicles</h2>
            {loading ? (
              <p>Loading...</p>
            ) : vehicles.length === 0 ? (
              <p>No vehicles found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicles.map((v) => (
                  <div key={v._id} className="bg-white p-4 rounded shadow">
                    {v.images && v.images[0] ? (
                      <img
                        src={v.images[0].url}
                        alt={v.model}
                        className="w-full h-40 object-cover rounded mb-2"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded mb-2">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold">
                      {v.brand} {v.model}
                    </h3>
                    <p>{v.description}</p>
                    <p className="font-medium mt-1">Price: ₹{v.price}</p>
                    <p className="text-sm text-gray-500">
                      Fuel: {v.fuelType} | Transmission: {v.transmission}
                    </p>
                    <button
                      onClick={() => handleDeleteVehicle(v._id)}
                      className="mt-2 w-full bg-red-500 text-white py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl font-bold">Orders</h2>
            <p>Orders functionality will be added here.</p>
          </div>
        )}

        {/* Profile */}
        {activeTab === "profile" && <Profile />}
      </main>
    </div>
  );
}

export default DealerDashboard;

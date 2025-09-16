import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "./Sidebar";
import Overview from "./Overview";
import ManageVehicles from "./ManageVehicles";
import Orders from "./Orders";
import Profile from "../../pages/Profile";
import AddVehicle from "./AddVehicle";

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
      setVehicles(res.data.data || []);
    } catch (err) {
      console.error("Fetch vehicles error:", err);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete vehicle
  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm("Are you sure to delete this vehicle?")) return;
    try {
      setLoading(true);
      const res = await axios.delete(
        `https://evbikesservermernproject-jenv.onrender.com/dealers/deleteVehicle/${vehicleId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || "Vehicle deleted successfully!");
      fetchVehicles();
    } catch (err) {
      console.error("Delete vehicle error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to delete vehicle");
    } finally {
      setLoading(false);
    }
  };

  // Fetch vehicles on mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto h-full">
        {activeTab === "overview" && <Overview vehicles={vehicles} />}
        {activeTab === "add" && <AddVehicle onVehicleAdded={fetchVehicles} />}
        {activeTab === "manage" && (
          <ManageVehicles
            vehicles={vehicles}
            loading={loading}
            onDelete={handleDeleteVehicle}
          />
        )}
        {activeTab === "orders" && <Orders />}
        {activeTab === "profile" && <Profile />}
      </main>
    </div>
  );
}

export default DealerDashboard;

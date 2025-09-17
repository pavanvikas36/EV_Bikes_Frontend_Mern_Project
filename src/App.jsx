import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import DealerDashboard from "./dealer/DealerDashboard";
import AllVehicles from "./buyer/AllVehicles"; // ✅ Buyer AllVehicles
import VehicleDetails from "./buyer/VehicleDetails"; // ✅ Buyer VehicleDetails

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Check login status on component mount and when loginStatusChanged event is fired
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      setIsLoggedIn(!!token);
      setUserRole(role);
    };

    // Check immediately
    checkAuthStatus();

    // Listen for login status changes
    window.addEventListener("loginStatusChanged", checkAuthStatus);

    // Cleanup
    return () => {
      window.removeEventListener("loginStatusChanged", checkAuthStatus);
    };
  }, []);

  return (
    <div className="font-sans">
      <Navbar isLoggedIn={isLoggedIn} userRole={userRole} />
      <Routes>
        {/* Default buyer home */}
        <Route path="/" element={<Hero />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />

        {/* Dealer Dashboard */}
        <Route path="/dealer/dashboard" element={<DealerDashboard />} />

        {/* Buyer Vehicles */}
        <Route path="/buyer/all-vehicles" element={<AllVehicles />} />
        <Route path="/buyer/vehicle/:vehicleId" element={<VehicleDetails />} /> {/* ✅ New Details Page */}
      </Routes>
    </div>
  );
}

export default App;

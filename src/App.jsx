import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./components/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import DealerDashboard from "./dealer/DealerDashboard";
import AllVehicles from "./buyer/AllVehicles";
import VehicleDetails from "./buyer/VehicleDetails";
import Wishlist from "./components/Wishlist";
import About from "./buyer/About"; // ✅ ADD THIS

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      setIsLoggedIn(!!token);
      setUserRole(role);
    };

    checkAuthStatus();
    window.addEventListener("loginStatusChanged", checkAuthStatus);

    return () => {
      window.removeEventListener("loginStatusChanged", checkAuthStatus);
    };
  }, []);

  return (
    <div className="font-sans">
      <Navbar isLoggedIn={isLoggedIn} userRole={userRole} />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />

        {/* Dealer */}
        <Route path="/dealer/dashboard" element={<DealerDashboard />} />

        {/* Buyer */}
        <Route path="/buyer/all-vehicles" element={<AllVehicles />} />
        <Route path="/buyer/vehicle/:vehicleId" element={<VehicleDetails />} />

        {/* Wishlist */}
        <Route path="/wishlist" element={<Wishlist />} />

        {/* ✅ About Page */}
        <Route path="/about" element={<About />} />

        {/* Contact (placeholder ok for now) */}
        <Route
          path="/contact"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <h1 className="text-3xl font-bold">Contact Page</h1>
            </div>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

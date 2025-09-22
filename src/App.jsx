import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import DealerDashboard from "./dealer/DealerDashboard";
import AllVehicles from "./buyer/AllVehicles";
import VehicleDetails from "./buyer/VehicleDetails";
import Wishlist from "./components/Wishlist"; // Import the Wishlist component

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
        <Route path="/buyer/vehicle/:vehicleId" element={<VehicleDetails />} />
        
        {/* Wishlist */}
        <Route path="/wishlist" element={<Wishlist />} />

        {/* Additional routes you might want to add */}
        <Route path="/ev-bikes" element={<AllVehicles category="EV Bikes" />} />
        <Route path="/scooties" element={<AllVehicles category="Scooties" />} />
        <Route path="/about" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl font-bold">About Page</h1></div>} />
        <Route path="/contact" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl font-bold">Contact Page</h1></div>} />
        
        {/* 404 Page */}
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl font-bold">404 - Page Not Found</h1></div>} />
      </Routes>
    </div>
  );
}

export default App;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Heart } from "lucide-react";
import logo from "../assets/ChatGPT Image Sep 13, 2025, 03_02_34 PM.png";

function Navbar({ isLoggedIn, userRole }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Notify app of auth change
    window.dispatchEvent(new Event("loginStatusChanged"));

    navigate("/login");
  };

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
      {/* Left: Logo + Name */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="RevVolt Logo" className="h-10 w-10" />
        <h1 className="text-2xl font-bold text-orange-500">RevVolt</h1>
      </div>

      {/* Center: Menu */}
      <ul className="flex gap-6 justify-center w-1/3">
        <li
          className="cursor-pointer hover:text-orange-400"
          onClick={() => navigate("/")}
        >
          Home
        </li>
        <li className="cursor-pointer hover:text-orange-400">EV Bikes</li>
        <li className="cursor-pointer hover:text-orange-400">Scooties</li>
        <li className="cursor-pointer hover:text-orange-400">About</li>
        <li className="cursor-pointer hover:text-orange-400">Contact</li>
      </ul>

      {/* Right: Search + Wishlist + User/Login */}
      <div className="flex gap-4 items-center relative">
        <input
          type="text"
          placeholder="Search..."
          className="px-2 py-1 rounded text-black"
        />

        {isLoggedIn ? (
          <>
            <Heart
              className="cursor-pointer hover:text-orange-400"
              onClick={() => navigate("/wishlist")}
            />

            <div className="relative">
              <User
                className="text-orange-500 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-10">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsDropdownOpen(false);
                    }}
                    className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  {userRole === "dealer" && (
                    <button
                      onClick={() => {
                        navigate("/dealer/dashboard");
                        setIsDropdownOpen(false);
                      }}
                      className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                    >
                      Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                    className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Login
          </button>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </nav>
  );
}

export default Navbar;

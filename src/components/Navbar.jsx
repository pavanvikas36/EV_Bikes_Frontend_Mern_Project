import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Heart, Menu, X } from "lucide-react";
import logo from "../assets/ChatGPT Image Sep 13, 2025, 02_54_50 PM.png";

function Navbar({ isLoggedIn, userRole }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Notify app of auth change
    window.dispatchEvent(new Event("loginStatusChanged"));

    navigate("/login");
  };

  // Buyer menu items
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "EV Bikes", path: "/ev-bikes" },
    { name: "Scooties", path: "/scooties" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
      {/* Left: Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer flex-1"
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="RevVolt Logo" className="h-12 w-auto md:h-16 lg:h-20" />
      </div>

      {/* Center: Menu (only for buyers) */}
      {userRole === "buyer" && (
        <ul className="hidden md:flex gap-6 justify-center flex-1">
          {menuItems.map((item, idx) => (
            <li
              key={idx}
              className="cursor-pointer hover:text-orange-400"
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}

      {/* Right: Search + Wishlist + User/Login */}
      <div className="flex gap-4 items-center justify-end flex-1 relative">
        {/* Search (hide on small screens) */}
        <input
          type="text"
          placeholder="Search..."
          className="hidden md:block px-2 py-1 rounded text-black"
        />

        {isLoggedIn ? (
          <>
            <Heart
              className="cursor-pointer hover:text-orange-400"
              onClick={() => navigate("/wishlist")}
            />

            {/* User dropdown */}
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

        {/* Mobile menu toggle */}
        {userRole === "buyer" && (
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && userRole === "buyer" && (
        <div className="absolute top-16 left-0 w-full bg-black text-white flex flex-col items-center gap-4 py-4 md:hidden z-20">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }}
              className="hover:text-orange-400"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}

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

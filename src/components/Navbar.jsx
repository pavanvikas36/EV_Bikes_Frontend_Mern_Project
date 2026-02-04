import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Menu,
  X,
  Search,
  LogOut,
  UserCog,
  LayoutDashboard,
} from "lucide-react";
import logo from "../assets/ChatGPT Image Sep 13, 2025, 02_54_50 PM.png";

function Navbar({ isLoggedIn, userRole }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  /* Close dropdown */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Scroll effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Logout */
  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("loginStatusChanged"));
    navigate("/login");
  };

  /* Search */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  /* Menu */
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "All Vehicles", path: "/buyer/all-vehicles" },
    { name: "Bikes", path: "/buyer/bikes" },       // ✅ ADDED
    { name: "Scooties", path: "/buyer/scooties" }, // ✅ FILTERED
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className={`bg-black text-white sticky top-0 z-50 px-4 py-3 ${scrolled && "shadow-md"}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <img
          src={logo}
          alt="RevVolt"
          onClick={() => navigate("/")}
          className="h-14 cursor-pointer"
        />

        {/* Desktop Menu (Buyer only) */}
        {userRole === "buyer" && (
          <ul className="hidden md:flex gap-6">
            {menuItems.map((item) => (
              <li
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`cursor-pointer border-b-2 ${
                  location.pathname === item.path
                    ? "border-orange-500 text-orange-500"
                    : "border-transparent text-gray-300 hover:text-white"
                }`}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search → ONLY buyer logged in */}
          {isLoggedIn && userRole === "buyer" && (
            <form onSubmit={handleSearch} className="hidden md:flex bg-gray-800 rounded">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vehicles..."
                className="bg-transparent px-3 py-1.5 text-white outline-none"
              />
              <button className="bg-orange-500 px-3">
                <Search size={18} />
              </button>
            </form>
          )}

          {/* User */}
          {isLoggedIn ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-gray-800 p-2 rounded-full"
              >
                <User />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded border border-gray-700">
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full px-4 py-3 hover:bg-orange-500 flex items-center gap-2"
                  >
                    <UserCog size={18} /> Profile
                  </button>

                  {userRole === "dealer" && (
                    <button
                      onClick={() => navigate("/dealer/dashboard")}
                      className="w-full px-4 py-3 hover:bg-orange-500 flex items-center gap-2"
                    >
                      <LayoutDashboard size={18} /> Dashboard
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 hover:bg-orange-500 flex items-center gap-2 border-t border-gray-700"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-orange-500 px-4 py-1.5 rounded"
            >
              Login
            </button>
          )}

          {/* Mobile Toggle */}
          {userRole === "buyer" && (
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && userRole === "buyer" && (
        <div className="md:hidden bg-gray-900 mt-3">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 hover:bg-gray-800"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;

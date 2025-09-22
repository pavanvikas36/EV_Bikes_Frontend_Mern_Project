import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Heart, Menu, X, Search, LogOut, UserCog, LayoutDashboard } from "lucide-react";
import logo from "../assets/ChatGPT Image Sep 13, 2025, 02_54_50 PM.png";

function Navbar({ isLoggedIn, userRole }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch wishlist count and listen for updates
  useEffect(() => {
    if (isLoggedIn && userRole === "buyer") {
      fetchWishlistCount();
      
      // Listen for wishlist update events
      const handleWishlistUpdate = () => {
        fetchWishlistCount();
      };
      
      window.addEventListener("wishlistUpdated", handleWishlistUpdate);
      return () => window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    }
  }, [isLoggedIn, userRole]);

  const fetchWishlistCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        "https://evbikesservermernproject-jenv.onrender.com/buyer/viewAllWishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setWishlistCount(data.wishlistItems?.length || 0);
      }
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("loginStatusChanged"));
    navigate("/login");
    setIsDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "All Vehicles", path: "/buyer/all-vehicles" },
    { name: "EV Bikes", path: "/ev-bikes" },
    { name: "Scooties", path: "/scooties" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className={`bg-black text-white px-4 md:px-6 py-3 shadow-md sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-opacity-95 backdrop-blur-sm' : ''}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer flex-shrink-0"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="RevVolt Logo"
            className="h-14 md:h-16 w-auto object-contain"
          />
        </div>

        {/* Desktop Menu */}
        {userRole === "buyer" && (
          <ul className="hidden md:flex gap-6 font-medium">
            {menuItems.map((item, idx) => (
              <li
                key={idx}
                className={`cursor-pointer py-1 transition-all duration-200 border-b-2 ${
                  location.pathname === item.path 
                    ? "text-orange-500 border-orange-500" 
                    : "text-gray-300 hover:text-white border-transparent"
                }`}
                onClick={() => navigate(item.path)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex items-center bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-orange-500"
          >
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 bg-transparent text-white w-40 focus:outline-none"
            />
            <button 
              type="submit"
              className="px-2 py-1.5 bg-orange-500 hover:bg-orange-600 text-white transition-colors"
            >
              <Search size={18} />
            </button>
          </form>

          {isLoggedIn ? (
            <div className="flex items-center gap-3 md:gap-4">
              {userRole === "buyer" && (
                <button 
                  onClick={() => navigate("/wishlist")}
                  className="p-1.5 rounded-full hover:bg-gray-800 transition-colors relative group"
                  aria-label="Wishlist"
                >
                  <Heart className="text-white group-hover:text-orange-500" size={22} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              )}

              {/* User dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-center p-1.5 rounded-full bg-gray-800 hover:bg-orange-500 transition-colors"
                  aria-label="User menu"
                >
                  <User size={22} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 text-white rounded-lg shadow-xl z-10 overflow-hidden border border-gray-700">
                    <div className="px-4 py-3 border-b border-gray-700 bg-black">
                      <p className="text-sm font-medium">Welcome!</p>
                      <p className="text-xs text-orange-400">{userRole === 'dealer' ? 'Dealer Account' : 'Buyer Account'}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-left hover:bg-orange-500 transition-colors"
                    >
                      <UserCog size={18} className="mr-2" />
                      Profile
                    </button>

                    {userRole === "dealer" && (
                      <button
                        onClick={() => {
                          navigate("/dealer/dashboard");
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-left hover:bg-orange-500 transition-colors"
                      >
                        <LayoutDashboard size={18} className="mr-2" />
                        Dashboard
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-left hover:bg-orange-500 transition-colors border-t border-gray-700"
                    >
                      <LogOut size={18} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-orange-500 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Login
            </button>
          )}

          {/* Mobile menu toggle */}
          {userRole === "buyer" && (
            <button
              className="md:hidden p-1.5 rounded hover:bg-gray-800 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && userRole === "buyer" && (
        <div className="md:hidden bg-gray-900 text-white flex flex-col items-stretch mt-2 border-t border-gray-700">
          {/* Mobile Search */}
          <form 
            onSubmit={handleSearch}
            className="flex p-3 border-b border-gray-700"
          >
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none"
            />
            <button 
              type="submit"
              className="px-3 py-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition-colors"
            >
              <Search size={18} />
            </button>
          </form>
          
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }}
              className={`px-4 py-3 text-left border-b border-gray-800 transition-colors ${
                location.pathname === item.path 
                  ? "bg-orange-500 text-white" 
                  : "hover:bg-gray-800"
              }`}
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
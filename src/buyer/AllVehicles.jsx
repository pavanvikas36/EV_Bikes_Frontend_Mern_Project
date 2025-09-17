import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Grid, List, Star, Heart, MapPin, ChevronDown, Loader } from "lucide-react";

function AllVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const navigate = useNavigate(); // Add this for navigation

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://evbikesservermernproject-jenv.onrender.com/buyer/viewAllVehicles",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Fetched vehicles:", res.data.data);
        setVehicles(res.data.data);
        setFilteredVehicles(res.data.data);
        
        // Initialize wishlist status
        const wishlistStatus = {};
        res.data.data.forEach(vehicle => {
          wishlistStatus[vehicle._id] = false;
        });
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching vehicles");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let results = [...vehicles];
    
    // Apply search filter
    if (searchQuery) {
      results = results.filter(vehicle => 
        vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply type filter
    if (selectedTypes.length > 0) {
      results = results.filter(vehicle => 
        selectedTypes.some(type => vehicle.model.toLowerCase().includes(type.toLowerCase()))
      );
    }
    
    // Apply price filter
    results = results.filter(vehicle => 
      vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1]
    );
    
    // Apply sorting
    switch(sortBy) {
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // Default sorting (featured)
        break;
    }
    
    setFilteredVehicles(results);
  }, [vehicles, searchQuery, sortBy, priceRange, selectedTypes]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(price);
  };

  // Function to handle view details click
  const handleViewDetails = (vehicleId) => {
    navigate(`/buyer/vehicle/${vehicleId}`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <Loader className="animate-spin mx-auto h-12 w-12 text-white" />
        <p className="mt-4 text-lg text-white">Loading vehicles...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="bg-white p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-semibold text-black">Error</h2>
          <p className="mt-2 text-black">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Explore Electric Vehicles</h1>
          <p className="mt-2 text-white">Discover our range of eco-friendly electric vehicles</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg border border-gray-300 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by model, brand, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-black"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full md:w-48 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white text-black"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4 pointer-events-none" />
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-gray-200 text-black" : "bg-white text-gray-600 border border-gray-300"}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${viewMode === "list" ? "bg-gray-200 text-black" : "bg-white text-gray-600 border border-gray-300"}`}
              >
                <List size={20} />
              </button>
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg"
            >
              <Filter size={20} />
              Filters
            </button>
          </div>

          {/* Filters Panel */}
          <div className={`mt-4 ${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-gray-300">
              {/* Price Range Filter */}
              <div>
                <h3 className="font-medium text-black mb-2">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-black">
                    <span>₹{formatPrice(priceRange[0])}</span>
                    <span>₹{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-black">
            Showing <span className="font-semibold">{filteredVehicles.length}</span> vehicles
          </p>
          {selectedTypes.length > 0 && (
            <button
              onClick={() => setSelectedTypes([])}
              className="text-sm text-black hover:text-gray-700 underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Vehicles Grid/List */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white border border-gray-300 rounded-lg p-8">
              <Search className="mx-auto h-12 w-12 text-gray-600" />
              <h3 className="mt-4 text-lg font-medium text-black">No vehicles found</h3>
              <p className="mt-2 text-black">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-4"}>
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className={`bg-white border border-gray-300 rounded-xl overflow-hidden hover:shadow-md transition-shadow ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                {/* Vehicle Image */}
                <div className={`relative ${viewMode === "list" ? "w-1/3" : "w-full"}`}>
                    <div className={`${viewMode === "list" ? "h-full" : "h-48"} flex items-center justify-center bg-gray-100 ${viewMode === "list" ? "rounded-l-xl" : "rounded-t-xl"} overflow-hidden`}>
                        {vehicle.images && vehicle.images.length > 0 ? (
                        <img
                            src={vehicle.images[0].url}
                            alt={vehicle.model}
                            className="w-full h-full object-contain p-2"
                        />
                        ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-black">No Image Available</span>
                        </div>
                        )}
                    </div>
                </div>

                {/* Vehicle Details */}
                <div className={`p-4 ${viewMode === "list" ? "w-2/3" : ""}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-black">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                    </div>
                    <div className="flex items-center">
                      <Star size={16} className="text-black" />
                      <span className="ml-1 text-sm font-medium text-black">4.5</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-300 flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-black">₹{formatPrice(vehicle.price)}</p>
                      <p className="text-sm text-black">ex-showroom</p>
                    </div>
                    <button 
                      onClick={() => handleViewDetails(vehicle._id)}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllVehicles;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2, ArrowLeft, ShoppingCart } from "lucide-react";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "https://evbikesservermernproject-jenv.onrender.com/buyer/viewAllWishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      const data = await response.json();
      setWishlistItems(data.wishlistItems || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (wishlistId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://evbikesservermernproject-jenv.onrender.com/buyer/deleteWishlist/${wishlistId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item from wishlist");
      }

      // Remove item from local state
      setWishlistItems(wishlistItems.filter(item => item._id !== wishlistId));
      
      // Dispatch event to update navbar count
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddToCart = (vehicle) => {
    // Implement add to cart functionality
    console.log("Add to cart:", vehicle);
    // You would typically make an API call here to add to cart
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <span className="text-gray-600">
            {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Start adding items you love to your wishlist
            </p>
            <button
              onClick={() => navigate("/buyer/all-vehicles")}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Browse Vehicles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Vehicle Image */}
                <div className="relative">
                  <img
                    src={item.vehicleId?.images?.[0] || "/placeholder-vehicle.jpg"}
                    alt={item.vehicleId?.modelName}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleRemoveFromWishlist(item._id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={20} className="text-red-500" />
                  </button>
                </div>

                {/* Vehicle Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.vehicleId?.modelName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {item.vehicleId?.brand}
                  </p>
                  <p className="text-2xl font-bold text-orange-500 mb-4">
                    ₹{item.vehicleId?.price?.toLocaleString()}
                  </p>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleAddToCart(item.vehicleId)}
                      className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => navigate(`/vehicle/${item.vehicleId?._id}`)}
                      className="text-orange-500 hover:text-orange-600 font-medium"
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
};

export default Wishlist;
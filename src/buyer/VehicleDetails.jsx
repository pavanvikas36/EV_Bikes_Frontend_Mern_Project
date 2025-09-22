import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Star, Heart, MapPin, ArrowLeft, Loader, X, Bookmark } from "lucide-react";

function VehicleDetails() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImg, setCurrentImg] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);

  const API_BASE_URL = "https://evbikesservermernproject-jenv.onrender.com";

  useEffect(() => {
    const fetchVehicleAndWishlist = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        // Fetch vehicle details
        const vehicleRes = await axios.get(
          `${API_BASE_URL}/buyer/viewVehicles/${vehicleId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setVehicle(vehicleRes.data.data);

        // Check wishlist status
        try {
          const wishlistRes = await axios.get(
            `${API_BASE_URL}/buyer/viewAllWishlist`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const foundItem = wishlistRes.data.data.find(
            (item) => item.vehicleId === vehicleId
          );
          setIsWishlist(!!foundItem);
        } catch (wishlistError) {
          console.warn("Could not fetch wishlist:", wishlistError);
          setIsWishlist(false);
        }
      } catch (err) {
        console.error("Vehicle fetch error:", err);
        setError(err.response?.data?.message || "Failed to load vehicle details");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleAndWishlist();
  }, [vehicleId]);

  const toggleWishlist = async () => {
    try {
      setWishlistLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to manage wishlist");
        return;
      }

      if (isWishlist) {
        // Remove from wishlist using vehicleId
        await axios.delete(
          `${API_BASE_URL}/buyer/removeFromWishlist/${vehicleId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsWishlist(false);
      } else {
        // Add to wishlist
        await axios.post(
          `${API_BASE_URL}/buyer/addToWishlist/${vehicleId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsWishlist(true);
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      alert(err.response?.data?.message || "Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleBookVehicle = () => {
    // Implement booking functionality
    alert("Booking functionality to be implemented");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="animate-spin mx-auto h-12 w-12 text-blue-600" />
          <p className="mt-4 text-lg text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/buyer/all-vehicles")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Vehicles
          </button>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Vehicle not found</p>
        </div>
      </div>
    );
  }

  const images = Array.isArray(vehicle.images) ? vehicle.images : [];
  const totalImages = images.length;

  const goPrev = () => setCurrentImg((prev) => (prev - 1 + totalImages) % totalImages);
  const goNext = () => setCurrentImg((prev) => (prev + 1) % totalImages);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Vehicle Details</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {totalImages > 0 ? (
              <>
                <div className="relative h-80 bg-gray-50 rounded-lg overflow-hidden mb-4">
                  <img
                    src={images[currentImg]?.url || "/placeholder-image.jpg"}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/600x400?text=No+Image";
                    }}
                  />

                  {/* Wishlist Button */}
                  <button
                    onClick={toggleWishlist}
                    disabled={wishlistLoading}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                    title={isWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {wishlistLoading ? (
                      <Loader className="animate-spin h-5 w-5 text-blue-600" />
                    ) : (
                      <Heart
                        size={20}
                        className={isWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}
                      />
                    )}
                  </button>

                  {/* Navigation Arrows */}
                  {totalImages > 1 && (
                    <>
                      <button
                        onClick={goPrev}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                      >
                        ←
                      </button>
                      <button
                        onClick={goNext}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                      >
                        →
                      </button>
                    </>
                  )}
                </div>

                {/* Image Counter */}
                {totalImages > 1 && (
                  <div className="text-center text-sm text-gray-600 mb-4">
                    Image {currentImg + 1} of {totalImages}
                  </div>
                )}

                {/* Thumbnails */}
                {totalImages > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImg(index)}
                        className={`flex-shrink-0 w-16 h-16 border-2 rounded-lg overflow-hidden transition-all ${
                          currentImg === index
                            ? "border-blue-500 shadow-md"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/80x80?text=Error";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <span className="text-gray-500">No Images Available</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleBookVehicle}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Bookmark size={20} />
                Book This Vehicle
              </button>
              
              <button
                onClick={() => setShowContactPopup(true)}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Contact Dealer
              </button>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {vehicle.brand} {vehicle.model}
              </h1>
              <div className="flex items-center text-gray-600">
                <MapPin size={16} className="mr-1" />
                <span>Available for purchase</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-4xl font-bold text-green-600">
                ₹{formatPrice(vehicle.price)}
              </p>
              <p className="text-sm text-gray-600">Ex-showroom price</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {vehicle.description || "No description available for this vehicle."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Vehicle Type</p>
                <p className="font-medium text-gray-900">{vehicle.type || "E-Bike"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Fuel Type</p>
                <p className="font-medium text-gray-900">{vehicle.fuelType || "Electric"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Transmission</p>
                <p className="font-medium text-gray-900">{vehicle.transmission || "Automatic"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Range</p>
                <p className="font-medium text-gray-900">{vehicle.range || "80 km/charge"}</p>
              </div>
            </div>

            {/* Additional Specifications */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Key Features</h3>
              <ul className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                <li>• Eco-friendly electric vehicle</li>
                <li>• Low maintenance costs</li>
                <li>• Fast charging capability</li>
                <li>• Smart connectivity features</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Contact Dealer Popup */}
      {showContactPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Contact Dealer</h3>
              <button
                onClick={() => setShowContactPopup(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Dealer Name</p>
                <p className="text-lg font-medium text-gray-900">
                  {vehicle.dealerName || "EV Motors"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Dealer Email</p>
                <p className="text-lg font-medium text-gray-900">
                  {vehicle.dealerEmail || "contact@evmotors.com"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Dealer Phone</p>
                <p className="text-lg font-medium text-gray-900">
                  {vehicle.dealerPhone || "+91 XXXXX XXXXX"}
                </p>
              </div>

              <div className="pt-2">
                <p className="text-sm text-gray-500">
                  You can contact the dealer directly using the information above for test drives and purchase inquiries.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowContactPopup(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Implement contact action
                  alert("Contact functionality to be implemented");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VehicleDetails;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Star, MapPin, ArrowLeft, Loader, X, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react";

function VehicleDetails() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImg, setCurrentImg] = useState(0);
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

        const vehicleRes = await axios.get(
          `${API_BASE_URL}/buyer/viewVehicles/${vehicleId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setVehicle(vehicleRes.data.data);
      } catch (err) {
        console.error("Vehicle fetch error:", err);
        setError(err.response?.data?.message || "Failed to load vehicle details");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleAndWishlist();
  }, [vehicleId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader className="animate-spin mx-auto h-12 w-12 text-orange-500" />
          <p className="mt-4 text-lg text-white">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center bg-white p-8 rounded-lg max-w-md border border-gray-300">
          <h2 className="text-xl font-semibold text-black mb-2">Error</h2>
          <p className="text-black mb-4">{error}</p>
          <button
            onClick={() => navigate("/buyer/all-vehicles")}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Vehicles
          </button>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-lg text-white">Vehicle not found</p>
        </div>
      </div>
    );
  }

  const images = Array.isArray(vehicle.images) ? vehicle.images : [];
  const totalImages = images.length;

  const goPrev = () => setCurrentImg((prev) => (prev - 1 + totalImages) % totalImages);
  const goNext = () => setCurrentImg((prev) => (prev + 1) % totalImages);

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Matching AllVehicles header */}
      <div className="bg-black shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-white hover:text-orange-500 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Vehicles
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">Vehicle Details</h1>
              <p className="mt-2 text-white">Complete specifications and dealer information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="bg-white rounded-lg border border-gray-300 p-6">
            {totalImages > 0 ? (
              <>
                <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={images[currentImg]?.url || "/placeholder-image.jpg"}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/600x400/000000/FFFFFF?text=No+Image";
                    }}
                  />

                  {/* Navigation Arrows */}
                  {totalImages > 1 && (
                    <>
                      <button
                        onClick={goPrev}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black text-white rounded-full shadow-lg hover:bg-orange-500 transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={goNext}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black text-white rounded-full shadow-lg hover:bg-orange-500 transition-colors"
                      >
                        <ChevronRight size={20} />
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
                            ? "border-orange-500 shadow-md"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/80x80/000000/FFFFFF?text=Error";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="h-80 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                <span className="text-gray-500">No Images Available</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={() => setShowContactPopup(true)}
                className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-orange-500 transition-colors font-medium shadow-lg"
              >
                Contact Dealer
              </button>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="bg-white rounded-lg border border-gray-300 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-black mb-2">
                {vehicle.brand} {vehicle.model}
              </h1>
              <div className="flex items-center text-gray-600">
                <MapPin size={18} className="mr-2" />
                <span>Available for purchase</span>
              </div>
            </div>

            {/* Price Section - Matching AllVehicles style */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-4xl font-bold text-black">
                ₹{formatPrice(vehicle.price)}
              </p>
              <p className="text-sm text-gray-600">Ex-showroom price</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-black mb-3 text-lg">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {vehicle.description || "No description available for this vehicle."}
              </p>
            </div>

            {/* Specifications Grid - Matching AllVehicles card style */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Vehicle Type</p>
                <p className="font-semibold text-black">{vehicle.type || "E-Bike"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Fuel Type</p>
                <p className="font-semibold text-black">{vehicle.fuelType || "Electric"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Transmission</p>
                <p className="font-semibold text-black">{vehicle.transmission || "Automatic"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Range</p>
                <p className="font-semibold text-black">{vehicle.range || "80 km/charge"}</p>
              </div>
            </div>

            {/* Additional Specifications */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-black mb-3 text-lg">Key Features</h3>
              <ul className="grid grid-cols-1 gap-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Eco-friendly electric vehicle
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Low maintenance costs
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Fast charging capability
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Smart connectivity features
                </li>
              </ul>
            </div>

            {/* Rating Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center">
                <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                  <Star size={16} className="text-orange-500 fill-current" />
                  <span className="ml-1 text-sm font-semibold text-black">4.5</span>
                </div>
                <span className="ml-2 text-sm text-gray-600">Customer Rating</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Contact Dealer Popup */}
      {showContactPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 border border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-black">Contact Dealer</h3>
              <button
                onClick={() => setShowContactPopup(false)}
                className="text-gray-500 hover:text-black transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Dealer Name</p>
                <p className="text-lg font-semibold text-black">
                  {vehicle.dealerName || "EV Motors"}
                </p>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                <Mail className="text-orange-500" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Dealer Email</p>
                  <p className="font-medium text-black">
                    {vehicle.dealerEmail || "contact@evmotors.com"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                <Phone className="text-orange-500" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Dealer Phone</p>
                  <p className="font-medium text-black">
                    {vehicle.dealerPhone || "+91 XXXXX XXXXX"}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  Contact the dealer directly using the information above for test drives and purchase inquiries.
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
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-orange-500 transition-colors"
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
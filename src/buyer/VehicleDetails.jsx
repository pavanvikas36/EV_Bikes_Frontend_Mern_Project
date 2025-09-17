import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Star, Heart, MapPin, ArrowLeft, Loader } from "lucide-react";

function VehicleDetails() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImg, setCurrentImg] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://evbikesservermernproject-jenv.onrender.com/buyer/viewVehicles/${vehicleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setVehicle(res.data.data);
        setCurrentImg(0);
      } catch (err) {
        console.error("Vehicle fetch error:", err.response || err.message);
        setError(err.response?.data?.message || "Failed to load vehicle");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  const toggleWishlist = () => {
    setIsWishlist(!isWishlist);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <Loader className="animate-spin mx-auto h-12 w-12 text-white" />
        <p className="mt-4 text-lg text-white">Loading vehicle details...</p>
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
            onClick={() => navigate("/buyer/all-vehicles")} 
            className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Back to Vehicles
          </button>
        </div>
      </div>
    </div>
  );

  if (!vehicle) return null;

  const images = Array.isArray(vehicle.images) ? vehicle.images : [];
  const total = images.length;

  const goPrev = () => setCurrentImg((i) => (i - 1 + total) % total);
  const goNext = () => setCurrentImg((i) => (i + 1) % total);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-white hover:text-gray-300 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-white">Vehicle Details</h1>
          <p className="mt-2 text-white">Explore all specifications and features</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="bg-white rounded-xl border border-gray-300 p-6">
            {total > 0 ? (
              <>
                <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                  <img
                    src={images[currentImg].url}
                    alt={vehicle.model}
                    className="object-contain w-full h-full p-4"
                  />
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={toggleWishlist}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    <Heart 
                      size={20} 
                      className={isWishlist ? "fill-black text-black" : "text-black"} 
                    />
                  </button>
                  
                  {/* Navigation Arrows */}
                  {total > 1 && (
                    <>
                      <button
                        onClick={goPrev}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full border border-gray-300 hover:bg-gray-100"
                      >
                        ←
                      </button>
                      <button
                        onClick={goNext}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full border border-gray-300 hover:bg-gray-100"
                      >
                        →
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {total > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImg(index)}
                        className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${
                          currentImg === index ? "border-black" : "border-gray-300"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="h-96 flex items-center justify-center bg-gray-100 rounded-xl">
                <span className="text-gray-500">No Images Available</span>
              </div>
            )}
          </div>

          {/* Vehicle Details */}
          <div className="bg-white rounded-xl border border-gray-300 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-black">
                  {vehicle.brand} {vehicle.model}
                </h1>
                <p className="text-sm text-black mt-1 flex items-center">
                  <MapPin size={14} className="mr-1" />
                  {vehicle.location || "Available nationwide"}
                </p>
              </div>
              <div className="flex items-center">
                <Star size={16} className="text-black fill-current" />
                <span className="ml-1 text-sm font-medium text-black">4.5</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-3xl font-bold text-black">₹{formatPrice(vehicle.price)}</p>
              <p className="text-sm text-black">ex-showroom</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-black mb-2">Description</h3>
              <p className="text-black">{vehicle.description || "No description available."}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-black">Type</p>
                <p className="font-medium text-black">{vehicle.type || "E-Bike"}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-black">Fuel Type</p>
                <p className="font-medium text-black">{vehicle.fuelType || "Electric"}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-black">Transmission</p>
                <p className="font-medium text-black">{vehicle.transmission || "Automatic"}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-black">Range</p>
                <p className="font-medium text-black">{vehicle.range || "80 km"}</p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="border-t border-gray-300 pt-4">
              <h3 className="font-semibold text-black mb-2">Additional Information</h3>
              <div className="text-sm text-black space-y-1">
                {vehicle.createdAt && (
                  <p>
                    <span className="font-medium">Uploaded:</span>{" "}
                    {new Date(vehicle.createdAt).toLocaleDateString()}
                  </p>
                )}
                {vehicle.dealerId && (
                  <p>
                    <span className="font-medium">Dealer ID:</span> {vehicle.dealerId}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate("/buyer/all-vehicles")}
                className="flex-1 px-6 py-3 border border-black text-black rounded-lg hover:bg-gray-100 transition-colors"
              >
                Back to Vehicles
              </button>
              <button
                onClick={() => alert("Contact dealer functionality would go here")}
                className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Contact Dealer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetails;
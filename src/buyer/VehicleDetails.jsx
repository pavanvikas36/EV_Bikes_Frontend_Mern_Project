import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Loader,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
  Phone,
  Mail,
} from "lucide-react";

function VehicleDetails() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [showContactPopup, setShowContactPopup] = useState(false);

  const API_BASE_URL = "https://evbikesservermernproject-jenv.onrender.com";

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/buyer/viewVehicles/${vehicleId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVehicle(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [vehicleId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader className="animate-spin h-10 w-10 text-orange-500" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Vehicle not found
      </div>
    );
  }

  const images = vehicle.images || [];
  const totalImages = images.length;

  const goPrev = () =>
    setCurrentImg((p) => (p - 1 + totalImages) % totalImages);
  const goNext = () =>
    setCurrentImg((p) => (p + 1) % totalImages);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-black text-white py-5">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center hover:text-orange-500"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </button>
          <h1 className="text-xl font-semibold">Vehicle Details</h1>
        </div>
      </div>

      {/* IMAGE SECTION (TOP) */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="relative h-[420px] bg-white rounded-2xl shadow overflow-hidden">
          <img
            src={images[currentImg]?.url}
            alt="Vehicle"
            className="w-full h-full object-contain"
          />

          {totalImages > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black text-white p-2 rounded-full"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black text-white p-2 rounded-full"
              >
                <ChevronRight />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {totalImages > 1 && (
          <div className="flex gap-3 mt-4 overflow-x-auto">
            {images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                onClick={() => setCurrentImg(i)}
                className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                  currentImg === i
                    ? "border-orange-500"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* DETAILS SECTION */}
      <div className="max-w-7xl mx-auto px-6 mt-10 grid lg:grid-cols-2 gap-8">

        {/* LEFT SIDE */}
        <div className="space-y-6">
          {/* Name + Price */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-3xl font-bold">
              {vehicle.brand} {vehicle.model}
            </h2>

            <p className="text-gray-500 mt-1 flex items-center">
              <MapPin size={16} className="mr-1" />
              Available in India
            </p>

            <p className="text-4xl font-bold text-orange-500 mt-4">
              ₹{vehicle.price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Ex-showroom price</p>

            <button
              onClick={() => setShowContactPopup(true)}
              className="mt-6 w-full bg-black text-white py-3 rounded-lg hover:bg-orange-500 transition"
            >
              Contact Dealer
            </button>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <Spec label="Fuel Type" value={vehicle.fuelType || "Electric"} />
              <Spec label="Transmission" value={vehicle.transmission || "Automatic"} />
              <Spec label="Range" value={vehicle.range || "80 km/charge"} />
              <Spec label="Vehicle Type" value={vehicle.type || "E-Bike"} />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* Description */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {vehicle.description || "No description available."}
            </p>
          </div>

          {/* Why Buy */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-3">Why Buy This EV?</h3>
            <ul className="space-y-2 text-gray-600">
              <li>⚡ Zero emission & eco-friendly</li>
              <li>💰 Low running and maintenance cost</li>
              <li>🔋 Efficient battery performance</li>
              <li>📱 Smart EV technology</li>
            </ul>
          </div>

          {/* Ideal For */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-3">Ideal For</h3>
            <p className="text-gray-600">
              Daily commuters, city riders, and eco-conscious users looking for a
              cost-effective alternative to petrol vehicles.
            </p>
          </div>
        </div>
      </div>

      {/* CONTACT POPUP */}
      {showContactPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowContactPopup(false)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <h3 className="text-xl font-bold mb-4">Contact Dealer</h3>

            <ContactRow
              icon={<Mail className="text-orange-500" />}
              label="Email"
              value={vehicle.dealerEmail || "contact@dealer.com"}
            />
            <ContactRow
              icon={<Phone className="text-orange-500" />}
              label="Phone"
              value={vehicle.dealerPhone || "+91 9876543210"}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Helper Components ---------- */

const Spec = ({ label, value }) => (
  <div className="bg-gray-100 rounded-lg p-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

const ContactRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 border p-3 rounded-lg mb-3">
    {icon}
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default VehicleDetails;

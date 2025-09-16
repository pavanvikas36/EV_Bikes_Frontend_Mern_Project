import { useState, useEffect } from "react";
import axios from "axios";

function Hero() {
  const name = localStorage.getItem("name"); // 👈 fetch stored user name
  const role = localStorage.getItem("role"); // check if buyer
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(
          "https://evbikesservermernproject-jenv.onrender.com/buyer/viewAllVehicles"
        );
        setVehicles(res.data.data || []); // API returns { message, data: [] }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    if (role === "buyer") {
      fetchVehicles();
    }
  }, [role]);

  return (
    <section className="bg-black text-white text-center py-16 px-4">
      {role === "buyer" && name ? (
        <>
          <h2 className="text-4xl font-bold">
            Welcome, {name}! <span className="text-orange-500">⚡</span>
          </h2>
          <p className="mt-2 text-lg text-gray-300">
            Find your perfect EV ride and enjoy an eco-friendly journey.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-4xl font-bold">
            Find Your Perfect EV Ride <span className="text-orange-500">⚡</span>
          </h2>
          <p className="mt-2 text-lg text-gray-300">
            Compare, Choose & Ride Eco-Friendly.
          </p>
        </>
      )}

      <button className="mt-6 px-6 py-3 bg-orange-500 rounded-lg text-lg font-semibold hover:bg-orange-600">
        Explore Vehicles
      </button>

      {/* 🚘 Vehicle Cards Section */}
      {role === "buyer" && (
        <div className="mt-12">
          {loading ? (
            <p className="text-gray-400">Loading vehicles...</p>
          ) : vehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              {vehicles.map((v) => (
                <div
                  key={v._id}
                  className="bg-white text-black rounded-lg shadow-lg p-4 hover:shadow-xl transition"
                >
                  {v.images && v.images.length > 0 && (
                    <img
                      src={v.images[0]}
                      alt={v.model}
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                  )}
                  <h3 className="text-xl font-semibold text-orange-600">
                    {v.brand} {v.model}
                  </h3>
                  <p className="text-gray-700">₹{v.price}</p>
                  <p className="text-sm text-gray-500 mt-1">{v.fuelType}</p>
                  <p className="text-sm text-gray-500">
                    {v.transmission} Transmission
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mt-4">No vehicles found.</p>
          )}
        </div>
      )}
    </section>
  );
}

export default Hero;

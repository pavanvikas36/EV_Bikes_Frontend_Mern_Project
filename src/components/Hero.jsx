import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  const name = localStorage.getItem("name"); 
  const role = localStorage.getItem("role"); 
  const token = localStorage.getItem("token");

  // 🔥 Explore button logic
  const handleExploreVehicles = () => {
    if (token && role === "buyer") {
      navigate("/buyer/all-vehicles"); // Logged-in buyer → All vehicles
    } else {
      navigate("/login"); // Not logged in → Login page
    }
  };

  return (
    <section className="bg-black text-white py-16 px-4">
      <div className="text-center max-w-3xl mx-auto">
        {role === "buyer" && name ? (
          <>
            <h2 className="text-4xl font-bold">
              Welcome, {name}
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Find your perfect EV ride and enjoy an eco-friendly journey.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-4xl font-bold">
              Find Your Perfect EV Ride <span className="text-white">⚡</span>
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Compare, Choose & Ride Eco-Friendly.
            </p>
          </>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          {/* Explore Vehicles */}
          <button
            onClick={handleExploreVehicles}
            className="px-8 py-3 bg-white text-black rounded-lg text-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Explore Vehicles
          </button>

          {/* Learn More */}
          <button
            onClick={() => navigate("/about")}
            className="px-8 py-3 border border-white text-white rounded-lg text-lg font-semibold hover:bg-white hover:text-black transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;

function Hero() {
  const name = localStorage.getItem("name"); // 👈 fetch stored user name
  const role = localStorage.getItem("role"); // check if buyer

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
    </section>
  );
}

export default Hero;

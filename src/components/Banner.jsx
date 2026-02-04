import { useEffect, useState } from "react";

function Banner() {
  const images = [
    "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2",
    "https://images.unsplash.com/photo-1617886322168-72b886573c35",
    "https://images.unsplash.com/photo-1593941707882-a5bba14938c7",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">

        {/* Text Section */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            India’s Trusted EV Marketplace
          </h2>

          <p className="text-lg md:text-xl max-w-xl mb-6 text-white/90">
            RevVolt connects buyers and dealers on one powerful platform,
            helping you discover, compare, and choose electric vehicles
            with complete transparency and confidence.
          </p>

          {/* Feature Points */}
          <ul className="space-y-3 text-white/95">
            <li>⚡ Wide range of electric bikes & scooters</li>
            <li>⚡ Verified dealers across India</li>
            <li>⚡ Transparent pricing & specifications</li>
            <li>⚡ Eco-friendly and future-ready mobility</li>
          </ul>

          {/* Stats */}
          <div className="mt-8 flex gap-8">
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm text-white/80">EV Models</p>
            </div>
            <div>
              <p className="text-3xl font-bold">300+</p>
              <p className="text-sm text-white/80">Trusted Dealers</p>
            </div>
            <div>
              <p className="text-3xl font-bold">10k+</p>
              <p className="text-sm text-white/80">Happy Users</p>
            </div>
          </div>
        </div>

        {/* Auto Sliding Image */}
        <div className="relative w-full h-80 md:h-[420px] flex justify-center items-center">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Electric Vehicle"
              className={`absolute 
                w-80 h-80 
                md:w-[520px] md:h-[420px]
                object-cover rounded-3xl shadow-2xl
                transition-opacity duration-1000
                ${index === currentIndex ? "opacity-100" : "opacity-0"}
              `}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default Banner;

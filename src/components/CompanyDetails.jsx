import { useEffect, useState } from "react";

function CompanyDetails() {
  const images = [
    // NEW working image (replaced first one)
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
  ];

  const fallbackImage =
    "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80";

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT – Why Choose Us */}
        <div className="bg-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
          <h3 className="text-2xl font-semibold mb-4 text-black">
            Why Choose Us?
          </h3>

          <p className="text-gray-700 mb-6 leading-relaxed">
            RevVolt focuses on trust, transparency, and modern technology to
            simplify electric vehicle discovery and buying across India.
          </p>

          {/* Carousel */}
          <div className="relative w-full h-64 rounded-xl overflow-hidden">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Why Choose RevVolt"
                onError={(e) => (e.target.src = fallbackImage)}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full ${
                    index === currentIndex
                      ? "bg-orange-500"
                      : "bg-white/70"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT – About RevVolt */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            About RevVolt
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            RevVolt is a next-generation electric vehicle platform connecting
            buyers and dealers across India. Our mission is to accelerate
            eco-friendly transportation by making EV discovery simple,
            transparent, and accessible.
          </p>

          <ul className="space-y-3 text-gray-800">
            <li>⚡ Verified EV Dealers</li>
            <li>⚡ Secure Buyer Platform</li>
            <li>⚡ Pan-India Availability</li>
            <li>⚡ Trusted by Thousands</li>
          </ul>
        </div>

      </div>
    </section>
  );
}

export default CompanyDetails;

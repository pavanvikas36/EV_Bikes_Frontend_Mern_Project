import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  /* Images for carousels */
  const aboutImages = [
    "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1617886322168-72b886573c35?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80",
  ];

  const missionImages = [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1581091215367-59ab6b63c3c4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
  ];

  const [aboutIndex, setAboutIndex] = useState(0);
  const [missionIndex, setMissionIndex] = useState(0);

  /* Auto slide */
  useEffect(() => {
    const aboutTimer = setInterval(
      () => setAboutIndex((prev) => (prev + 1) % aboutImages.length),
      3000
    );
    const missionTimer = setInterval(
      () => setMissionIndex((prev) => (prev + 1) % missionImages.length),
      3500
    );

    return () => {
      clearInterval(aboutTimer);
      clearInterval(missionTimer);
    };
  }, []);

  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <section className="bg-black text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About RevVolt
          </h1>
          <p className="text-lg text-gray-300">
            Driving India towards a smarter, cleaner, and electric future.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Who We Are
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              RevVolt is a next-generation electric vehicle marketplace that
              connects buyers with verified dealers across India. We simplify
              EV discovery by providing transparent pricing, detailed
              specifications, and a secure buying experience.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our platform is built using modern web technologies to ensure
              performance, security, and scalability.
            </p>
          </div>

          {/* About Carousel */}
          <div className="relative w-full h-72 rounded-2xl overflow-hidden shadow-xl">
            {aboutImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="About RevVolt"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === aboutIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* Mission & Vision */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-semibold mb-4">
              Our Mission
            </h3>
            <p className="text-gray-700 mb-6">
              To accelerate the adoption of electric vehicles by making EV
              discovery simple, transparent, and accessible for everyone.
            </p>

            <h3 className="text-2xl font-semibold mb-4">
              Our Vision
            </h3>
            <p className="text-gray-700">
              To become India’s most trusted digital platform for electric
              mobility and sustainable transportation.
            </p>
          </div>

          {/* Mission Carousel */}
          <div className="relative w-full h-72 rounded-2xl overflow-hidden shadow-xl">
            {missionImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="RevVolt Mission"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === missionIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Core Values
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Transparency</h3>
              <p className="text-gray-600">
                Honest pricing and verified dealer ecosystem.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                Scalable, secure, and modern EV technology solutions.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
              <p className="text-gray-600">
                Enabling a greener and cleaner transportation future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-black text-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join the Electric Revolution
          </h2>
          <p className="text-gray-300 mb-6">
            Explore electric vehicles and be part of India’s sustainable journey.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}

export default About;

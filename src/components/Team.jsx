const team = [
  {
    name: "Pavan Nayak",
    role: "CEO & Founder",
    desc: "Founder of RevVolt, leading the vision to accelerate EV adoption across India.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Sneha Patel",
    role: "CTO",
    desc: "Leads platform architecture, performance, and security.",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Rahul Verma",
    role: "Head of Operations",
    desc: "Manages dealer onboarding, logistics, and platform operations.",
    image: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=400&q=80",
  },
];

function Team() {
  return (
    <section className="bg-black text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Meet Our Leadership
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              {/* Profile Image */}
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-orange-500 mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=400&q=80";
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-orange-400 font-medium">{member.role}</p>
              <p className="text-gray-400 mt-3 text-sm leading-relaxed">
                {member.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Team;

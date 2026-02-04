import { Linkedin, Twitter, Instagram, Github, Mail, Phone, MapPin } from "lucide-react";
import logo from "../assets/ChatGPT Image Sep 13, 2025, 02_54_50 PM.png"; // your logo

function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={logo}
              alt="RevVolt Logo"
              className="h-16 w-auto object-contain"
            />
            {/* <h3 className="text-xl font-bold text-white">RevVolt</h3> */}
          </div>
          <p className="leading-relaxed">
            Your trusted electric vehicle marketplace, connecting buyers
            and verified dealers across India.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-5">
            <a href="#" className="hover:text-orange-500 transition">
              <Linkedin size={20} />
            </a>
            <a href="#" className="hover:text-orange-500 transition">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-orange-500 transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-orange-500 transition">
              <Github size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li className="hover:text-white cursor-pointer">About</li>
            <li className="hover:text-white cursor-pointer">All Vehicles</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
            <li className="hover:text-white cursor-pointer">Login</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>

          <div className="flex items-center gap-3 mb-2">
            <Mail size={18} />
            <span>support@revvolt.in</span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <Phone size={18} />
            <span>+91 98765 43210</span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin size={18} />
            <span>Hyderabad, India</span>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center mt-10 text-sm border-t border-gray-800 pt-4">
        © {new Date().getFullYear()} RevVolt. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;

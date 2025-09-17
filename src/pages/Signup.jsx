import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "buyer", // default role
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      await axios.post(
        "https://evbikesservermernproject-jenv.onrender.com/auth/signup",
        form
      );

      alert("✅ Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setErrorMessage(
        err.response?.data?.message || "❌ Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4 py-8">
      <div className="bg-black p-8 rounded-xl shadow-2xl w-full max-w-md border border-orange-500/50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-orange-500/10 rounded-full"></div>
        <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-orange-500/5 rounded-full"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-orange-500 mb-2">
              Create Account
            </h2>
            <p className="text-white/70">Join us to get started</p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Account Type
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              >
                <option value="buyer" className="bg-gray-900">Buyer</option>
                <option value="dealer" className="bg-gray-900">Dealer</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-black py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-orange-500 hover:text-orange-400 transition"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
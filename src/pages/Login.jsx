import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Login() {
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { email, password, role } = loginDetails;

    if (!email || !password || !role) {
      setErrorMessage("⚠️ All fields are required!");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(""); // clear old error

      const res = await axios.post(
        "https://evbikesservermernproject-jenv.onrender.com/auth/login",
        { email, password, role }
      );

      if (res.data?.token && res.data.user) {
        const user = res.data.user;

        // Save user details + token in localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("id", user._id);
        localStorage.setItem("name", user.name);
        localStorage.setItem("username", user.username);
        localStorage.setItem("email", user.email);
        localStorage.setItem("role", user.role);

        // Show success alert
        Swal.fire({
          title: "Login Successful!",
          text: `Welcome back, ${user.name}!`,
          icon: "success",
          background: "#000",
          color: "#fff",
          confirmButtonColor: "#f97316",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
          didOpen: () => {
            // Notify app about login
            window.dispatchEvent(new Event("loginStatusChanged"));
          },
          willClose: () => {
            // Role-based redirect after alert closes
            if (user.role === "dealer") {
              navigate("/dealer/dashboard", { replace: true });
            } else {
              navigate("/", { replace: true });
            }
          }
        });
      } else {
        setErrorMessage(res.data?.message || "❌ Login failed. Try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Show error alert
      Swal.fire({
        title: "Login Failed",
        text: error.response?.data?.message || "Something went wrong while logging in.",
        icon: "error",
        background: "#000",
        color: "#fff",
        confirmButtonColor: "#f97316",
      });
      
      setErrorMessage(
        error.response?.data?.message ||
          "⚠️ Something went wrong while logging in."
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
              Welcome Back
            </h2>
            <p className="text-white/70">Sign in to access your account</p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center font-medium">
              {errorMessage}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLoginSubmit}>
            {/* Role */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Role
              </label>
              <select
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                value={loginDetails.role}
                onChange={(e) =>
                  setLoginDetails({ ...loginDetails, role: e.target.value })
                }
                required
              >
                <option value="" className="bg-gray-900">-- Select your role --</option>
                <option value="buyer" className="bg-gray-900">Buyer</option>
                <option value="dealer" className="bg-gray-900">Dealer</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                value={loginDetails.email}
                onChange={(e) =>
                  setLoginDetails({ ...loginDetails, email: e.target.value })
                }
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                value={loginDetails.password}
                onChange={(e) =>
                  setLoginDetails({ ...loginDetails, password: e.target.value })
                }
                required
              />
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
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center text-gray-400 mt-8">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-orange-500 hover:text-orange-400 transition"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
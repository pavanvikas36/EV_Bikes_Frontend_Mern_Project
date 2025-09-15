import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

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

        // Notify app about login
        window.dispatchEvent(new Event("loginStatusChanged"));

        // Role-based redirect
        if (user.role === "dealer") {
          navigate("/dealer/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        setErrorMessage(res.data?.message || "❌ Login failed. Try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "⚠️ Something went wrong while logging in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-black via-gray-900 to-black px-4">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-orange-500/30">
        <h2 className="text-3xl font-bold text-center text-orange-500 mb-6">
          Welcome Back ⚡
        </h2>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 text-red-400 text-center font-medium">
            {errorMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLoginSubmit}>
          {/* Role */}
          <div>
            <select
              className="w-full px-3 py-2 border rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={loginDetails.role}
              onChange={(e) =>
                setLoginDetails({ ...loginDetails, role: e.target.value })
              }
              required
            >
              <option value="">-- Select your role --</option>
              <option value="buyer">Buyer</option>
              <option value="dealer">Dealer</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="example@email.com"
              className="w-full px-3 py-2 border rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={loginDetails.email}
              onChange={(e) =>
                setLoginDetails({ ...loginDetails, email: e.target.value })
              }
              required
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 border rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-sm text-center text-gray-300 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold underline text-orange-400 hover:text-orange-500"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    profilepic: null,
  });
  const [preview, setPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("token");

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://evbikesservermernproject-jenv.onrender.com/user/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(res.data);
        setFormData({
          name: res.data.name || "",
          username: res.data.username || "",
          email: res.data.email || "",
          password: "",
          profilepic: null,
        });
        setPreview(res.data.profilepic || null);
      } catch (error) {
        console.error("Fetch profile error:", error);
        setErrorMessage(
          error.response?.data?.message || "Failed to fetch profile"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      if (formData.name) data.append("name", formData.name);
      if (formData.username) data.append("username", formData.username);
      if (formData.email) data.append("email", formData.email);
      if (formData.password) data.append("password", formData.password);
      if (formData.profilepic && formData.profilepic.size > 0)
        data.append("profileimage", formData.profilepic);

      const res = await axios.put(
        "https://evbikesservermernproject-jenv.onrender.com/user/editProfile",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfile(res.data.user);

      // Update localStorage
      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem("username", res.data.user.username);
      localStorage.setItem("email", res.data.user.email);

      setEditMode(false);
      setErrorMessage("");
      setSuccessMessage("Profile updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Update profile error:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton
  if (loading && !profile) {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
        <div className="h-10 bg-gray-200 rounded w-full mt-6"></div>
      </div>
    );
  }

  if (errorMessage && !profile) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
          <p>{errorMessage}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 text-red-700 underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto my-10 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Your Profile</h2>
      
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      {!editMode ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            {profile.profilepic ? (
              <img
                src={profile.profilepic}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-orange-100 shadow-md"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center border-4 border-orange-100">
                <span className="text-gray-500 text-4xl font-bold">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            )}
            <h3 className="mt-4 text-xl font-semibold text-gray-800">{profile.name}</h3>
            <p className="text-gray-600">{profile.role}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Username</p>
                <p className="text-gray-800">{profile.username}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-800">{profile.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Role</p>
                <p className="text-gray-800 capitalize">{profile.role}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setEditMode(true)}
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-medium shadow-md hover:shadow-lg"
            disabled={loading}
          >
            {loading ? "Loading..." : "Edit Profile"}
          </button>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="text-center">
            <div className="relative inline-block">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-40 h-40 mx-auto rounded-full object-cover border-4 border-orange-100 shadow-md"
                />
              ) : profile.profilepic ? (
                <img
                  src={profile.profilepic}
                  alt="Profile"
                  className="w-40 h-40 mx-auto rounded-full object-cover border-4 border-orange-100 shadow-md"
                />
              ) : (
                <div className="w-40 h-40 mx-auto rounded-full bg-gray-200 flex items-center justify-center border-4 border-orange-100">
                  <span className="text-gray-500 text-4xl font-bold">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              )}
              
              <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="file"
                  name="profilepic"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">Click on the camera icon to change your photo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="Your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="Your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="New password (leave blank to keep current)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-medium shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>

            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setFormData({
                  name: profile.name || "",
                  username: profile.username || "",
                  email: profile.email || "",
                  password: "",
                  profilepic: null,
                });
                setPreview(profile.profilepic || null);
                setErrorMessage("");
              }}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Profile;
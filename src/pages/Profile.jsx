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
        data.append("profileimage", formData.profilepic); // matches backend

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
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update profile error:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (errorMessage)
    return <p className="text-center mt-10 text-red-600">{errorMessage}</p>;
  if (!profile) return null;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>

      {!editMode ? (
        <div className="space-y-4 text-gray-700">
          {profile.profilepic && (
            <img
              src={profile.profilepic}
              alt="Profile"
              className="w-32 h-32 mx-auto rounded-full object-cover"
            />
          )}
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Role:</strong> {profile.role}
          </p>
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="text-center">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 mx-auto rounded-full object-cover mb-2"
              />
            )}
            <input
              type="file"
              name="profilepic"
              accept="image/*"
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="w-full px-3 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Update Profile
          </button>

          <button
            type="button"
            onClick={() => setEditMode(false)}
            className="w-full bg-gray-300 text-black py-2 rounded-lg hover:bg-gray-400 transition mt-2"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default Profile;

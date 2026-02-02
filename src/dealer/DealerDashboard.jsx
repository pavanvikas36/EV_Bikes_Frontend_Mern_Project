import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Profile from "../pages/Profile";
import AddVehicle from "./AddVehicle";
import { 
  Home, 
  PlusCircle, 
  Settings, 
  ShoppingCart, 
  User, 
  Trash2, 
  BarChart3,
  Edit,
  Eye
} from "lucide-react";
import EditVehicleModal from "./EditVehicleModal";

function DealerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeOrders: 0,
    earnings: 0
  });
  const [editVehicle, setEditVehicle] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Redirect non-dealer users
  useEffect(() => {
    if (userRole !== "dealer") {
      navigate("/login", { replace: true });
    }
  }, [navigate, userRole]);

  // Show success alert
  const showSuccessAlert = (message) => {
    Swal.fire({
            title: "Success!",
            text: message,
            icon: "success",
            background: "#000",
            color: "#fff",
            confirmButtonColor: "#f97316",
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
          });
  };

  // Show error alert
  const showErrorAlert = (message) => {
    Swal.fire({
      title: "Error!",
      text: message,
      icon: "error",
      confirmButtonColor: "#f97316",
    });
  };

  // Show confirmation dialog
  const showConfirmationDialog = (title, text, confirmButtonText = "Yes") => {
    return Swal.fire({
      title: title,
      text: text,
      icon: "warning",
      background: "#000",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
      confirmButtonText: confirmButtonText,
    });
  };

  // Fetch dealer vehicles
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://evbikesservermernproject-jenv.onrender.com/dealers/getAllVehicles",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Vehicles response:", res.data);
      const vehiclesData = res.data.data || [];
      setVehicles(vehiclesData);
      
      // Update stats
      setStats({
        totalVehicles: vehiclesData.length,
        activeOrders: Math.floor(Math.random() * 20) + 5, // Mock data
        earnings: vehiclesData.reduce((sum, vehicle) => sum + (vehicle.price || 0), 0) * 0.1 // 10% of total value
      });
    } catch (err) {
      console.error("Fetch vehicles error:", err);
      setVehicles([]);
      showErrorAlert("Failed to fetch vehicles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch vehicles on mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Delete vehicle
  const handleDeleteVehicle = async (vehicleId) => {
    const result = await showConfirmationDialog(
      "Are you sure?",
      "You won't be able to recover this vehicle!",
      "Yes, delete it!"
    );
    
    if (!result.isConfirmed) return;
    
    try {
      setLoading(true);
      const res = await axios.delete(
        `https://evbikesservermernproject-jenv.onrender.com/dealers/deleteVehicle/${vehicleId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showSuccessAlert(res.data.message || "Vehicle deleted successfully!");
      fetchVehicles();
    } catch (err) {
      console.error("Delete vehicle error:", err.response?.data || err.message);
      showErrorAlert(err.response?.data?.message || "Failed to delete vehicle");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: "overview", name: "Dashboard", icon: <BarChart3 size={20} /> },
    { id: "add", name: "Add Vehicle", icon: <PlusCircle size={20} /> },
    { id: "manage", name: "Manage Vehicles", icon: <Settings size={20} /> },
    { id: "orders", name: "Orders", icon: <ShoppingCart size={20} /> },
    { id: "profile", name: "Profile", icon: <User size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-5 flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-2 mb-8 mt-2">
          <div className="bg-orange-500 p-2 rounded-lg">
            <Home size={24} />
          </div>
          <h2 className="text-xl font-bold">RevVolt Dealer</h2>
        </div>
        
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id 
                    ? "bg-orange-500 text-white" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
        
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <div>
              <p className="font-medium">Dealer Account</p>
              <p className="text-xs">Premium Access</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Dashboard Overview */}
        {activeTab === "overview" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
              <p className="text-sm text-gray-500">Welcome back! Here's your business summary</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-orange-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Total Vehicles</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalVehicles}</p>
                  </div>
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <BarChart3 className="text-orange-500" size={20} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">All your listed vehicles</p>
              </div>
              
              <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Active Orders</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.activeOrders}</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <ShoppingCart className="text-blue-500" size={20} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Current pending orders</p>
              </div>
              
              <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Total Earnings</p>
                    <p className="text-2xl font-bold text-gray-800">₹{stats.earnings.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <span className="text-green-500 font-bold">₹</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Lifetime earnings</p>
              </div>
            </div>

            {/* Recent Vehicles */}
            <div className="bg-white shadow-md rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Your Vehicles</h2>
                <button 
                  onClick={() => setActiveTab("manage")}
                  className="text-sm text-orange-500 hover:underline"
                >
                  View All
                </button>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="text-center py-10">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="text-gray-400" size={24} />
                  </div>
                  <p className="text-gray-500">No vehicles found</p>
                  <button 
                    onClick={() => setActiveTab("add")}
                    className="mt-3 text-orange-500 hover:underline"
                  >
                    Add your first vehicle
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                  {vehicles.slice(0, 10).map((v) => (
                    <div key={v._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white">
                      <div className="relative w-full pt-[75%] overflow-hidden">
                        {v.images && v.images[0] ? (
                          <img
                            src={v.images[0].url}
                            alt={v.model}
                            className="absolute top-0 left-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute top-0 left-0 w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-800 truncate">
                          {v.brand} {v.model}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2 h-10 overflow-hidden">
                          {v.description}
                        </p>
                        <div className="flex justify-between items-center mt-3">
                          <p className="font-bold text-orange-500">₹{v.price?.toLocaleString()}</p>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-800">
                            {v.fuelType}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Vehicle */}
        {activeTab === "add" && <AddVehicle onVehicleAdded={fetchVehicles} showSuccessAlert={showSuccessAlert} showErrorAlert={showErrorAlert} />}

        {/* Manage Vehicles */}
        {activeTab === "manage" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Manage Vehicles</h1>
              <button 
                onClick={() => setActiveTab("add")}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition"
              >
                <PlusCircle size={18} />
                Add New Vehicle
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-md">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No vehicles yet</h3>
                <p className="text-gray-500 mb-4">Get started by adding your first vehicle</p>
                <button 
                  onClick={() => setActiveTab("add")}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
                >
                  Add Vehicle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {vehicles.map((v) => (
                  <div key={v._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="relative w-full pt-[75%] overflow-hidden">
                      {v.images && v.images[0] ? (
                        <img
                          src={v.images[0].url}
                          alt={v.model}
                          className="absolute top-0 left-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute top-0 left-0 w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-800 truncate">
                        {v.brand} {v.model}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2 h-10 overflow-hidden">
                        {v.description}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <p className="font-bold text-orange-500">₹{v.price?.toLocaleString()}</p>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-800">
                          {v.fuelType}
                        </span>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-200 transition flex items-center justify-center gap-1">
                          <Eye size={16} />
                          View
                        </button>
                        <button
                          onClick={() => {
                            setEditVehicle(v);
                            setIsEditOpen(true);
                          }}
                          className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg text-sm hover:bg-blue-200 transition flex items-center justify-center gap-1"
                        >
                          <Edit size={16} />
                          Edit
                        </button>

                        <button 
                          onClick={() => handleDeleteVehicle(v._id)}
                          className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg text-sm hover:bg-red-200 transition flex items-center justify-center gap-1"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h1>
            <div className="text-center py-16">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="text-orange-500" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Orders feature coming soon</h3>
              <p className="text-gray-500">We're working on implementing order management functionality</p>
            </div>
          </div>
        )}

        {/* Profile */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h1>
            <Profile showSuccessAlert={showSuccessAlert} showErrorAlert={showErrorAlert} />
          </div>
        )}
      </main>
      <EditVehicleModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        vehicle={editVehicle}
        onUpdated={fetchVehicles}
      />
    </div>
  );
}

export default DealerDashboard;





// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Swal from "sweetalert2";
// import Sidebar from "./Sidebar";
// import DashboardOverview from "./DashboardOverview";
// import ManageVehicles from "./ManageVehicles";
// import Orders from "./Orders";
// import Profile from "../pages/Profile";
// import AddVehicle from "./AddVehicle";

// function DealerDashboard() {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [stats, setStats] = useState({
//     totalVehicles: 0,
//     activeOrders: 0,
//     earnings: 0
//   });
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const userRole = localStorage.getItem("role");

//   // Redirect non-dealer users
//   useEffect(() => {
//     if (userRole !== "dealer") {
//       navigate("/login", { replace: true });
//     }
//   }, [navigate, userRole]);

//   // Show success alert
//   const showSuccessAlert = (message) => {
//     Swal.fire({
//       title: "Success!",
//       text: message,
//       icon: "success",
//       background: "#000",
//       color: "#fff",
//       confirmButtonColor: "#f97316",
//       timer: 2000,
//       showConfirmButton: false,
//       timerProgressBar: true,
//     });
//   };

//   // Show error alert
//   const showErrorAlert = (message) => {
//     Swal.fire({
//       title: "Error!",
//       text: message,
//       icon: "error",
//       confirmButtonColor: "#f97316",
//     });
//   };

//   // Show confirmation dialog
//   const showConfirmationDialog = (title, text, confirmButtonText = "Yes") => {
//     return Swal.fire({
//       title: title,
//       text: text,
//       icon: "warning",
//       background: "#000",
//       color: "#fff",
//       showCancelButton: true,
//       confirmButtonColor: "#f97316",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: confirmButtonText,
//     });
//   };

//   // Fetch dealer vehicles
//   const fetchVehicles = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         "https://evbikesservermernproject-jenv.onrender.com/dealers/getAllVehicles",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       console.log("Vehicles response:", res.data);
//       const vehiclesData = res.data.data || [];
//       setVehicles(vehiclesData);
      
//       // Update stats
//       setStats({
//         totalVehicles: vehiclesData.length,
//         activeOrders: Math.floor(Math.random() * 20) + 5, // Mock data
//         earnings: vehiclesData.reduce((sum, vehicle) => sum + (vehicle.price || 0), 0) * 0.1 // 10% of total value
//       });
//     } catch (err) {
//       console.error("Fetch vehicles error:", err);
//       setVehicles([]);
//       showErrorAlert("Failed to fetch vehicles. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch vehicles on mount
//   useEffect(() => {
//     fetchVehicles();
//   }, []);

//   // Delete vehicle
//   const handleDeleteVehicle = async (vehicleId) => {
//     const result = await showConfirmationDialog(
//       "Are you sure?",
//       "You won't be able to recover this vehicle!",
//       "Yes, delete it!"
//     );
    
//     if (!result.isConfirmed) return;
    
//     try {
//       setLoading(true);
//       const res = await axios.delete(
//         `https://evbikesservermernproject-jenv.onrender.com/dealers/deleteVehicle/${vehicleId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       showSuccessAlert(res.data.message || "Vehicle deleted successfully!");
//       fetchVehicles();
//     } catch (err) {
//       console.error("Delete vehicle error:", err.response?.data || err.message);
//       showErrorAlert(err.response?.data?.message || "Failed to delete vehicle");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
//       {/* Main Content */}
//       <main className="flex-1 p-6 overflow-y-auto">
//         {/* Dashboard Overview */}
//         {activeTab === "overview" && (
//           <DashboardOverview 
//             stats={stats} 
//             loading={loading} 
//             vehicles={vehicles} 
//             setActiveTab={setActiveTab} 
//           />
//         )}

//         {/* Add Vehicle */}
//         {activeTab === "add" && (
//           <AddVehicle 
//             onVehicleAdded={fetchVehicles} 
//             showSuccessAlert={showSuccessAlert} 
//             showErrorAlert={showErrorAlert} 
//           />
//         )}

//         {/* Manage Vehicles */}
//         {activeTab === "manage" && (
//           <ManageVehicles 
//             loading={loading} 
//             vehicles={vehicles} 
//             setActiveTab={setActiveTab} 
//             handleDeleteVehicle={handleDeleteVehicle} 
//           />
//         )}

//         {/* Orders */}
//         {activeTab === "orders" && <Orders />}

//         {/* Profile */}
//         {activeTab === "profile" && (
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h1>
//             <Profile showSuccessAlert={showSuccessAlert} showErrorAlert={showErrorAlert} />
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default DealerDashboard;
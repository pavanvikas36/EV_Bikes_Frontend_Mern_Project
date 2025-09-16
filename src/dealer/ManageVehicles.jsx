function ManageVehicles({ vehicles, loading, onDelete }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Vehicles</h2>
      {loading ? (
        <p>Loading...</p>
      ) : vehicles.length === 0 ? (
        <p>No vehicles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map((v) => (
            <div key={v._id} className="bg-white p-4 rounded shadow">
              {v.images && v.images[0] ? (
                <img
                  src={v.images[0].url}
                  alt={v.model}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded mb-2">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <h3 className="text-lg font-semibold">
                {v.brand} {v.model}
              </h3>
              <p>{v.description}</p>
              <p className="font-medium mt-1">Price: ₹{v.price}</p>
              <p className="text-sm text-gray-500">
                Fuel: {v.fuelType} | Transmission: {v.transmission}
              </p>
              <button
                onClick={() => onDelete(v._id)}
                className="mt-2 w-full bg-red-500 text-white py-1 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageVehicles;

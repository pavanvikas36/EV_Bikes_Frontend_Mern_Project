function Overview({ vehicles }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow p-6 rounded-lg">
          <h2 className="text-lg font-semibold">Total Vehicles</h2>
          <p className="text-3xl font-bold text-orange-500">{vehicles.length}</p>
        </div>
        <div className="bg-white shadow p-6 rounded-lg">
          <h2 className="text-lg font-semibold">Active Orders</h2>
          <p className="text-3xl font-bold text-orange-500">5</p>
        </div>
        <div className="bg-white shadow p-6 rounded-lg">
          <h2 className="text-lg font-semibold">Earnings</h2>
          <p className="text-3xl font-bold text-orange-500">₹1,20,000</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-3">Your Vehicles</h2>
      {vehicles.length === 0 ? (
        <p>No vehicles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <div key={v._id} className="bg-white rounded shadow p-4">
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
              <p className="text-gray-600">{v.description}</p>
              <p className="font-medium mt-1">Price: ₹{v.price}</p>
              <p className="text-sm text-gray-500">
                Fuel: {v.fuelType} | Transmission: {v.transmission}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Overview;

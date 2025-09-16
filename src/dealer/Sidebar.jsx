function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 bg-black text-white p-5 flex-shrink-0">
      <h2 className="text-2xl font-bold text-orange-500 mb-6">RevVolt</h2>
      <ul className="space-y-4">
        {["overview", "add", "manage", "orders", "profile"].map((tab) => (
          <li
            key={tab}
            className={`cursor-pointer ${
              activeTab === tab ? "text-orange-400" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "overview"
              ? "Dashboard"
              : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;

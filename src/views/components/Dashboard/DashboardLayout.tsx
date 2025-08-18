import React from "react";
import { NavLink, Outlet } from "react-router-dom";
// import Header from "./Header"; 
const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-[250px] bg-[#0f172f] text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          TontiTrack
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${
                isActive ? "bg-white text-[#0f172f]" : "hover:bg-[#1a2a4f]"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/dashboard/manage-users"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${
                isActive ? "bg-white text-[#0f172f]" : "hover:bg-[#1a2a4f]"
              }`
            }
          >
            Manage Users
          </NavLink>
          <NavLink
            to="/dashboard/manage-tontine"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${
                isActive ? "bg-white text-[#0f172f]" : "hover:bg-[#1a2a4f]"
              }`
            }
          >
            Manage Tontine
          </NavLink>
        </nav>
        <div className="p-4 text-xs text-center border-t border-gray-700">
          &copy; 2025 TontiTrack
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {/* <Header /> */}

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

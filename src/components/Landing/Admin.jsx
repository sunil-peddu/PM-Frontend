import MainLogo from "../../assets/Main logo.png";
import DefaultAvatar from "../../assets/Person.jpg";
import axios from "axios";
import toast from "react-hot-toast";
import { URL } from "../../url";
import {
  LayoutDashboard,
  FolderDot,
  UsersRound,
  Bell,
  Power,
  Info
} from "lucide-react";

import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../AuthProvider/AuthProvider";

function Admin() {
  const { user, logout,token } = useAuth();

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard />,
    },
    {
      name: "Team",
      path: "/admin/team",
      icon: <UsersRound />,
    },
    {
      name: "Projects",
      path: "/admin/projects",
      icon: <FolderDot />,
    },
    {
      name: "Audit Logs",
      path: "/admin/logs",
      icon: <Info />,
    },
  ];
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      const responseData = response.data;

      if (responseData.status === "success") {
        logout(); // call auth logout function
        toast.success(responseData.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };
  return (
    <main className="h-screen p-2 flex gap-2 bg-gray-300">
      {/* Sidebar */}
      <nav className="w-60 rounded-lg border border-white/90 bg-blue-50/80 backdrop-blur-lg flex flex-col justify-between">
        <div>
          <img src={MainLogo} alt="logo" className="w-40 mx-auto" />

          <ul className="p-3 space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center gap-4 p-3 pl-5 rounded-lg w-full transition ${
                      isActive
                        ? "bg-[#38a0f5] text-white font-medium shadow-xs"
                        : "text-gray-500 hover:bg-white/50"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={isActive ? "text-white" : "text-gray-500"}
                      >
                        {item.icon}
                      </span>

                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout Button */}
        <div className="p-4 ">
          <button
            onClick={handleLogout}
            className="flex items-center rounded-lg gap-3 bg-red-100 text-red-600 w-full p-2 cursor-pointer"
          >
            <Power size={18} />
            Logout
          </button>
        </div>
      </nav>

      {/* Right Side */}
      <section className="flex-1 flex flex-col gap-2">
        {/* Top Navbar */}
        <div className="h-16 rounded-lg border border-white/90 bg-blue-50/80 backdrop-blur-lg px-4 flex items-center justify-end">
          <div className="flex items-center gap-4">
            {/* Notification */}
            <button className="bg-white p-2 rounded-full shadow-sm">
              <Bell size={18} className="text-gray-500" />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2 ">
              <img
                src={DefaultAvatar}
                alt="avatar"
                className="w-11 h-11 rounded-full object-cover"
              />

              <div>
                <h3 className="text-sm font-semibold text-gray-800 leading-tight">
                  {user?.full_name || "-"}
                </h3>

                <p className="text-xs text-gray-500">{user?.email || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-2">
          <Outlet />
        </div>
      </section>
    </main>
  );
}

export default Admin;

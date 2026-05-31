import MainLogo from "../../assets/Main logo.png";
import DefaultAvatar from "../../assets/Person.jpg";
import { Bell, User, LogOut } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../AuthProvider/AuthProvider";
import ProfileModal from "../Common/ProfileModal";
import axios from "axios";
import toast from "react-hot-toast";
import { URL } from "../../url";
import NotificationsDropdown from "../Common/NotificationsModal";
function Employee() {
  const { user, logout, token } = useAuth();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    {
      name: "Dashboard",
      path: "/employee",
    },
    {
      name: "Projects",
      path: "/employee/projects",
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

      if (response.data.status === "success") {
        logout();
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  return (
    <>
      <main className="h-screen p-2 flex flex-col gap-2 bg-gray-300">
        <nav className="w-full h-16 rounded-full px-3 border border-white/50 bg-white/50 backdrop-blur-lg flex items-center justify-between">
          {/* Logo */}
          <div className="w-40 h-12 flex items-center justify-center">
            <img src={MainLogo} alt="logo" />
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/employee"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive ? "bg-black text-white" : " hover:bg-white/70"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Notification + Profile */}
          <div className="flex items-center gap-4">
            {/* Notification */}
            {/* <button className="hover:bg-white/70 p-2 hover:rounded-full">
              <Bell size={18} className="text-gray-500" />
            </button> */}
            <NotificationsDropdown />

            {/* Profile */}
            <div className="relative" ref={dropdownRef}>
              {/* Profile Button */}
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 hover:bg-white/70 rounded-full p-1 pr-10 transition cursor-pointer"
              >
                <div className="bg-gray-100 p-1 rounded-full">
                  <img
                    src={DefaultAvatar}
                    alt="avatar"
                    className="w-11 h-11 rounded-full object-cover"
                  />
                </div>

                <div className="text-left">
                  <h3 className="text-sm font-semibold text-gray-800 leading-tight">
                    {user?.full_name || "-"}
                  </h3>

                  <p className="text-xs text-gray-500">{user?.email || "-"}</p>
                </div>
              </button>

              {/* Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden z-50">
                  {/* Profile */}
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setProfileOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <User size={16} />

                    <span>Profile</span>
                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut size={16} />

                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Child Routes */}
        <section className="flex-1 min-h-0 overflow-hidden p-2">
          <Outlet />
        </section>

        <ProfileModal open={profileOpen} setOpen={setProfileOpen} />
      </main>
    </>
  );
}

export default Employee;

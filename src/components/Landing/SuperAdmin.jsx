import MainLogo from "../../assets/Main logo.png";
import { LayoutDashboard, Building2, Info, LogOut } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../AuthProvider/AuthProvider";
import DefaultAvatar from "../../assets/Person.jpg";
import axios from "axios";
import toast from "react-hot-toast";
import { URL } from "../../url";

function SuperAdmin() {
  const { user, token, logout } = useAuth();

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
  const navItems = [
    {
      name: "Dashboard",
      path: "/super-admin",
      icon: <LayoutDashboard />,
    },
    {
      name: "Organizations",
      path: "/super-admin/organization",
      icon: <Building2 />,
    },
    {
      name: "Audit Logs",
      path: "/super-admin/audit-logs",
      icon: <Info />,
    },
  ];

  return (
    <main className="h-screen p-2 flex  gap-2 ">
      {/* Sidebar */}
      <nav className="bg-gray-100 w-60 rounded-lg flex flex-col justify-between">
        <div className="w-full">
          <img src={MainLogo} alt="logo" className="w-40 mx-auto " />

          <ul className="p-3 space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  end={item.path === "/super-admin"}
                  className={({ isActive }) =>
                    `relative flex items-center gap-4 p-2 pl-5 rounded-md w-full transition ${
                      isActive
                        ? "font-medium text-black"
                        : "text-gray-400 hover:bg-gray-300"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full"></span>
                      )}

                      <span
                        className={
                          isActive ? "text-blue-500 " : "text-gray-400"
                        }
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
        {/* Profile Section */}
        <div className="p-4 border-t border-gray-300 flex items-center justify-between">
          <div className="flex  items-center gap-2 text-center">
            <img
              src={DefaultAvatar}
              alt="avatar"
              className="w-14 h-14 rounded-full object-cover shrink-0"
            />
            <div>
              <h3 className="font-semibold text-sm text-gray-800 line-clamp-1">
                {user?.full_name || "-"}
              </h3>

              <p className="text-xs text-gray-500">{user?.role || "-"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className=" hover:text-red-600 cursor-pointer"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* Right Side Content */}
      <section className="flex-1  bg-gray-100 rounded-lg p-4">
        <Outlet />
      </section>
    </main>
  );
}

export default SuperAdmin;

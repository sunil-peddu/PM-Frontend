import MainLogo from "../../assets/Main logo.png";
import DefaultAvatar from "../../assets/Person.jpg";
import { Bell } from "lucide-react";
import { useAuth } from "../AuthProvider/AuthProvider";
import { NavLink, Outlet } from "react-router-dom";

function Manager() {
  const { user } = useAuth();
  const navLinks = [
    {
      name: "Dashboard",
      path: "/manager",
    },
    {
      name: "Projects",
      path: "/manager/projects",
    },
    {
      name: "Audit Logs",
      path: "/manager/logs",
    },
  ];

  return (
    <>
      <main className="h-screen p-2 flex flex-col gap-2 bg-gray-100">
        <nav className="flex justify-between items-center w-full h-16 rounded-full px-3 bg-white">
          <div className="w-40 h-12 flex items-center justify-center bg-gray-100 rounded-full">
            <img src={MainLogo} alt="logo" />
          </div>
          {/* Navigation */}
          <div className="flex items-center gap-3">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/manager"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {/* Notification */}
            <button className="bg-gray-100 p-2 rounded-full shadow-sm">
              <Bell size={18} className="text-gray-500" />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2 ">
              <div className="bg-gray-100 p-1 rounded-full">
                <img
                  src={DefaultAvatar}
                  alt="avatar"
                  className="w-11 h-11 rounded-full object-cover "
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800 leading-tight">
                  {user?.full_name || "-"}
                </h3>

                <p className="text-xs text-gray-500">{user?.email || "-"}</p>
              </div>
            </div>
          </div>
        </nav>
        {/* Page Content */}
        <section className="flex-1 min-h-0 overflow-hidden p-2">
          <Outlet />
        </section>
      </main>
    </>
  );
}
export default Manager;

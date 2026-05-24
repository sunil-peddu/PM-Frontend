import { Plus, Power, SquarePen, Eye, EyeOff } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";
import CreateTeamMember from "./CreateTeamMember";
import Tooltip from "../Common/Tooltip";
import { RiLockPasswordLine } from "react-icons/ri";
import { Dialog, DialogContent, TextField } from "@mui/material";

function Team() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("manager");
  const [editUser, setEditUser] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  // Get Users API
  const getUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${URL}/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setUsers(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    getUsers();
  }, []);

  // Separate data
  const managers = users.filter(
    (user) => user.role === "admin" || user.role === "manager",
  );

  const employees = users.filter((user) => user.role === "user");

  // Search filter
  const filteredManagers = managers.filter(
    (manager) =>
      manager.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const highlightText = (text, search) => {
    if (!search) return text;

    const regex = new RegExp(`(${search})`, "gi");

    return text.split(regex).map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 text-black px-1 rounded">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };
  const toggleUserStatus = async (userId) => {
    try {
      const response = await axios.patch(
        `${URL}/users/${userId}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      toast.success(
        response?.data?.message || "User status updated successfully",
      );

      getUsers();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update user status",
      );
    }
  };

  const updatePassword = async () => {
    if (!newPassword) {
      toast.error("Password is required");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setPasswordLoading(true);

      const response = await axios.put(
        `${URL}/users/${selectedUserId}/password`,
        {
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      toast.success(response?.data?.message || "Password updated successfully");

      setPasswordOpen(false);
      setNewPassword("");
      setSelectedUserId(null);
      setShowNewPassword(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update password",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#d1d5db",
      },

      "&:hover fieldset": {
        borderColor: "#d1d5db",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#d1d5db",
        borderWidth: "1px",
      },
    },

    "& .MuiInputLabel-root": {
      color: "#6b7280",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#000000",
    },
  };
  return (
    <>
      <main className="w-full h-full flex flex-col gap-3 min-h-0 overflow-hidden">
        <header className="flex justify-between items-end">
          <div>
            <p className="text-xl font-medium pb-1">Team</p>
            <p className="text-sm text-gray-600">
              Meet the people behind our success.
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 text-sm">
            <button
              onClick={() => {
                setSelectedRole("manager");
                setIsEdit(false);
                setEditUser(null);
                setOpen(true);
              }}
              className="button_bg"
            >
              <Plus size={16} />
              Create Manager
            </button>

            <button
              onClick={() => {
                setSelectedRole("user");
                setIsEdit(false);
                setEditUser(null);
                setOpen(true);
              }}
              className="button_bg"
            >
              <Plus size={16} />
              Create Employee
            </button>
          </div>
        </header>
        <section className="bg-white rounded-xl shadow-sm p-4 flex-1 min-h-0 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            {/* Search */}
            <div className="pb-4 flex justify-end">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-60 bg-blue-50 rounded-lg px-3 py-2 text-sm outline-none  "
              />
            </div>
            <table className="w-full text-sm">
              {/* Table Head */}
              <thead className="sticky top-0 bg-white border-b border-gray-200 z-10">
                <tr className="text-left">
                  <th className="py-3 px-3 font-medium">Name</th>

                  <th className="py-3 px-3 font-medium">Email</th>

                  <th className="py-3 px-3 font-medium">Role</th>

                  <th className="py-3 px-3 font-medium">Created</th>

                  <th className="py-3 px-3 font-medium">Status</th>

                  <th className="py-3 px-3 font-medium text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-400">
                      Loading team members...
                    </td>
                  </tr>
                ) : (
                  <>
                    {/* ================= Managers Section ================= */}
                    <tr className="bg-gray-50 border-y border-gray-200">
                      <td
                        colSpan="6"
                        className="py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        Managers ({filteredManagers.length})
                      </td>
                    </tr>

                    {managers.length > 0 ? (
                      filteredManagers.map((manager) => (
                        <tr
                          key={manager.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          {/* Name */}
                          <td className="py-3 px-3">
                            <p className="font-medium text-gray-800">
                              {highlightText(manager.full_name, searchTerm)}
                            </p>
                          </td>

                          {/* Email */}
                          <td className="py-3 px-3 text-gray-600">
                            {highlightText(manager.email, searchTerm)}
                          </td>

                          {/* Role */}
                          <td className="py-3 px-3">
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-600 capitalize">
                              {manager.role}
                            </span>
                          </td>

                          {/* Created */}
                          <td className="py-3 px-3 text-gray-500 whitespace-nowrap">
                            {new Date(manager.created_at).toLocaleDateString()}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                manager.is_active
                                  ? "bg-green-50 text-green-600"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {manager.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3">
                            <div className="flex items-center justify-center gap-3">
                              {/* Edit */}
                              <Tooltip text="Edit">
                                <button
                                  onClick={() => {
                                    setEditUser(manager); // or employee
                                    setIsEdit(true);
                                    setOpen(true);
                                  }}
                                  className="cursor-pointer text-blue-600 hover:text-blue-700"
                                >
                                  <SquarePen size={16} />
                                </button>
                              </Tooltip>
                              {/* Active / Inactive */}
                              <Tooltip text="Update Status">
                                <button
                                  onClick={() => toggleUserStatus(manager.id)}
                                  className={`cursor-pointer ${
                                    manager.is_active
                                      ? "text-green-600 hover:text-green-700"
                                      : "text-red-600 hover:text-red-700"
                                  }`}
                                >
                                  <Power size={16} />
                                </button>
                              </Tooltip>
                              <Tooltip text="Update Password">
                                <button
                                  onClick={() => {
                                    setSelectedUserId(manager.id); // employee.id in employee section
                                    setPasswordOpen(true);
                                  }}
                                  className="cursor-pointer text-orange-500 hover:text-orange-600"
                                >
                                  <RiLockPasswordLine />
                                </button>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-6 text-gray-400"
                        >
                          No managers found
                        </td>
                      </tr>
                    )}

                    {/* ================= Employees Section ================= */}
                    <tr className="bg-gray-50 border-y border-gray-200">
                      <td
                        colSpan="6"
                        className="py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        Employees ({filteredEmployees.length})
                      </td>
                    </tr>

                    {employees.length > 0 ? (
                      filteredEmployees.map((employee) => (
                        <tr
                          key={employee.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          {/* Name */}
                          <td className="py-3 px-3">
                            <p className="font-medium text-gray-800">
                              {highlightText(employee.full_name, searchTerm)}
                            </p>
                          </td>

                          {/* Email */}
                          <td className="py-3 px-3 text-gray-600">
                            {highlightText(employee.email, searchTerm)}
                          </td>

                          {/* Role */}
                          <td className="py-3 px-3">
                            <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 capitalize">
                              {employee.role}
                            </span>
                          </td>

                          {/* Created */}
                          <td className="py-3 px-3 text-gray-500 whitespace-nowrap">
                            {new Date(employee.created_at).toLocaleDateString()}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                employee.is_active
                                  ? "bg-green-50 text-green-600"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {employee.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3">
                            <div className="flex items-center justify-center gap-3">
                              {/* Edit */}
                              <Tooltip text="Edit">
                                <button
                                  onClick={() => {
                                    setEditUser(employee); // or employee
                                    setIsEdit(true);
                                    setOpen(true);
                                  }}
                                  className="cursor-pointer text-blue-600 hover:text-blue-700"
                                >
                                  <SquarePen size={16} />
                                </button>
                              </Tooltip>

                              {/* Active / Inactive */}
                              <Tooltip text="Update Status">
                                <button
                                  onClick={() => toggleUserStatus(employee.id)}
                                  className={`cursor-pointer ${
                                    employee.is_active
                                      ? "text-green-600 hover:text-green-700"
                                      : "text-red-600 hover:text-red-700"
                                  }`}
                                >
                                  <Power size={16} />
                                </button>
                              </Tooltip>
                              <Tooltip text="Update Password">
                                <button
                                  onClick={() => {
                                    setSelectedUserId(employee.id); // employee.id in employee section
                                    setPasswordOpen(true);
                                  }}
                                  className="cursor-pointer text-orange-500 hover:text-orange-600"
                                >
                                  <RiLockPasswordLine />
                                </button>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-6 text-gray-400"
                        >
                          No employees found
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </section>
        <CreateTeamMember
          open={open}
          setOpen={setOpen}
          selectedRole={selectedRole}
          getUsers={getUsers}
          editUser={editUser}
          isEdit={isEdit}
        />
        <Dialog
          open={passwordOpen}
          onClose={() => {
            setPasswordOpen(false);
            setNewPassword("");
          }}
          maxWidth="xs"
          fullWidth
        >
          <DialogContent className="p-5! flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Update Password</p>

              <button
                onClick={() => {
                  setPasswordOpen(false);
                  setNewPassword("");
                }}
              >
                ✕
              </button>
            </div>

            <div className="relative">
              <TextField
                fullWidth
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={textFieldStyle}
              />

              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setPasswordOpen(false);
                  setNewPassword("");
                }}
                className="form_button_n"
              >
                Cancel
              </button>

              <button
                onClick={updatePassword}
                disabled={passwordLoading}
                className="form_button_bg"
              >
                {passwordLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
export default Team;

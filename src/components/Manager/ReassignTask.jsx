import { useEffect, useState } from "react";
import { X, ChevronDown, User2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";

function ReassignTask({ open, setOpen, projectId, task, refreshTasks }) {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState("");

  // ================= CLOSE =================
  const handleClose = () => {
    setOpen(false);
    setSelectedUser("");
    setDropdownOpen(false);
  };

  // ================= FETCH MEMBERS =================
  const getMembers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${URL}/projects/${projectId}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setUsers(response.data.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && projectId) {
      getMembers();
    }
  }, [open, projectId]);

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }

    try {
      setSubmitLoading(true);

      const response = await axios.patch(
        `${URL}/tasks/${task.id}/reassign`,
        {
          new_user_id: Number(selectedUser),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      toast.success(response?.data?.message || "Task reassigned successfully");

      handleClose();

      if (refreshTasks) {
        refreshTasks();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reassign task");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[6px] p-4">
      <div className="w-full max-w-md rounded-[30px] bg-white/20 border border-white/30 p-3 backdrop-blur-xl">
        <div className="rounded-[28px] bg-[#f7f7f7]/80 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <p className="text-lg font-medium">Reassign Task</p>

              <p className="text-sm text-gray-500 mt-1">{task?.title}</p>
            </div>

            <button
              onClick={handleClose}
              className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white/60 transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 pb-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Assign To
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="h-12 w-full rounded-2xl bg-gray-100 border border-gray-200 px-4 text-sm outline-none transition flex items-center justify-between hover:bg-gray-200"
                >
                  <span
                    className={selectedUser ? "text-black" : "text-gray-400"}
                  >
                    {selectedUser
                      ? users.find((u) => u.user_id === Number(selectedUser))
                          ?.full_name
                      : loading
                        ? "Loading..."
                        : "Select member"}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                    <div className="max-h-60 overflow-y-auto">
                      {users
                        .filter(
                          (user) =>
                            user.role_in_project === "user" &&
                            user.user_id !== task?.assigned_to,
                        )
                        .map((user) => (
                          <button
                            key={user.user_id}
                            type="button"
                            onClick={() => {
                              setSelectedUser(user.user_id);
                              setDropdownOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left transition hover:bg-gray-100 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="h-9 w-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                              <User2 size={16} />
                            </div>

                            <div>
                              <p className="text-sm font-medium text-black">
                                {user.full_name}
                              </p>

                              <p className="text-xs text-gray-500">
                                {user.email}
                              </p>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pb-5 px-6">
            <button
              onClick={handleClose}
              className="h-10 px-5 rounded-2xl border border-gray-200 bg-white text-sm font-medium hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitLoading}
              className="h-10 px-5 rounded-2xl bg-black text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {submitLoading ? "Reassigning..." : "Reassign"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReassignTask;

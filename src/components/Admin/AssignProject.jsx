import { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";

function AssignProject({
  open,
  setOpen,
  project,
  mode = "add",
}) {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const [loading, setLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ================= Close =================
  const handleClose = () => {
    setOpen(false);
    setSelectedUser("");
    setDropdownOpen(false);
  };

  // ================= Fetch Users =================
  const getUsers = async () => {
    try {
      setLoading(true);

      const [usersResponse, membersResponse] =
        await Promise.all([
          axios.get(`${URL}/users/`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }),

          axios.get(
            `${URL}/projects/${project.id}/members`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            },
          ),
        ]);

      const allUsers = usersResponse.data.data || [];

      const members = membersResponse.data.data || [];

      // Existing member ids
      const existingMemberIds = members.map(
        (member) => member.user_id,
      );

      // ADD MODE
      if (mode === "add") {
        const filteredUsers = allUsers.filter(
          (user) =>
            user.role !== "admin" &&
            !existingMemberIds.includes(user.id),
        );

        setUsers(filteredUsers);
      }

      // REMOVE MODE
      if (mode === "remove") {
        setUsers(members);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch users",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && project?.id) {
      getUsers();
    }
  }, [open, project]);

  // ================= Submit =================
  const handleSubmit = async () => {
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }

    try {
      setAssignLoading(true);

      let response;

      // ADD USER
      if (mode === "add") {
        response = await axios.post(
          `${URL}/projects/${project.id}/members`,
          {
            user_id: Number(selectedUser),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );
      }

      // REMOVE USER
      if (mode === "remove") {
        response = await axios.delete(
          `${URL}/projects/${project.id}/members/${selectedUser}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );
      }

      toast.success(
        response?.data?.message ||
          (mode === "add"
            ? "User assigned successfully"
            : "User removed successfully"),
      );

      handleClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong",
      );
    } finally {
      setAssignLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[6px] p-4">
        {/* Outer Glass Layer */}
        <div className="w-full max-w-sm rounded-[30px] bg-white/20 border border-white/30 p-3 backdrop-blur-xl">
          {/* Inner Glass Card */}
          <div className="rounded-[28px] bg-[#f7f7f7]/80 backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5">
              <p className="text-lg font-medium">
                {mode === "add"
                  ? "Assign to project"
                  : "Remove from project"}
              </p>

              <button
                onClick={handleClose}
                className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white/60 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  {mode === "add"
                    ? "Select User"
                    : "Select Member"}
                </label>

                {/* Custom Dropdown */}
                <div className="relative">
                  {/* Selected */}
                  <button
                    type="button"
                    onClick={() =>
                      setDropdownOpen(!dropdownOpen)
                    }
                    className="h-12 w-full rounded-2xl bg-gray-100 border border-gray-200 px-4 text-sm outline-none transition flex items-center justify-between hover:bg-gray-200"
                  >
                    <span
                      className={
                        selectedUser
                          ? "text-black"
                          : "text-gray-400"
                      }
                    >
                      {selectedUser
                        ? users.find((u) =>
                            mode === "add"
                              ? u.id ===
                                Number(selectedUser)
                              : u.user_id ===
                                Number(selectedUser),
                          )?.full_name
                        : loading
                          ? "Loading..."
                          : mode === "add"
                            ? "Select user"
                            : "Select member"}
                    </span>

                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        dropdownOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute z-50 mt-2 w-full rounded-2xl bg-white border border-gray-200 shadow-lg overflow-hidden">
                      <div className="max-h-60 overflow-auto py-2">
                        {users.map((user) => (
                          <button
                            key={
                              mode === "add"
                                ? user.id
                                : user.user_id
                            }
                            type="button"
                            onClick={() => {
                              setSelectedUser(
                                mode === "add"
                                  ? user.id
                                  : user.user_id,
                              );

                              setDropdownOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 transition flex flex-col"
                          >
                            <span className="text-sm font-medium text-black">
                              {user.full_name}
                            </span>

                            <span className="text-xs text-gray-500">
                              {user.email}
                            </span>
                          </button>
                        ))}

                        {users.length === 0 &&
                          !loading && (
                            <p className="px-4 py-3 text-sm text-gray-500">
                              {mode === "add"
                                ? "No users available"
                                : "No members found"}
                            </p>
                          )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 px-2">
            <button
              onClick={handleClose}
              className="h-9 px-5 rounded-2xl border border-black/5 bg-white/50 text-sm font-medium hover:bg-white/80 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={assignLoading}
              className="h-9 px-5 rounded-2xl bg-black text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
            >
              {assignLoading
                ? mode === "add"
                  ? "Adding..."
                  : "Removing..."
                : mode === "add"
                  ? "Add"
                  : "Remove"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AssignProject;
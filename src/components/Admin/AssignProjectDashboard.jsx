import { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";

function AssignProjectDashboard({ open, setOpen }) {
  const { token } = useAuth();

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);

  const [selectedProject, setSelectedProject] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const [loading, setLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);

  const [projectDropdownOpen, setProjectDropdownOpen] =
    useState(false);

  const [userDropdownOpen, setUserDropdownOpen] =
    useState(false);

  // ================= Close =================
  const handleClose = () => {
    setOpen(false);

    setSelectedProject("");
    setSelectedUser("");

    setProjectDropdownOpen(false);
    setUserDropdownOpen(false);

    setProjectMembers([]);
  };

  // ================= Fetch Projects =================
  const getProjects = async () => {
    try {
      const response = await axios.get(`${URL}/projects/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setProjects(response?.data?.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch projects",
      );
    }
  };

  // ================= Fetch Users =================
  const getUsers = async () => {
    try {
      const response = await axios.get(`${URL}/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setUsers(response?.data?.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch users",
      );
    }
  };

  // ================= Fetch Project Members =================
  const getProjectMembers = async (projectId) => {
    try {
      const response = await axios.get(
        `${URL}/projects/${projectId}/members`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      setProjectMembers(response?.data?.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch project members",
      );
    }
  };

  // ================= Load Initial Data =================
  useEffect(() => {
    if (open) {
      getProjects();
      getUsers();
    }
  }, [open]);

  // ================= Assigned User Filter =================
  const assignedUserIds = projectMembers.map(
    (member) => member.user_id || member.id,
  );

  const filteredManagers = users.filter(
    (user) =>
      (user.role === "admin" ||
        user.role === "manager") &&
      !assignedUserIds.includes(user.id),
  );

  const filteredEmployees = users.filter(
    (user) =>
      user.role === "user" &&
      !assignedUserIds.includes(user.id),
  );

  // ================= Submit =================
  const handleSubmit = async () => {
    if (!selectedProject) {
      toast.error("Please select a project");
      return;
    }

    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }

    try {
      setAssignLoading(true);

      const response = await axios.post(
        `${URL}/projects/${selectedProject}/members`,
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

      toast.success(
        response?.data?.message ||
          "User assigned successfully",
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
        <div className="w-full max-w-sm rounded-[30px] border border-white/30 bg-white/20 p-3 backdrop-blur-xl">
          {/* Inner Glass Card */}
          <div className="rounded-[28px] bg-[#f7f7f7]/80 backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5">
              <p className="text-lg font-medium">
                Assign Project
              </p>

              <button
                onClick={handleClose}
                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/60"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-5 p-6">
              {/* ================= Project Dropdown ================= */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Select Project
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setProjectDropdownOpen(
                        !projectDropdownOpen,
                      )
                    }
                    className="flex h-12 w-full items-center justify-between rounded-2xl border border-gray-200 bg-gray-100 px-4 text-sm outline-none transition hover:bg-gray-200"
                  >
                    <span
                      className={
                        selectedProject
                          ? "text-black"
                          : "text-gray-400"
                      }
                    >
                      {selectedProject
                        ? projects.find(
                            (project) =>
                              project.id ===
                              Number(selectedProject),
                          )?.name
                        : loading
                          ? "Loading..."
                          : "Select project"}
                    </span>

                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        projectDropdownOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  {projectDropdownOpen && (
                    <div className="absolute z-[9999] mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
                      <div className="max-h-60 overflow-auto py-2">
                        {projects.map((project) => (
                          <button
                            key={project.id}
                            type="button"
                            onClick={() => {
                              setSelectedProject(
                                project.id,
                              );

                              setSelectedUser("");

                              getProjectMembers(
                                project.id,
                              );

                              setProjectDropdownOpen(
                                false,
                              );
                            }}
                            className="w-full px-4 py-3 text-left transition hover:bg-gray-100"
                          >
                            <span className="text-sm font-medium text-black">
                              {project.name}
                            </span>
                          </button>
                        ))}

                        {projects.length === 0 &&
                          !loading && (
                            <p className="px-4 py-3 text-sm text-gray-500">
                              No projects found
                            </p>
                          )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ================= User Dropdown ================= */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Select User
                </label>

                <div className="relative">
                  <button
                    type="button"
                    disabled={!selectedProject}
                    onClick={() =>
                      setUserDropdownOpen(
                        !userDropdownOpen,
                      )
                    }
                    className="flex h-12 w-full items-center justify-between rounded-2xl border border-gray-200 bg-gray-100 px-4 text-sm outline-none transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span
                      className={
                        selectedUser
                          ? "text-black"
                          : "text-gray-400"
                      }
                    >
                      {selectedUser
                        ? users.find(
                            (u) =>
                              u.id ===
                              Number(selectedUser),
                          )?.full_name
                        : "Select user"}
                    </span>

                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        userDropdownOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  {userDropdownOpen && (
                    <div className="absolute z-[9999] mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
                      <div className="max-h-72 overflow-auto">
                        {/* Managers */}
                        <div className="border-b border-gray-100 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Managers
                        </div>

                        {filteredManagers.length >
                        0 ? (
                          filteredManagers.map(
                            (user) => (
                              <button
                                key={user.id}
                                type="button"
                                onClick={() => {
                                  setSelectedUser(
                                    user.id,
                                  );

                                  setUserDropdownOpen(
                                    false,
                                  );
                                }}
                                className="w-full px-4 py-3 text-left transition hover:bg-gray-100"
                              >
                                <span className="text-sm font-medium text-black">
                                  {user.full_name}
                                </span>
                              </button>
                            ),
                          )
                        ) : (
                          <p className="px-4 py-3 text-sm text-gray-500">
                            No managers available
                          </p>
                        )}

                        {/* Employees */}
                        <div className="border-y border-gray-100 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Employees
                        </div>

                        {filteredEmployees.length >
                        0 ? (
                          filteredEmployees.map(
                            (user) => (
                              <button
                                key={user.id}
                                type="button"
                                onClick={() => {
                                  setSelectedUser(
                                    user.id,
                                  );

                                  setUserDropdownOpen(
                                    false,
                                  );
                                }}
                                className="w-full px-4 py-3 text-left transition hover:bg-gray-100"
                              >
                                <span className="text-sm font-medium text-black">
                                  {user.full_name}
                                </span>
                              </button>
                            ),
                          )
                        ) : (
                          <p className="px-4 py-3 text-sm text-gray-500">
                            No employees available
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
          <div className="flex justify-end gap-3 px-2 pt-4">
            <button
              onClick={handleClose}
              className="h-9 cursor-pointer rounded-2xl border border-black/5 bg-white/50 px-5 text-sm font-medium transition hover:bg-white/80"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={assignLoading}
              className="h-9 cursor-pointer rounded-2xl bg-black px-5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {assignLoading
                ? "Assigning..."
                : "Assign"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AssignProjectDashboard;
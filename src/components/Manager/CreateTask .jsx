import { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";

function CreateTask({
  open,
  setOpen,
  projectId,
  refreshTasks,
  mode = "create",
  editTask = null,
}) {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
    assigned_to: "",
  });

  // ================= CLOSE =================
  const handleClose = () => {
    setOpen(false);

    setFormData({
      title: "",
      description: "",
      priority: "medium",
      due_date: "",
      assigned_to: "",
    });

    setDropdownOpen(false);
    setPriorityDropdownOpen(false);
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

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= CREATE TASK =================
  const handleSubmit = async () => {
    if (!formData.title || !formData.due_date) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setCreateLoading(true);

      let response;

      // ================= CREATE =================
      if (mode === "create") {
        if (!formData.assigned_to) {
          toast.error("Please assign user");
          return;
        }

        response = await axios.post(
          `${URL}/tasks/`,
          {
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            due_date: formData.due_date,
            assigned_to: Number(formData.assigned_to),
            project_id: Number(projectId),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );
      }

      // ================= EDIT =================
      else {
        response = await axios.put(
          `${URL}/tasks/${editTask.id}`,
          {
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            due_date: formData.due_date,
          },
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
          (mode === "edit"
            ? "Task updated successfully"
            : "Task created successfully"),
      );

      handleClose();

      if (refreshTasks) {
        refreshTasks();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          (mode === "edit" ? "Failed to update task" : "Failed to create task"),
      );
    } finally {
      setCreateLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "edit" && editTask) {
      setFormData({
        title: editTask.title || "",
        description: editTask.description || "",
        priority: editTask.priority || "medium",
        due_date: editTask.due_date || "",
        assigned_to: editTask.assigned_to || "",
      });
    }
  }, [mode, editTask]);
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[6px] p-4">
        {/* Outer Glass */}
        <div className="w-full max-w-xl rounded-[30px] bg-white/20 border border-white/30 p-3 backdrop-blur-xl">
          {/* Inner Glass */}
          <div className="rounded-[28px] bg-[#f7f7f7]/80 backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5">
              <p className="text-lg font-medium">
                {mode === "edit" ? "Edit Task" : "Create Task"}
              </p>
              <button
                onClick={handleClose}
                className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white/60 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 pb-6 space-y-5">
              {/* Title */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Task Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                  className="h-12 rounded-2xl bg-gray-100 border border-gray-200 px-4 text-sm outline-none"
                />
              </div>

              {/* Assign User */}
              {mode === "create" && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Assign To
                  </label>

                  <div className="relative">
                    {/* Selected */}
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="h-12 w-full rounded-2xl bg-gray-100 border border-gray-200 px-4 text-sm outline-none transition flex items-center justify-between hover:bg-gray-200"
                    >
                      <span
                        className={
                          formData.assigned_to ? "text-black" : "text-gray-400"
                        }
                      >
                        {formData.assigned_to
                          ? users.find(
                              (u) => u.user_id === Number(formData.assigned_to),
                            )?.full_name
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
                      <div className="absolute left-0 top-full z-9999 mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                        <div className="max-h-60 overflow-y-auto">
                          {users.filter(
                            (user) => user.role_in_project === "user",
                          ).length > 0 ? (
                            users
                              .filter((user) => user.role_in_project === "user")
                              .map((user) => (
                                <button
                                  key={user.user_id}
                                  type="button"
                                  onClick={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      assigned_to: user.user_id,
                                    }));

                                    setDropdownOpen(false);
                                  }}
                                  className="w-full px-4 py-3 text-left transition hover:bg-gray-100 flex flex-col border-b border-gray-100 last:border-b-0"
                                >
                                  <span className="text-sm font-medium text-black">
                                    {user.full_name}
                                  </span>

                                  <span className="text-xs text-gray-500">
                                    {user.email}
                                  </span>
                                </button>
                              ))
                          ) : (
                            <p className="px-4 py-3 text-sm text-gray-500">
                              No users found
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  rows={4}
                  className="rounded-2xl bg-gray-100 border border-gray-200 px-4 py-3 text-sm outline-none resize-none"
                />
              </div>

              {/* Priority + Due Date */}
              <div className="grid grid-cols-2 gap-4">
                {/* Priority */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Priority
                  </label>

                  <div className="relative">
                    {/* Selected */}
                    <button
                      type="button"
                      onClick={() =>
                        setPriorityDropdownOpen(!priorityDropdownOpen)
                      }
                      className="h-12 w-full rounded-2xl bg-gray-100 border border-gray-200 px-4 text-sm outline-none transition flex items-center justify-between hover:bg-gray-200"
                    >
                      <span className="capitalize text-black">
                        {formData.priority}
                      </span>

                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          priorityDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown */}
                    {priorityDropdownOpen && (
                      <div className="absolute left-0 top-full z-9999 mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                        <div className="max-h-60 overflow-y-auto">
                          {[
                            {
                              label: "Low",
                              value: "low",
                              color: "bg-green-500",
                            },
                            {
                              label: "Medium",
                              value: "medium",
                              color: "bg-yellow-500",
                            },
                            {
                              label: "High",
                              value: "high",
                              color: "bg-red-500",
                            },
                          ].map((priority) => (
                            <button
                              key={priority.value}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  priority: priority.value,
                                }));

                                setPriorityDropdownOpen(false);
                              }}
                              className="w-full px-4 py-3 text-left transition hover:bg-gray-100 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                            >
                              <div
                                className={`h-3 w-3 rounded-full ${priority.color}`}
                              />

                              <span className="text-sm font-medium text-black">
                                {priority.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Due Date */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Due Date
                  </label>

                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    className="h-12 rounded-2xl bg-gray-100 border border-gray-200 px-4 text-sm outline-none"
                  />
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
              disabled={createLoading}
              className="h-9 px-5 rounded-2xl bg-black text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
            >
              {createLoading
                ? mode === "edit"
                  ? "Updating..."
                  : "Creating..."
                : mode === "edit"
                  ? "Update"
                  : "Create"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateTask;

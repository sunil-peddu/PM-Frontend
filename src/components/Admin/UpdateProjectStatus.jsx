import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";

function UpdateProjectStatus({ open, setOpen, project, getProjects }) {
  const { token } = useAuth();

  const [status, setStatus] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const statuses = ["active", "completed", "on_hold"];

  const statusConfig = {
    active: {
      color: "bg-green-500",
      label: "Active",
    },
    completed: {
      color: "bg-blue-500",
      label: "Completed",
    },
    on_hold: {
      color: "bg-amber-500",
      label: "On Hold",
    },
  };
  useEffect(() => {
    if (project) {
      setStatus(project.status);
    }
  }, [project]);

  const handleClose = () => {
    setOpen(false);
    setDropdownOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await axios.patch(
        `${URL}/projects/${project.id}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      toast.success("Project status updated");

      getProjects();

      handleClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update project status",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[6px] p-4">
      <div className="w-full max-w-sm rounded-[30px] bg-white/20 border border-white/30 p-3 backdrop-blur-xl">
        <div className="rounded-[28px] bg-[#f7f7f7]/80 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5">
            <p className="text-lg font-medium">Update Project Status</p>

            <button
              onClick={handleClose}
              className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white/60 transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <label className="text-sm font-medium text-gray-700">Status</label>

            <div className="relative mt-2">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="h-12 w-full rounded-2xl bg-gray-100 border border-gray-200 px-4 text-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  {status && (
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        statusConfig[status]?.color
                      }`}
                    />
                  )}

                  <span>
                    {status ? statusConfig[status]?.label : "Select Status"}
                  </span>
                </div>

                <ChevronDown
                  size={16}
                  className={`transition ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute mt-2 w-full rounded-2xl bg-white border border-gray-200 shadow-lg overflow-hidden">
                  {statuses.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setStatus(item);
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 transition"
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          statusConfig[item].color
                        }`}
                      />

                      <span className="font-medium">
                        {statusConfig[item].label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 px-2">
          <button
            onClick={handleClose}
            className="h-9 px-5 rounded-2xl border border-black/5 bg-white/50 text-sm font-medium"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="h-9 px-5 rounded-2xl bg-black text-white text-sm font-medium"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateProjectStatus;

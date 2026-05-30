import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { X, RefreshCw, Circle, Clock3, CheckCircle2 } from "lucide-react";

import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";

function UpdateTaskStatus({ open, setOpen, task, refreshTasks }) {
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // ================= INITIALIZE STATUS =================
  useEffect(() => {
    if (task?.status) {
      setStatus(task.status);
    }
  }, [task]);

  // ================= CLOSE =================
  const handleClose = () => {
    setOpen(false);
    setStatus("");
  };

  // ================= UPDATE STATUS =================
  const updateStatus = async () => {
    if (!status) {
      toast.error("Please select a status");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.patch(
        `${URL}/tasks/${task.id}/status`,
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

      toast.success(response?.data?.message || "Status updated successfully");

      refreshTasks?.();

      handleClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !task) return null;

  const statuses = [
    {
      value: "todo",
      label: "Todo",
      description: "Task has not been started yet",
      icon: Circle,
      color: "bg-gray-50 border-gray-200 text-gray-700",
    },
    {
      value: "in_progress",
      label: "In Progress",
      description: "Task is currently being worked on",
      icon: Clock3,
      color: "bg-yellow-50 border-yellow-200 text-yellow-700",
    },
    {
      value: "done",
      label: "Done",
      description: "Task has been completed",
      icon: CheckCircle2,
      color: "bg-green-50 border-green-200 text-green-700",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[6px] p-4">
      {/* Outer Glass Layer */}
      <div className="w-full max-w-lg rounded-[30px] bg-white/20 border border-white/30 p-3 backdrop-blur-xl">
        {/* Inner Layer */}
        <div className="rounded-[28px] bg-white flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                <RefreshCw size={18} />
              </div>

              <div>
                <p className="text-lg font-medium">Update Status</p>

                <p className="text-sm text-gray-500 mt-1">{task?.title}</p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-3">
            {statuses.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.value}
                  onClick={() => setStatus(item.value)}
                  className={`w-full text-left flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer
                    ${
                      status === item.value
                        ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50"
                        : item.color
                    }`}
                >
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center
                      ${
                        status === item.value
                          ? "bg-blue-100 text-blue-700"
                          : "bg-white"
                      }`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">{item.label}</p>

                    <p className="text-xs text-gray-500 mt-1">
                      {item.description}
                    </p>
                  </div>

                  {status === item.value && (
                    <div className="h-3 w-3 rounded-full bg-blue-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <button
              onClick={updateStatus}
              disabled={loading}
              className="button_bg w-full justify-center"
            >
              <RefreshCw size={18} />

              {loading ? "Updating Status..." : "Update Status"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateTaskStatus;

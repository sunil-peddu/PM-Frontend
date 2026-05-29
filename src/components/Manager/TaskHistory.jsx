import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { X, History, User2, CalendarDays, ArrowRight } from "lucide-react";

import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";

function TaskHistory({ open, setOpen, task }) {
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  // ================= CLOSE =================
  const handleClose = () => {
    setOpen(false);
    setHistoryData([]);
  };

  // ================= FETCH HISTORY =================
  const getTaskHistory = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${URL}/tasks/${task.id}/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setHistoryData(response.data.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch task history",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && task?.id) {
      getTaskHistory();
    }
  }, [open, task]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[6px] p-4">
      {/* Outer */}
      <div className="w-full max-w-2xl rounded-[30px] bg-white/20 border border-white/30 p-3 backdrop-blur-xl">
        {/* Inner */}
        <div className="rounded-[28px] bg-[#f7f7f7]/80 backdrop-blur-xl flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <div>
              <p className="text-lg font-medium">Task History</p>

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
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {loading ? (
              <div className="text-center py-10 text-gray-500">
                Loading history...
              </div>
            ) : historyData.length > 0 ? (
              <div className="space-y-4">
                {historyData.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
                  >
                    {/* Top */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center">
                          <History size={18} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-800 capitalize">
                            {item.change_type}
                          </p>

                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <User2 size={13} />
                            <span>{item.changed_by_name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <CalendarDays size={13} />
                        <span>{item.changed_at}</span>
                      </div>
                    </div>

                    {/* Change Values */}
                    <div className="mt-4 flex items-center gap-3 flex-wrap">
                      <div className="px-3 py-2 rounded-xl bg-red-50 text-red-700 text-sm">
                        {item.old_value}
                      </div>

                      <ArrowRight size={16} className="text-gray-400" />

                      <div className="px-3 py-2 rounded-xl bg-green-50 text-green-700 text-sm">
                        {item.new_value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No history found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskHistory;

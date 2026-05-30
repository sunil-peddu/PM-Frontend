import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { X, Send, MessageCircle, User2, CalendarDays } from "lucide-react";

import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";

function TaskComments({ open, setOpen, task }) {
  const { token } = useAuth();

  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= CLOSE =================
  const handleClose = () => {
    setOpen(false);
    setComments([]);
    setContent("");
  };

  // ================= FETCH COMMENTS =================
  const getComments = async () => {
    try {
      const response = await axios.get(`${URL}/tasks/${task.id}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setComments(response.data.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch comments");
    }
  };

  // ================= CREATE COMMENT =================
  const createComment = async () => {
    if (!content.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${URL}/tasks/${task.id}/comments`,
        {
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      toast.success(response?.data?.message || "Comment added successfully");

      setContent("");

      getComments();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && task?.id) {
      getComments();
    }
  }, [open, task]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[6px] p-4">
      {/* Outer Glass Layer */}
      <div className="w-full max-w-2xl rounded-[30px] bg-white/20 border border-white/30 p-3 backdrop-blur-xl">
        {/* Inner Layer */}
        <div className="rounded-[28px] bg-white flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                <MessageCircle size={18} />
              </div>

              <div>
                <p className="text-lg font-medium">Task Comments</p>

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

          {/* Add Comment */}
          <div className="px-6 py-5 ">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <User2 size={18} />
              </div>

              <div className="flex-1 relative">
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your comments here..."
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-14 outline-none "
                />

                <button
                  onClick={createComment}
                  disabled={loading}
                  className="absolute right-3 bottom-3 h-9 w-9 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition cursor-pointer"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-5 px-6 py-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                {/* User Icon */}
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0
  ${
    comment.author_role === "manager"
      ? "bg-blue-100 text-blue-700"
      : "bg-green-100 text-green-700"
  }`}
                >
                  <User2 size={18} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-gray-800">
                      {comment.author_name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {comment.created_at}
                    </p>
                  </div>

                  <p className="text-xs text-blue-600 capitalize mt-1">
                    {comment.author_role}
                  </p>

                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskComments;

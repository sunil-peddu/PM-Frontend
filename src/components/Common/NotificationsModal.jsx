import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Bell, RefreshCcw, CheckCheck, BellRing } from "lucide-react";

import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";

function NotificationsDropdown() {
  const { token } = useAuth();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const getNotifications = useCallback(async () => {
    try {
      const response = await axios.get(`${URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setNotifications(response?.data?.data?.notifications || []);
      setUnreadCount(response?.data?.data?.unread_count || 0);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch notifications",
      );
    }
  }, [token]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `${URL}/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      getNotifications();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to mark notification as read",
      );
    }
  };

  const markAllRead = async () => {
    try {
      await axios.patch(
        `${URL}/notifications/read-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      toast.success("All notifications marked as read");

      getNotifications();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to mark all notifications",
      );
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(getNotifications, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [getNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedButton = buttonRef.current?.contains(event.target);
      const clickedDropdown = dropdownRef.current?.contains(event.target);

      if (!clickedButton && !clickedDropdown) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdown = (
    <div
      ref={dropdownRef}
      className="fixed top-20 right-5 w-95 max-w-[calc(100vw-2.5rem)] bg-black/10 p-3 backdrop-blur-lg rounded-4xl"
      style={{ zIndex: 99999 }}
    >
      <div className="rounded-4xl bg-white border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.18)] p-3">
        <div className="rounded-3xl bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">
                Notifications
              </h3>

              <p className="text-xs text-gray-500">{unreadCount} unread</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={getNotifications}
                className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <RefreshCcw size={15} />
              </button>

              <button
                onClick={markAllRead}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium"
              >
                <CheckCheck size={14} />
                Mark All
              </button>
            </div>
          </div>

          <div className="max-h-113 overflow-y-auto p-3 space-y-3">
            {notifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                <BellRing size={36} />
                <p className="mt-2 text-sm">No notifications found</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => {
                    if (!notification.is_read) {
                      markAsRead(notification.id);
                    }
                  }}
                  className={`rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md
                    ${
                      notification.is_read
                        ? "bg-white border-gray-200"
                        : "bg-blue-50 border-blue-200"
                    }`}
                >
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {notification.message}
                  </p>

                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(notification.created_at).toLocaleDateString()} -{" "}
                    {new Date(notification.created_at).toLocaleTimeString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={buttonRef} className="relative">
      <button
        onClick={() => {
          setOpen((prev) => !prev);

          if (!open) {
            getNotifications();
          }
        }}
        className="hover:bg-white/70 p-2 rounded-full relative transition-all cursor-pointer"
      >
        <Bell size={18} className="text-gray-500" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-semibold">
            {unreadCount}
          </span>
        )}
      </button>

      {open && createPortal(dropdown, document.body)}
    </div>
  );
}

export default NotificationsDropdown;

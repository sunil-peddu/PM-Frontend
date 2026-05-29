import { useEffect, useState } from "react";
import { X, Eye, EyeOff, Shield, User, Mail, BadgeCheck } from "lucide-react";

import axios from "axios";
import toast from "react-hot-toast";

import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";

function ProfileModal({ open, setOpen }) {
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profile, setProfile] = useState(null);

  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  // ================= CLOSE =================
  const handleClose = () => {
    setOpen(false);

    setShowPasswordSection(false);

    setPasswordData({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });
  };

  // ================= GET PROFILE =================
  const getProfile = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${URL}/users/me/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setProfile(response?.data?.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      getProfile();
    }
  }, [open]);

  // ================= HANDLE PASSWORD CHANGE =================
  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= UPDATE PASSWORD =================
  const updatePassword = async () => {
    if (
      !passwordData.current_password ||
      !passwordData.new_password ||
      !passwordData.confirm_password
    ) {
      toast.error("Please fill all password fields");

      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("Passwords do not match");

      return;
    }

    try {
      setPasswordLoading(true);

      const response = await axios.put(
        `${URL}/users/me/password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      toast.success(response?.data?.message || "Password updated successfully");

      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      setShowPasswordSection(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update password",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[6px] p-4">
      {/* Outer */}
      <div className="w-full max-w-lg rounded-[30px] bg-white/20 border border-white/30 p-3 backdrop-blur-xl">
        {/* Inner */}
        <div className="rounded-[28px] bg-[#f7f7f7]/80 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5">
            <p className="text-lg font-medium">Profile Details</p>

            <button
              onClick={handleClose}
              className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white/60 transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 pb-6">
            {loading ? (
              <div className="py-10 text-center text-gray-500">
                Loading profile...
              </div>
            ) : (
              <div className="space-y-5">
                {/* Profile Info */}
                <div className="space-y-4">
                  {/* Name */}
                  <div className="rounded-2xl bg-gray-100 border border-gray-200 p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                      <User size={18} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>

                      <p className="text-sm font-medium">
                        {profile?.full_name || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="rounded-2xl bg-gray-100 border border-gray-200 p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                      <Mail size={18} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Email</p>

                      <p className="text-sm font-medium">
                        {profile?.email || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="rounded-2xl bg-gray-100 border border-gray-200 p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                      <BadgeCheck size={18} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Role</p>

                      <p className="text-sm font-medium capitalize">
                        {profile?.role || "-"}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Change Password */}
                <div>
                  <button
                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                    className="w-full h-11 rounded-2xl bg-black text-white text-sm font-medium hover:opacity-90 transition"
                  >
                    {showPasswordSection
                      ? "Hide Password Fields"
                      : "Change Password"}
                  </button>
                </div>
                {/* Password Fields */}
                {showPasswordSection && (
                  <div className="flex flex-wrap gap-4 pt-2">
                    {/* Current */}
                    <div className="flex-1 min-w-45">
                      <PasswordField
                        label="Current Password"
                        name="current_password"
                        value={passwordData.current_password}
                        onChange={handlePasswordChange}
                        show={showPasswords.current}
                        toggle={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            current: !prev.current,
                          }))
                        }
                      />
                    </div>

                    {/* New */}
                    <div className="flex-1 min-w-45">
                      <PasswordField
                        label="New Password"
                        name="new_password"
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                        show={showPasswords.new}
                        toggle={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                      />
                    </div>

                    {/* Confirm */}
                    <div className="flex-1 min-w-45">
                      <PasswordField
                        label="Confirm Password"
                        name="confirm_password"
                        value={passwordData.confirm_password}
                        onChange={handlePasswordChange}
                        show={showPasswords.confirm}
                        toggle={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                      />
                    </div>

                    {/* Button */}
                    <button
                      onClick={updatePassword}
                      disabled={passwordLoading}
                      className="flex-1 min-w-45 h-12 mt-7 rounded-2xl bg-black text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
                    >
                      {passwordLoading ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= PASSWORD FIELD =================
function PasswordField({ label, name, value, onChange, show, toggle }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="h-12 w-full rounded-2xl bg-gray-100 border border-gray-200 px-4 pr-12 text-sm outline-none"
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default ProfileModal;

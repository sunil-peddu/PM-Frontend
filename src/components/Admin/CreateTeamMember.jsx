import { useState } from "react";
import { Dialog, DialogContent, TextField } from "@mui/material";
import { X, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";

function CreateTeamMember({ open, setOpen, selectedRole, getUsers }) {
  const { token } = useAuth();

  const [createLoading, setCreateLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setCreateLoading(true);

      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        role: selectedRole, // manager or user
      };

      const response = await axios.post(`${URL}/users/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      toast.success(response?.data?.message || "User created successfully");

      setOpen(false);

      setFormData({
        full_name: "",
        email: "",
        password: "",
      });

      getUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create user");
    } finally {
      setCreateLoading(false);
    }
  };

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#d1d5db",
      },

      "&:hover fieldset": {
        borderColor: "#d1d5db",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#d1d5db",
        borderWidth: "1px",
      },
    },

    "& .MuiInputLabel-root": {
      color: "#6b7280",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#000000",
    },
  };
  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogContent className="p-0!">
        {/* Header */}
        <div className="flex justify-between items-center p-4 ">
          <p className="text-sm font-semibold">
            Create {selectedRole === "manager" ? "Manager" : "Employee"}
          </p>

          <button onClick={() => setOpen(false)} className="cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 grid grid-cols-1 gap-4">
          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            sx={textFieldStyle}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={textFieldStyle}
          />

          <div className="relative">
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={textFieldStyle}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100">
          <button onClick={() => setOpen(false)} className="form_button_n">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={createLoading}
            className="form_button_bg"
          >
            {createLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTeamMember;

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";

function CreateProject({
  open,
  setOpen,
  getProjects,
  isEdit = false,
  editData = null,
}) {
  const { token } = useAuth();

  const [createLoading, setCreateLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    due_date: "",
    description: "",
  });

  // Close Modal
  const handleClose = () => {
    setOpen(false);

    setFormData({
      name: "",
      due_date: "",
      description: "",
    });
  };

  // Handle Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (isEdit && editData) {
      setFormData({
        name: editData.name || "",
        due_date: editData.due_date?.split("T")[0] || "",
        description: editData.description || "",
      });
    }
  }, [isEdit, editData]);
  // Submit
  const handleSubmit = async () => {
    if (createLoading) return;

    // Validation
    if (!formData.name || !formData.due_date || !formData.description) {
      toast.error("All fields are required");
      return;
    }

    try {
      setCreateLoading(true);

      const payload = {
        name: formData.name,
        due_date: formData.due_date,
        description: formData.description,
      };

      let response;

      if (isEdit) {
        response = await axios.put(`${URL}/projects/${editData.id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      } else {
        response = await axios.post(`${URL}/projects/`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      }

      toast.success(response?.data?.message || "Project created successfully");

      handleClose();

      getProjects();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create project");
    } finally {
      setCreateLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[6px] p-4">
        {/* Outer Glass Layer */}
        <div className="w-full max-w-2xl rounded-[30px] bg-white/20 border border-white/30 p-3 backdrop-blur-xl">
          {/* Inner Glass Card */}
          <div className="rounded-[28px] bg-[#f7f7f7]/80 backdrop-blur-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5  border-black/5">
              {isEdit ? "Edit Project" : "Create Project"}

              <button
                onClick={handleClose}
                className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white/60 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* First Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Project Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Project Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter project name"
                    className="h-12 rounded-2xl bg-white/60 border border-black/5 px-4 text-sm outline-none transition focus:border-black/20"
                  />
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
                    className="h-12 rounded-2xl bg-white/60 border border-black/5 px-4 text-sm outline-none transition focus:border-black/20"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  rows={6}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write project description..."
                  className="rounded-2xl bg-white/60 border border-black/5 p-4 text-sm outline-none resize-none transition focus:border-black/20"
                />
              </div>
            </div>
          </div>

          {/* Footer OUTSIDE inner layer */}
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
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                  ? "Update Project"
                  : "Create Project"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateProject;

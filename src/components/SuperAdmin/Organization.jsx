import { Plus, X, SquarePen, Power } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";
import { Dialog, DialogContent, TextField } from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Organization() {
  const { token } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const hasFetched = useRef(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact_number: "",
    admin_email: "",
  });
  //organization api
  const getOrganizations = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${URL}/organizations/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      // Store API response
      setOrganizations(response.data.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch organizations",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (org) => {
    setEditMode(true);

    setSelectedOrganizationId(org.id);

    setFormData({
      name: org.name || "",
      address: org.address || "",
      contact_number: org.contact_number || "",
      admin_email: org.admin_email || "",
    });

    setOpen(true);
  };
  //update org api
  const updateOrganization = async () => {
    try {
      setCreateLoading(true);

      const response = await axios.put(
        `${URL}/organizations/${selectedOrganizationId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      toast.success(
        response?.data?.message || "Organization updated successfully",
      );

      setOpen(false);

      setEditMode(false);

      setSelectedOrganizationId(null);

      setFormData({
        name: "",
        address: "",
        contact_number: "",
        admin_email: "",
      });

      getOrganizations();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update organization",
      );
    } finally {
      setCreateLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //create org
  const createOrganization = async () => {
    try {
      setCreateLoading(true);

      const response = await axios.post(`${URL}/organizations/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      toast.success(
        response?.data?.message || "Organization created successfully",
      );

      setOpen(false);

      setFormData({
        name: "",
        address: "",
        contact_number: "",
        admin_email: "",
      });

      getOrganizations();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create organization",
      );
    } finally {
      setCreateLoading(false);
    }
  };

  // update status
  const toggleOrganizationStatus = async (orgId) => {
    try {
      const response = await axios.patch(
        `${URL}/organizations/${orgId}/status`,
        {
          org_id: orgId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      toast.success(response?.data?.message || "Organization status updated");

      getOrganizations();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update organization status",
      );
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;
    getOrganizations();
  }, []);

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

  //export data
  const exportOrganizationsToExcel = () => {
    if (!organizations.length) {
      toast.error("No organizations available to export");
      return;
    }

    // Format data for excel
    const formattedData = organizations.map((org) => ({
      Name: org.name,
      Address: org.address,
      "Admin Email": org.admin_email,
      "Contact Number": org.contact_number,
      Users: org.user_count,
      Status: org.is_active ? "Active" : "Inactive",
      Created: new Date(org.created_at).toLocaleDateString(),
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Create workbook
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Organizations");

    // Generate excel buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create blob
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    // Download file
    saveAs(data, "organizations.xlsx");
  };
  return (
    <>
      <main className="w-full h-full flex flex-col gap-3 min-h-0">
        {" "}
        <header className="flex justify-between items-center">
          <div>
            <p className="text-xl font-medium pb-1">Organizations</p>
            <p className="text-sm text-gray-600">
              Manage Every Organization from One Place
            </p>
          </div>
          <div className="text-sm flex items-center gap-2">
            <button
              onClick={() => {
                setEditMode(false);

                setFormData({
                  name: "",
                  address: "",
                  contact_number: "",
                  admin_email: "",
                });

                setOpen(true);
              }}
              className="button_bg"
            >
              <Plus size={16} />
              Create Organization
            </button>
            <button onClick={exportOrganizationsToExcel} className="button_n ">
              Export Data
            </button>
          </div>
        </header>
        {/* Popup */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogContent className="p-0!">
            {/* Header */}
            <div className="flex justify-between items-center  p-4">
              <p className="text-sm font-semibold">
                {editMode ? "Edit Organization" : "Create Organization"}
              </p>

              <button onClick={() => setOpen(false)} className="cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <div className="p-4 grid grid-cols-2 gap-4">
              <TextField
                fullWidth
                label="Organization Name"
                variant="outlined"
                name="name"
                value={formData.name}
                onChange={handleChange}
                sx={textFieldStyle}
                required
              />

              <TextField
                fullWidth
                label="Admin Email"
                type="email"
                variant="outlined"
                sx={textFieldStyle}
                name="admin_email"
                value={formData.admin_email}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label="Address"
                variant="outlined"
                multiline
                rows={3}
                className="col-span-2"
                sx={textFieldStyle}
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label="Contact Number"
                variant="outlined"
                className="col-span-2"
                sx={textFieldStyle}
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                required
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3  p-4">
              <button onClick={() => setOpen(false)} className="form_button_n ">
                Cancel
              </button>

              <button
                onClick={editMode ? updateOrganization : createOrganization}
                disabled={createLoading}
                className="form_button_bg"
              >
                {createLoading ? (
                  editMode ? (
                    "Updating..."
                  ) : (
                    "Creating..."
                  )
                ) : (
                  <>{editMode ? "Update" : "Create"}</>
                )}
              </button>
            </div>
          </DialogContent>
        </Dialog>
        {/* table */}
        {/* table */}
        <section className="bg-white rounded-xl shadow-sm p-4 flex-1 min-h-0 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white border-b border-gray-200">
                <tr className="text-left">
                  <th className="py-3 px-3 font-medium">Name</th>

                  <th className="py-3 px-3 font-medium">Admin Email</th>

                  <th className="py-3 px-3 font-medium">Contact Number</th>

                  <th className="py-3 px-3 font-medium">Users</th>

                  <th className="py-3 px-3 font-medium">Created</th>

                  <th className="py-3 px-3 font-medium text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-400">
                      Loading organizations...
                    </td>
                  </tr>
                ) : organizations.length > 0 ? (
                  organizations.map((org) => (
                    <tr
                      key={org.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      {/* Name */}
                      <td className="py-3 px-3">
                        <div>
                          <p className="font-medium text-gray-800">
                            {org.name}
                          </p>

                          <p className="text-xs text-gray-500">{org.address}</p>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-3 text-gray-600">
                        {org.admin_email}
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-3 text-gray-600">
                        {org.contact_number}
                      </td>

                      {/* Users */}
                      <td className="py-3 px-3 text-gray-600">
                        {org.user_count}
                      </td>

                      {/* Created */}
                      <td className="py-3 px-3 text-gray-500 whitespace-nowrap">
                        {new Date(org.created_at).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-3">
                          {/* Edit */}
                          <button
                            onClick={() => handleEdit(org)}
                            className="cursor-pointer text-blue-600 hover:text-blue-700"
                          >
                            <SquarePen size={16} />
                          </button>

                          {/* Active / Deactive */}
                          <button
                            onClick={() => toggleOrganizationStatus(org.id)}
                            className={`cursor-pointer ${
                              org.is_active
                                ? "text-green-600 hover:text-green-700"
                                : "text-red-600 hover:text-red-700"
                            }`}
                          >
                            <Power size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-400">
                      No organizations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
export default Organization;

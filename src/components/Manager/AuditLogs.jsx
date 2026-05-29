import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ChevronDown } from "lucide-react";

import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";

function AuditLogs() {
  const { token } = useAuth();

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

  const [performedByFilter, setPerformedByFilter] = useState("");
  const [actionTypeFilter, setActionTypeFilter] = useState("");

  const [performedDropdownOpen, setPerformedDropdownOpen] = useState(false);
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false);

  // ================= Fetch Projects =================
  const getProjects = async () => {
    try {
      const response = await axios.get(`${URL}/projects/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setProjects(response?.data?.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch projects");
    }
  };

  // ================= Fetch Audit Logs =================
  const getAuditLogs = async (projectId) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${URL}/audit-logs/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      setAuditLogs(response?.data?.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch audit logs",
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= Initial Fetch =================
  useEffect(() => {
    getProjects();
  }, []);

  // ================= Filtered Logs =================
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const performedByMatch = performedByFilter
        ? log.performed_by_name === performedByFilter
        : true;

      const actionTypeMatch = actionTypeFilter
        ? log.action_type === actionTypeFilter
        : true;

      return performedByMatch && actionTypeMatch;
    });
  }, [auditLogs, performedByFilter, actionTypeFilter]);

  // ================= Unique Values =================
  const uniqueUsers = [
    ...new Set(auditLogs.map((log) => log.performed_by_name).filter(Boolean)),
  ];

  const uniqueActionTypes = [
    ...new Set(auditLogs.map((log) => log.action_type).filter(Boolean)),
  ];

  return (
    <main className="w-full h-full flex flex-col gap-3 min-h-0">
      {/* Header */}
      <header>
        <p className="text-xl font-medium pb-1">Audit Logs</p>

        <p className="text-sm text-gray-600">
          Monitor all recent system activities and actions.
        </p>
      </header>

      {/* Table Section */}
      <section className="bg-white rounded-xl shadow-sm p-4 flex-1 min-h-0 overflow-hidden flex flex-col">
        {/* Top Filters */}
        <div className="flex items-center justify-between gap-3 pb-4">
          {/* Project Dropdown */}
          <div className="relative min-w-60">
            <button
              type="button"
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 text-sm flex items-center justify-between hover:bg-gray-200 transition"
            >
              <span className="truncate">
                {selectedProject?.name || "Select Project"}
              </span>

              <ChevronDown size={14} />
            </button>

            {projectDropdownOpen && (
              <div className="absolute left-0 z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden max-h-64 overflow-y-auto">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProject(project);
                      setProjectDropdownOpen(false);

                      // Reset filters
                      setPerformedByFilter("");
                      setActionTypeFilter("");

                      // Fetch logs
                      getAuditLogs(project.id);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition"
                  >
                    {project.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Filters */}
          <div className="flex items-center gap-3">
            {/* Performed By */}
            <div className="relative min-w-45">
              <button
                type="button"
                onClick={() => setPerformedDropdownOpen(!performedDropdownOpen)}
                className="h-8 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 text-sm flex items-center justify-between hover:bg-gray-200 transition"
              >
                <span className="truncate">
                  {performedByFilter || "All Users"}
                </span>

                <ChevronDown size={14} />
              </button>

              {performedDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                  <button
                    onClick={() => {
                      setPerformedByFilter("");
                      setPerformedDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition"
                  >
                    All Users
                  </button>

                  {uniqueUsers.map((user) => (
                    <button
                      key={user}
                      onClick={() => {
                        setPerformedByFilter(user);
                        setPerformedDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition"
                    >
                      {user}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action Type */}
            <div className="relative min-w-40">
              <button
                type="button"
                onClick={() => setActionDropdownOpen(!actionDropdownOpen)}
                className="h-8 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 text-sm flex items-center justify-between hover:bg-gray-200 transition"
              >
                <span className="truncate">
                  {actionTypeFilter || "All Actions"}
                </span>

                <ChevronDown size={14} />
              </button>

              {actionDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                  <button
                    onClick={() => {
                      setActionTypeFilter("");
                      setActionDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition"
                  >
                    All Actions
                  </button>

                  {uniqueActionTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setActionTypeFilter(type);
                        setActionDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white border-b border-gray-200">
              <tr className="text-left">
                <th className="w-[40%] py-3 px-3 font-medium">Message</th>

                <th className="w-[20%] py-3 px-3 font-medium">Performed By</th>

                <th className="w-[20%] py-3 px-3 font-medium">Action Type</th>

                <th className="w-[20%] py-3 px-3 font-medium">Created At</th>
              </tr>
            </thead>

            <tbody>
              {!selectedProject ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">
                    Please select a project
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">
                    Loading audit logs...
                  </td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-3 text-gray-800 wrap-break-word">
                      {log.message}
                    </td>

                    <td className="py-3 px-3 text-gray-600">
                      {log.performed_by_name || "-"}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-1 rounded-md text-xs capitalize
                        ${
                          log.action_type === "login"
                            ? "bg-green-50 text-green-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {log.action_type}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-gray-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">
                    No audit logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default AuditLogs;

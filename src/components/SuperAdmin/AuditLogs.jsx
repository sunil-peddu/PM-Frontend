import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";

function AuditLogs() {
  const { token } = useAuth();

  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const hasFetched = useRef(false);

  const getAuditLogs = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${URL}/audit-logs/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setAuditLogs(response?.data?.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch audit logs",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;
    getAuditLogs();
  }, []);

  return (
    <>
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
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white border-b border-gray-200">
                <tr className="text-left ">
                  <th className="py-3 px-3 font-medium">Org ID</th>

                  <th className="py-3 px-3 font-medium">Message</th>

                  <th className="py-3 px-3 font-medium">Performed By</th>

                  <th className="py-3 px-3 font-medium">Action Type</th>

                  <th className="py-3 px-3 font-medium">Created At</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-400">
                      Loading audit logs...
                    </td>
                  </tr>
                ) : auditLogs?.length > 0 ? (
                  auditLogs.map((log, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-3 text-gray-600">
                        {log.org_id ?? "-"}
                      </td>

                      <td className="py-3 px-3 text-gray-800">{log.message}</td>

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
                    <td colSpan={5} className="text-center py-10 text-gray-400">
                      No audit logs found
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

export default AuditLogs;

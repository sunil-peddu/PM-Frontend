import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
function Dashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false);
  const getDashboardData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${URL}/dashboard/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      // Store API response
      setDashboardData(response.data.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch dashboard data",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;
    getDashboardData();
  }, []);

  //charts data
  const orgChartData =
    dashboardData?.org_breakdown?.map((org) => ({
      name: org.org_name,
      users: org.user_count,
    })) || [];

  const pieData = [
    {
      name: "Active",
      value: dashboardData?.stats?.active_orgs || 0,
    },
    {
      name: "Inactive",
      value: dashboardData?.stats?.inactive_orgs || 0,
    },
  ];

  const COLORS = ["#22c55e", "#ef4444"];
  return (
    <>
      <main className="w-full h-full flex flex-col gap-3 min-h-0">
        <header>
          <p className="text-xl font-medium pb-1">Dashboard</p>
          <p className="text-sm text-gray-600">
            Total Oversight Across Every Workspace.
          </p>
        </header>
        {/* stats */}
        <section>
          <div className="text-xl grid grid-cols-5 gap-2">
            <div
              className="p-4 rounded-lg shadow-sm text-white
  bg-[linear-gradient(to_top_right,#28c0ed_0%,#2bc0f0_25%,#009DFF_55%,#287af7_100%)]"
            >
              <p className="text-sm pb-2">Total Organization</p>
              <p className="font-medium">
                {dashboardData?.stats?.total_orgs ?? "-"}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm pb-2">Active Organizations</p>
              <p className="font-medium">
                {dashboardData?.stats?.active_orgs ?? "-"}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm pb-2">Total Projects</p>
              <p className="font-medium">
                {dashboardData?.stats?.total_projects ?? "-"}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm pb-2">Total Users</p>
              <p className="font-medium">
                {dashboardData?.stats?.total_users ?? "-"}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm pb-2">Total Tasks</p>
              <p className="font-medium">
                {dashboardData?.stats?.total_tasks ?? "-"}
              </p>
            </div>
          </div>
        </section>
        {/* Charts */}
        <section className="grid grid-cols-2 gap-3">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="pb-2">
              <p className="font-medium text-sm">Users Per Organization</p>

              <p className="text-xs text-gray-500">
                Organization wise user distribution
              </p>
            </div>

            <div className="h-45">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orgChartData} barCategoryGap={40}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />

                  <Bar
                    dataKey="users"
                    fill="#287af7"
                    radius={[6, 6, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="pb-2">
              <p className="font-medium text-sm">Active vs Inactive</p>

              <p className="text-xs text-gray-500">
                Organization status overview
              </p>
            </div>

            <div className="h-45 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    cornerRadius={8}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan x="50%" dy="-5" className="fill-gray-800">
                      {dashboardData?.stats?.total_orgs || 0}
                    </tspan>

                    <tspan x="50%" dy="18" className="fill-gray-500">
                      Total
                    </tspan>
                  </text>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
        {/* Recent Activity */}
        <section className="bg-white rounded-xl shadow-sm p-4 flex-1 min-h-0 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-4">
            <div>
              <p className="font-medium">Recent Activity</p>

              <p className="text-xs text-gray-500">Latest system audit logs</p>
            </div>

            <button
              onClick={() => navigate("/super-admin/audit-logs")}
              className="flex items-center gap-1 text-sm text-[#287af7] cursor-pointer"
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Activity List */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-4 space-y-2">
            {dashboardData?.recent_activity?.length > 0 ? (
              dashboardData?.recent_activity?.slice(0, 10)?.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between border-b border-gray-100 py-2"
                >
                  {/* Left */}
                  <div>
                    <p className="text-xs font-medium text-gray-800">
                      {log.message}
                    </p>

                    <p className="text-xs text-gray-500">
                      {log.performed_by_name} • {log.action_type}
                    </p>
                  </div>

                  {/* Right */}
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                No recent activity found
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
export default Dashboard;

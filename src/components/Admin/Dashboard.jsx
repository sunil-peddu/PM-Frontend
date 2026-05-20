import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ClipboardList, FolderDot } from "lucide-react";

import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
function Dashboard() {
  const { token } = useAuth();
  const hasFetched = useRef(false);
  // store full response
  const [dashboardData, setDashboardData] = useState(null);

  const getDashboardData = async () => {
    try {
      const response = await axios.get(`${URL}/dashboard/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      // store complete response data
      setDashboardData(response.data.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch dashboard data",
      );
    }
  };
  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;
    getDashboardData();
  }, []);
  const projectData = [
    {
      name: "Active",
      value: dashboardData?.stats?.active_projects || 0,
      color: "#38a0f5",
    },
    {
      name: "Completed",
      value: dashboardData?.stats?.completed_projects || 0,
      color: "#1d84d8",
    },
    {
      name: "On Hold",
      value: dashboardData?.stats?.on_hold_projects || 0,
      color: "#8ac9fa",
    },
  ];
  return (
    <>
      <main className="w-full h-full flex flex-col gap-3 min-h-0">
        <header>
          <p className="text-xl font-medium pb-1">Dashboard</p>
          <p className="text-sm text-gray-600">
            All organization activities in one place.
          </p>
        </header>
        <section className="rounded-lg border border-white/90 bg-blue-50/80 backdrop-blur-lg">
          <div className="text-lg grid grid-cols-4 gap-2 p-2">
            <div className="bg-white rounded-md p-4">
              <p className="text-sm pb-2">Total Projects</p>
              <p className="font-medium">
                {" "}
                {dashboardData?.stats?.total_projects || 0}
              </p>
            </div>
            <div className="bg-white rounded-md p-4">
              <p className="text-sm pb-2">Total Users</p>
              <p className="font-medium">
                {dashboardData?.stats?.total_users ?? "0"}
              </p>
            </div>
            <div className="bg-white rounded-md p-4">
              <p className="text-sm pb-2">Active Projects</p>
              <p className="font-medium">
                {dashboardData?.stats?.active_projects || 0}
              </p>
            </div>{" "}
            <div className="bg-white rounded-md p-4">
              <p className="text-sm pb-2">Total Tasks</p>
              <p className="font-medium">
                {dashboardData?.stats?.total_tasks || 0}
              </p>
            </div>
          </div>
        </section>
        {/* Charts Section */}
        <section className="grid grid-cols-2 gap-3">
          {/* Task Statistics */}
          <div className="rounded-lg border border-white/90 bg-blue-50/80 backdrop-blur-lg p-4">
            {/* Title + Legends */}
            <div className="flex items-center justify-between pb-6">
              <p className="text-base font-medium text-gray-800 flex gap-2 items-center">
                <span>
                  <ClipboardList
                    className="bg-white p-1 rounded-md text-blue-500"
                    size={26}
                  />
                </span>
                Task Summary
              </p>
              {/* Legends */}
              <div className="flex flex-wrap items-center justify-end gap-4 text-xs text-gray-600 max-w-[320px]">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38a0f5]"></span>
                  Todo
                </div>

                {/* In Progress */}
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1d84d8]"></span>
                  In Progress
                </div>

                {/* Completed */}
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0f5ea8]"></span>
                  Completed
                </div>

                {/* Overdue */}
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7fc4ff]"></span>
                  Overdue
                </div>
              </div>
            </div>

            {/* Graph */}
            <div className="flex items-end gap-[3px] h-20 overflow-hidden">
              {Array.from({
                length: dashboardData?.stats?.todo_tasks || 0,
              }).map((_, index) => (
                <div
                  key={`todo-${index}`}
                  className="w-1.5 h-full rounded-full bg-[#38a0f5]"
                ></div>
              ))}

              {/* In Progress */}
              {Array.from({
                length: dashboardData?.stats?.in_progress_tasks || 0,
              }).map((_, index) => (
                <div
                  key={`progress-${index}`}
                  className="w-1.5 h-full rounded-full bg-[#1d84d8]"
                ></div>
              ))}

              {/* Completed */}
              {Array.from({
                length: dashboardData?.stats?.done_tasks || 0,
              }).map((_, index) => (
                <div
                  key={`done-${index}`}
                  className="w-1.5 h-full rounded-full bg-[#0f5ea8]"
                ></div>
              ))}

              {/* Overdue */}
              {Array.from({
                length: dashboardData?.stats?.overdue_tasks || 0,
              }).map((_, index) => (
                <div
                  key={`overdue-${index}`}
                  className="w-1.5 h-full rounded-full bg-[#7fc4ff]"
                ></div>
              ))}

              {/* Empty */}
              {Array.from({
                length:
                  50 -
                  (dashboardData?.stats?.todo_tasks || 0) -
                  (dashboardData?.stats?.in_progress_tasks || 0) -
                  (dashboardData?.stats?.done_tasks || 0) -
                  (dashboardData?.stats?.overdue_tasks || 0),
              }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="w-1.5 h-full rounded-full bg-blue-100"
                ></div>
              ))}
            </div>
          </div>

          {/* Project Summary */}
          <div className="rounded-lg bg-white shadow-xs backdrop-blur-lg p-4">
            {/* Heading */}
            <div className="flex items-center justify-between pb-5">
              <p className="text-base font-medium text-gray-800">
                Project Summary
              </p>
            </div>

            <div className="flex items-center">
              {/* Left Side */}
              <div className="space-y-5">
                {/* Active */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#38a0f5]"></span>

                    <p className="text-sm text-gray-600">Active</p>
                  </div>

                  <h2 className="text-2xl font-semibold text-gray-900">
                    {dashboardData?.stats?.active_projects || 0}
                  </h2>
                </div>

                {/* Completed */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#1d84d8]"></span>

                    <p className="text-sm text-gray-600">Completed</p>
                  </div>

                  <h2 className="text-2xl font-semibold text-gray-900">
                    {dashboardData?.stats?.completed_projects || 0}
                  </h2>
                </div>

                {/* On Hold */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#8ac9fa]"></span>

                    <p className="text-sm text-gray-600">On Hold</p>
                  </div>

                  <h2 className="text-2xl font-semibold text-gray-900">
                    {dashboardData?.stats?.on_hold_projects || 0}
                  </h2>
                </div>
              </div>

              {/* Multi Ring Donut Chart */}
              <div className="w-44 h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    {/* ================= ACTIVE ================= */}

                    {/* Background Ring */}
                    <Pie
                      data={[{ value: 100 }]}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      innerRadius={58}
                      outerRadius={70}
                      stroke="none"
                    >
                      <Cell fill="#d9ecfd" />
                    </Pie>

                    {/* Progress Ring */}
                    <Pie
                      data={[
                        {
                          value: dashboardData?.stats?.active_projects || 0,
                        },
                      ]}
                      dataKey="value"
                      startAngle={90}
                      endAngle={
                        90 -
                        ((dashboardData?.stats?.active_projects || 0) /
                          Math.max(
                            dashboardData?.stats?.total_projects || 1,
                            1,
                          )) *
                          360
                      }
                      innerRadius={58}
                      outerRadius={70}
                      cornerRadius={20}
                      stroke="none"
                    >
                      <Cell fill="#38a0f5" />
                    </Pie>

                    {/* ================= COMPLETED ================= */}

                    {/* Background Ring */}
                    <Pie
                      data={[{ value: 100 }]}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      innerRadius={40}
                      outerRadius={50}
                      stroke="none"
                    >
                      <Cell fill="#e3f2fd" />
                    </Pie>

                    {/* Progress Ring */}
                    <Pie
                      data={[
                        {
                          value: dashboardData?.stats?.completed_projects || 0,
                        },
                      ]}
                      dataKey="value"
                      startAngle={90}
                      endAngle={
                        90 -
                        ((dashboardData?.stats?.completed_projects || 0) /
                          Math.max(
                            dashboardData?.stats?.total_projects || 1,
                            1,
                          )) *
                          360
                      }
                      innerRadius={40}
                      outerRadius={50}
                      cornerRadius={20}
                      stroke="none"
                    >
                      <Cell fill="#1d84d8" />
                    </Pie>

                    {/* ================= ON HOLD ================= */}

                    {/* Background Ring */}
                    <Pie
                      data={[{ value: 100 }]}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      innerRadius={22}
                      outerRadius={30}
                      stroke="none"
                    >
                      <Cell fill="#eef7ff" />
                    </Pie>

                    {/* Progress Ring */}
                    <Pie
                      data={[
                        {
                          value: dashboardData?.stats?.on_hold_projects || 0,
                        },
                      ]}
                      dataKey="value"
                      startAngle={90}
                      endAngle={
                        90 -
                        ((dashboardData?.stats?.on_hold_projects || 0) /
                          Math.max(
                            dashboardData?.stats?.total_projects || 1,
                            1,
                          )) *
                          360
                      }
                      innerRadius={22}
                      outerRadius={30}
                      cornerRadius={20}
                      stroke="none"
                    >
                      <Cell fill="#8ac9fa" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
export default Dashboard;

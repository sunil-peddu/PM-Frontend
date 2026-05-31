import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  FolderPlus,
  UserPlus,
  ListChecks,
  ArrowRight,
  UserCog,
  BriefcaseBusiness,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";
import CreateProject from "./CreateProject";
import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";
import CreateTeamMember from "./CreateTeamMember";
import AssignProjectDashboard from "./AssignProjectDashboard";
function Dashboard() {
  const { token } = useAuth();
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  // store full response
  const [dashboardData, setDashboardData] = useState(null);
  const [open, setOpen] = useState(false);
  const [assignProjectOpen, setAssignProjectOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("manager");

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

  // Use this only for checking the chart UI locally:
  // const chartStats = {
  //   todo_tasks: 8,
  //   in_progress_tasks: 12,
  //   done_tasks: 18,
  //   overdue_tasks: 4,
  //   total_tasks: 42,
  // };
  const chartStats = dashboardData?.stats || {};
  const getCount = (value) => {
    const count = Number(value || 0);
    return Number.isFinite(count) ? count : 0;
  };
  const todoTasks = getCount(chartStats.todo_tasks || chartStats.pending_tasks);
  const inProgressTasks = getCount(
    chartStats.in_progress_tasks || chartStats.ongoing_tasks,
  );
  const apiDoneTasks = getCount(
    chartStats.done_tasks || chartStats.completed_tasks,
  );
  const overdueTasks = getCount(chartStats.overdue_tasks);
  const statusTaskTotal =
    todoTasks + inProgressTasks + apiDoneTasks + overdueTasks;
  const totalTasks = Math.max(
    getCount(chartStats.total_tasks),
    statusTaskTotal,
  );
  const doneTasks =
    apiDoneTasks || (statusTaskTotal === 0 ? totalTasks : apiDoneTasks);
  const taskChartBars =
    totalTasks === 0
      ? new Array(30).fill("empty")
      : [
          {
            key: "todo",
            count: todoTasks,
          },
          {
            key: "progress",
            count: inProgressTasks,
          },
          {
            key: "done",
            count: doneTasks,
          },
          {
            key: "overdue",
            count: overdueTasks,
          },
          {
            key: "other",
            count: Math.max(totalTasks - statusTaskTotal, 0),
          },
        ].flatMap((item) =>
          new Array(
            Math.max(0, Math.round((item.count / totalTasks) * 30)),
          ).fill(item.key),
        );
  const visibleTaskBars =
    taskChartBars.length > 0
      ? taskChartBars.slice(0, 30)
      : new Array(30).fill("done");

  return (
    <>
      <main className="w-full h-full flex flex-col gap-3 min-h-0 overflow-hidden">
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
        <section className="flex-1 min-h-0 overflow-hidden grid grid-cols-3 grid-rows-[minmax(0,1fr)_auto] gap-3">
          {/* chart1 */}
          <div className="min-h-0 rounded-lg border border-white/90 bg-blue-50/80 backdrop-blur-lg p-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <p className="text-base font-medium text-gray-800 flex gap-2 items-center">
                <span>
                  <ClipboardList
                    className="bg-white p-1 rounded-md text-blue-500"
                    size={26}
                  />
                </span>
                Task Summary
              </p>
            </div>

            {/* Graph */}
            <div className="flex items-end gap-2 h-24 mb-6 overflow-hidden">
              {visibleTaskBars.map((item, index) => {
                let bg = "bg-[#38a0f5]";

                if (item === "todo") bg = "bg-[#b9e3fd]";
                if (item === "progress") bg = "bg-[#7cc7fa]";
                if (item === "done") bg = "bg-[#38a0f5]";
                if (item === "overdue") bg = "bg-[#1e7fd1]";
                if (item === "other") bg = "bg-[#94a3b8]";
                if (item === "empty") bg = "bg-[#d8efff]";

                return (
                  <div
                    key={index}
                    className={`w-3 rounded-full ${bg} transition-all duration-300`}
                    style={{
                      height: "85px",
                      opacity: totalTasks === 0 ? 0.7 : 1,
                    }}
                  />
                );
              })}
            </div>

            {/* Footer Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-2xl font-bold text-[#b9e3fd]">{todoTasks}</p>
                <p className="text-sm text-gray-500">Todo Tasks</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-[#7cc7fa]">
                  {inProgressTasks}
                </p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-[#38a0f5]">{doneTasks}</p>
                <p className="text-sm text-gray-500">Done Tasks</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-[#1e7fd1]">
                  {overdueTasks}
                </p>
                <p className="text-sm text-gray-500">Overdue</p>
              </div>
            </div>
          </div>
          {/* chart2 */}
          <div className="min-h-0 rounded-lg bg-white shadow-lg p-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <p className="text-base font-medium text-gray-800">
                Project Status
              </p>
            </div>

            {(() => {
              const completed = dashboardData?.stats?.completed_projects || 0;

              const active = dashboardData?.stats?.active_projects || 0;

              const hold = dashboardData?.stats?.on_hold_projects || 0;

              const total = completed + active + hold || 1;

              const completedPercent = (completed / total) * 100;
              const activePercent = (active / total) * 100;
              const holdPercent = (hold / total) * 100;

              return (
                <div className="flex items-center justify-between">
                  {/* Left Labels */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#38a0f5]" />
                        <p className="text-xs text-gray-500">Completed</p>
                      </div>

                      <p className="text-xl font-semibold text-gray-800 ml-4">
                        {Math.round(completedPercent)}%
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#7cc7fa]" />
                        <p className="text-xs text-gray-500">Active</p>
                      </div>

                      <p className="text-xl font-semibold text-gray-800 ml-4">
                        {Math.round(activePercent)}%
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#d8efff]" />
                        <p className="text-xs text-gray-500">On Hold</p>
                      </div>

                      <p className="text-xl font-semibold text-gray-800 ml-4">
                        {Math.round(holdPercent)}%
                      </p>
                    </div>
                  </div>

                  {/* Multi Donut */}

                  <div className="relative w-50 h-40 flex items-center justify-center">
                    {/* OUTER RING */}
                    <div
                      className="absolute w-40 h-40 rounded-full"
                      style={{
                        background: `conic-gradient(
        from -90deg,
        #38a0f5 0% ${completedPercent}%,
        #e8f4fd ${completedPercent}% 100%
      )`,
                      }}
                    />

                    {/* White gap */}
                    <div className="absolute w-32 h-32 bg-white rounded-full" />

                    {/* MIDDLE RING */}
                    <div
                      className="absolute w-28 h-28 rounded-full"
                      style={{
                        background: `conic-gradient(
        from 20deg,
        #7cc7fa 0% ${activePercent}%,
        #eef7fe ${activePercent}% 100%
      )`,
                      }}
                    />

                    {/* White gap */}
                    <div className="absolute w-20 h-20 bg-white rounded-full" />

                    {/* INNER RING */}
                    <div
                      className="absolute w-16 h-16 rounded-full"
                      style={{
                        background: `conic-gradient(
        from 120deg,
        #b9e3fd 0% ${holdPercent}%,
        #f3f9fe ${holdPercent}% 100%
      )`,
                      }}
                    />

                    {/* Center white */}
                    <div className="absolute w-8 h-8 bg-white rounded-full" />
                  </div>
                </div>
              );
            })()}
          </div>
          {/* audit logs */}
          <div className="min-h-0 row-span-2 rounded-lg border border-white/90 bg-blue-50/80 backdrop-blur-lg p-4 overflow-hidden flex flex-col">
            <div className="flex justify-between items-start">
              <p className="text-base font-medium text-gray-800">
                Recent Activity
              </p>
              <div>
                <p
                  className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer"
                  onClick={() => navigate("/admin/logs")}
                >
                  {" "}
                  View all
                  <ArrowRight size={14} />
                </p>
              </div>
            </div>

            <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
              {dashboardData?.recent_activity?.length > 0 ? (
                dashboardData.recent_activity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between rounded-md border border-gray-300 p-3"
                  >
                    {/* Left Side */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 line-clamp-1">
                        {activity.message}
                      </p>

                      <p className="mt-1 text-xs capitalize text-gray-500">
                        {activity.action_type}
                      </p>
                    </div>

                    {/* Right Side */}
                    <div className="ml-3 text-right shrink-0">
                      <p className="text-sm font-medium text-gray-500">
                        {activity.performed_by_name}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-md border border-gray-200 bg-white/80 p-3">
                  <p className="text-sm text-gray-500">
                    No recent activity found.
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* quick actions */}
          <div className="col-span-2 rounded-lg border border-white/90 bg-blue-50/80 backdrop-blur-lg p-2  overflow-hidden">
            <p className="text-base font-medium text-gray-800">Quick Actions</p>

            <div className="mt-3 grid grid-cols-3 gap-3">
              <button
                onClick={() => setProjectOpen(true)}
                className="flex items-center justify-center gap-2 rounded-md border border-gray-100 bg-blue-50 p-3 transition hover:bg-blue-100 cursor-pointer"
              >
                <FolderPlus className=" text-blue-400 " size={20} />
                <p className="text-sm font-medium text-gray-800">
                  Create Project
                </p>
              </button>

              <button
                onClick={() => {
                  setSelectedRole("manager");
                  setOpen(true);
                }}
                className="flex items-center justify-center gap-2 rounded-md border border-gray-100 bg-blue-50 p-3 transition hover:bg-blue-100 cursor-pointer"
              >
                <UserCog className=" text-blue-400" size={20} />
                <span className="text-sm font-medium text-gray-800">
                  Create Manager
                </span>
              </button>

              <button
                onClick={() => {
                  setSelectedRole("user");
                  setOpen(true);
                }}
                className="flex items-center justify-center gap-2 rounded-md border border-gray-100 bg-blue-50 p-3 transition hover:bg-blue-100 cursor-pointer"
              >
                <UserPlus className=" text-blue-400" size={20} />
                <span className="text-sm font-medium text-gray-800">
                  Create Employee
                </span>
              </button>

              <button
                onClick={() => setAssignProjectOpen(true)}
                className="flex items-center justify-center gap-2 rounded-md border border-gray-100 bg-blue-50 p-3 transition hover:bg-blue-100"
              >
                <BriefcaseBusiness className=" text-blue-400" size={20} />
                <p className="text-sm font-medium text-gray-800">
                  Assign to Project
                </p>
              </button>

              <button className="flex items-center justify-center gap-2 rounded-md border border-gray-100 bg-blue-50 p-3 transition hover:bg-blue-100">
                <Download className=" text-blue-400" size={20} />
                <p className="text-sm font-medium text-gray-800">Export Data</p>
              </button>
            </div>
          </div>
        </section>
        <CreateTeamMember
          open={open}
          setOpen={setOpen}
          selectedRole={selectedRole}
          getUsers={getDashboardData}
        />
        <AssignProjectDashboard
          open={assignProjectOpen}
          setOpen={setAssignProjectOpen}
        />
        <CreateProject
          open={projectOpen}
          setOpen={setProjectOpen}
          getProjects={getDashboardData}
        />
      </main>
    </>
  );
}
export default Dashboard;

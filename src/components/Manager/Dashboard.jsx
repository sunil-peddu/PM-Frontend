import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";
import TaskProgressChart from "./TaskProgressChart";
import {
  SquareChartGantt,
  ClipboardList,
  TriangleAlert,
  Loader,
  AlertTriangle,
  CalendarDays,
  User2,
  FolderKanban,
  CircleCheckBig,
  BriefcaseBusiness,
} from "lucide-react";

function Dashboard() {
  const { token } = useAuth();
  const hasFetched = useRef(false);

  // store full dashboard response
  const [dashboardData, setDashboardData] = useState(null);

  //api for dashboard data
  const getDashboardData = async () => {
    try {
      const response = await axios.get(`${URL}/dashboard/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      // store complete response
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

  return (
    <>
      <main className="w-full h-full flex flex-col gap-4 min-h-0 overflow-hidden">
        <p className="text-2xl font-medium">Project Management Overview</p>
        {/* stats */}
        <div className="grid grid-cols-4 gap-2 pt-1 w-full">
          {/* Total Projects */}
          <div className="bg-white p-4 rounded-2xl space-y-3">
            <div className="flex gap-2 items-start">
              <div className="border-[3px] border-green-400 rounded-full p-0.5">
                <div className="bg-green-400 rounded-full p-2">
                  <SquareChartGantt className="text-white" />
                </div>
              </div>

              <p className="w-10 text-base font-medium">Total Projects</p>
            </div>

            <span className="pl-2 text-2xl font-semibold">
              {dashboardData?.stats?.total_projects || 0}
            </span>
          </div>

          {/* Total Tasks */}
          <div className="bg-white p-4 rounded-2xl space-y-3">
            <div className="flex gap-2 items-start">
              <div className="border-[3px] border-blue-400 rounded-full p-0.5">
                <div className="bg-blue-400 rounded-full p-2">
                  <ClipboardList className="text-white" />
                </div>
              </div>

              <p className="w-10 text-base font-medium">Total Tasks</p>
            </div>

            <span className="pl-2 text-2xl font-semibold">
              {dashboardData?.stats?.total_tasks || 0}
            </span>
          </div>

          {/* OverDue Tasks */}
          <div className="bg-white p-4 rounded-2xl space-y-3">
            <div className="flex gap-2 items-start">
              <div className="border-[3px] border-red-400 rounded-full p-0.5">
                <div className="bg-red-400 rounded-full p-2">
                  <TriangleAlert className="text-white" />
                </div>
              </div>

              <p className="w-10 text-base font-medium">OverDue Tasks</p>
            </div>

            <span className="pl-2 text-2xl font-semibold">
              {dashboardData?.stats?.overdue_tasks || 0}
            </span>
          </div>

          {/* InProgress Tasks */}
          <div className="bg-white p-4 rounded-2xl space-y-3">
            <div className="flex gap-2 items-start">
              <div className="border-[3px] border-yellow-400 rounded-full p-0.5">
                <div className="bg-yellow-400 rounded-full p-2">
                  <Loader className="text-white  animate-spin" />
                </div>
              </div>

              <p className="w-30 text-base font-medium">In Progress Tasks</p>
            </div>

            <span className="pl-2 text-2xl font-semibold">
              {dashboardData?.stats?.in_progress_tasks || 0}
            </span>
          </div>
        </div>

        <section className="grid grid-cols-3 grid-rows-2 gap-3 flex-1 min-h-0 overflow-hidden">
          <div className="row-span-2 min-h-0 bg-white rounded-2xl p-4">
            <TaskProgressChart
              data={{
                done_tasks: dashboardData?.stats?.done_tasks || 0,
                todo_tasks: dashboardData?.stats?.todo_tasks || 0,
                overdue_tasks: dashboardData?.stats?.overdue_tasks || 0,
              }}
            />
          </div>
          <div className="row-span-2 min-h-0 bg-white rounded-2xl p-4 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-red-100 text-red-600 p-2 rounded-xl">
                <AlertTriangle size={18} />
              </div>

              <div>
                <p className="font-semibold text-gray-800">Urgent Tasks</p>

                <p className="text-xs text-gray-500">
                  Tasks that need immediate attention
                </p>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              {dashboardData?.urgent_tasks?.length > 0 ? (
                dashboardData.urgent_tasks.map((task) => (
                  <div
                    key={task.task_id}
                    className="border border-gray-200 rounded-2xl p-3 hover:shadow-sm transition"
                  >
                    {/* Top */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {task.task_title}
                        </p>

                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                          <FolderKanban size={13} />
                          <span>{task.project_name}</span>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
                ${
                  task.priority === "high"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    {/* Bottom */}
                    <div className="flex items-center justify-between mt-3">
                      {/* User */}
                      <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-0.5 rounded-full text-xs">
                        <User2 size={14} />
                        <span>{task.assigned_user_name}</span>
                      </div>

                      {/* Due Date */}
                      <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-0.5 rounded-full text-xs">
                        <CalendarDays size={14} />
                        <span>
                          {task.days_remaining !== null
                            ? `${task.days_remaining} day left`
                            : `${task.days_overdue} overdue`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No urgent tasks
                </div>
              )}
            </div>
          </div>
          <div className="row-span-2 min-h-0 bg-white rounded-2xl p-4 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                <BriefcaseBusiness size={18} />
              </div>

              <div>
                <p className="font-semibold text-gray-800">Team Workload</p>

                <p className="text-xs text-gray-500">
                  Team productivity overview
                </p>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              {dashboardData?.team_workload?.length > 0 ? (
                dashboardData.team_workload.map((member) => (
                  <div
                    key={member.user_id}
                    className="border border-gray-200 rounded-2xl p-3 hover:shadow-sm transition"
                  >
                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-semibold">
                        {member.user_name?.charAt(0)}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {member.user_name}
                        </p>

                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {/* Active */}
                      <div className="bg-yellow-50 rounded-xl p-1 text-center">
                        <p className="text-base font-bold text-yellow-700">
                          {member.total_active_tasks}
                        </p>

                        <p className="text-xs text-yellow-600">Active</p>
                      </div>

                      {/* Completed */}
                      <div className="bg-green-50 rounded-xl p-1 text-center">
                        <p className="text-base font-bold text-green-700">
                          {member.total_completed_tasks}
                        </p>

                        <p className="text-xs text-green-600">Completed</p>
                      </div>

                      {/* Overdue */}
                      <div className="bg-red-50 rounded-xl p-1 text-center">
                        <p className="text-base font-bold text-red-700">
                          {member.total_overdue_tasks}
                        </p>

                        <p className="text-xs text-red-600">Overdue</p>
                      </div>
                    </div>

                    {/* Projects */}
                    <div className="mt-2 flex items-start gap-2 text-xs text-gray-500">
                      <CircleCheckBig size={14} />
                      <span>{member.projects?.join(", ")}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No workload data
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Dashboard;

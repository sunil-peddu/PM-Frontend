import { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";
import toast from "react-hot-toast";
import {
  CalendarDays,
  FolderKanban,
  Clock3,
  Flag,
  CheckCircle2,
  CircleDashed,
  ListTodo,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
function Dashboard() {
  const { token } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${URL}/dashboard/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setDashboard(response.data.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch dashboard",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const cardColors = {
    high: "bg-blue-100",
    medium: "bg-purple-100",
    low: "bg-orange-100",
  };
  const CustomYAxisTick = ({ x, y, payload }) => {
    const colors = {
      High: "#ef4444",
      Medium: "#f59e0b",
      Low: "#22c55e",
    };

    return (
      <text
        x={x}
        y={y}
        dy={4}
        textAnchor="end"
        fill={colors[payload.value]}
        fontSize={13}
        fontWeight={600}
      >
        {payload.value}
      </text>
    );
  };
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="w-full h-full flex flex-col gap-4 min-h-0 overflow-hidden">
      {/* Row 1 */}
      <div className="grid grid-cols-3 gap-4 h-full max-h-80">
        {/* Upcoming Tasks */}
        <div className="col-span-2 bg-white rounded-xl p-4">
          <h2 className="text-xl font-semibold pb-5">Upcoming Tasks</h2>
          <div className="grid grid-cols-5 gap-4">
            {dashboard?.upcoming_tasks?.map((task) => (
              <div
                key={task.task_id}
                className={`rounded-3xl p-4 min-h-55 flex flex-col justify-between ${
                  cardColors[task.priority] || "bg-gray-100"
                }`}
              >
                <div>
                  {/* Priority Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
          ${
            task.priority === "high"
              ? "bg-red-100 text-red-700"
              : task.priority === "medium"
                ? "bg-amber-100 text-amber-700"
                : "bg-green-100 text-green-700"
          }`}
                  >
                    <Flag size={12} />
                    {task.priority}
                  </span>

                  {/* Task Title */}
                  <h3 className="mt-2 text-base font-semibold  text-gray-900">
                    {task.task_title}
                  </h3>

                  {/* Project */}
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-700">
                    <FolderKanban size={15} />
                    <span>{task.project_name}</span>
                  </div>

                  {/* Due Date */}
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-700">
                    <CalendarDays size={15} />
                    <span>{task.due_date}</span>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-4 border-t border-black/10 pt-3">
                  <div className="flex items-center justify-between gap-1">
                    <div
                      className={`flex items-center gap-2 text-xs font-medium ${
                        task.type === "overdue"
                          ? "text-red-600"
                          : "text-gray-700"
                      }`}
                    >
                      <Clock3 size={14} />

                      <span>
                        {task.days_remaining === 0
                          ? "Due Today"
                          : task.days_remaining !== null
                            ? `${task.days_remaining} days left`
                            : `${task.days_overdue} day${task.days_overdue > 1 ? "s" : ""} overdue`}
                      </span>
                    </div>

                    <span
                      className={`text-xs px-2 py-1 rounded-full capitalize ${
                        task.status === "done"
                          ? "bg-green-100 text-green-700"
                          : task.status === "in_progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart Section */}
        <div className="p-4 h-full flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Task Progress</h2>

          {(() => {
            const todo = dashboard?.donut_data?.todo || 0;
            const inProgress = dashboard?.donut_data?.in_progress || 0;
            const done = dashboard?.donut_data?.done || 0;

            const total = dashboard?.donut_data?.total || 0;

            const todoPercent = (todo / total) * 100;
            const inProgressPercent = (inProgress / total) * 100;
            const donePercent = (done / total) * 100;

            return (
              <div className="flex-1 flex items-center justify-between gap-4">
                {/* Stats */}
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#38a0f5]" />
                      <p className="text-xs text-gray-500">Todo</p>
                    </div>

                    <p className="text-xl font-semibold text-gray-800 ml-4">
                      {Math.round(todoPercent)}%
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#7cc7fa]" />
                      <p className="text-xs text-gray-500">In Progress</p>
                    </div>

                    <p className="text-xl font-semibold text-gray-800 ml-4">
                      {Math.round(inProgressPercent)}%
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#d8efff]" />
                      <p className="text-xs text-gray-500">Done</p>
                    </div>

                    <p className="text-xl font-semibold text-gray-800 ml-4">
                      {Math.round(donePercent)}%
                    </p>
                  </div>
                </div>

                {/* Donut Rings */}
                <div className="relative flex-1 h-full flex items-center justify-center">
                  {/* OUTER RING */}
                  <div
                    className="absolute w-48 h-48 rounded-full"
                    style={{
                      background: `conic-gradient(
                from -90deg,
                #38a0f5 0% ${todoPercent}%,
                #e8f4fd ${todoPercent}% 100%
              )`,
                      mask: "radial-gradient(circle, transparent 58%, black 59%, black 82%, transparent 83%)",
                      WebkitMask:
                        "radial-gradient(circle, transparent 58%, black 59%, black 82%, transparent 83%)",
                    }}
                  />

                  {/* MIDDLE RING */}
                  <div
                    className="absolute w-36 h-36 rounded-full"
                    style={{
                      background: `conic-gradient(
                from 20deg,
                #7cc7fa 0% ${inProgressPercent}%,
                #eef7fe ${inProgressPercent}% 100%
              )`,
                      mask: "radial-gradient(circle, transparent 55%, black 56%, black 80%, transparent 81%)",
                      WebkitMask:
                        "radial-gradient(circle, transparent 55%, black 56%, black 80%, transparent 81%)",
                    }}
                  />

                  {/* INNER RING */}
                  <div
                    className="absolute w-24 h-24 rounded-full"
                    style={{
                      background: `conic-gradient(
                from 120deg,
                #b9e3fd 0% ${donePercent}%,
                #f3f9fe ${donePercent}% 100%
              )`,
                      mask: "radial-gradient(circle, transparent 52%, black 53%, black 78%, transparent 79%)",
                      WebkitMask:
                        "radial-gradient(circle, transparent 52%, black 53%, black 78%, transparent 79%)",
                    }}
                  />
                </div>
              </div>
            );
          })()}
        </div>
      </div>
      {/* row2 */}
      <div className="grid grid-cols-3 gap-4 flex-1 overflow-hidden">
        <div className="border border-white/50 bg-white/50 backdrop-blur-lg rounded-xl overflow-y-auto p-4">
          <h2 className="text-lg font-semibold pb-2">Recently Completed</h2>
          <div className="space-y-3">
            {dashboard?.recently_completed?.length > 0 ? (
              dashboard.recently_completed.map((task) => (
                <div
                  key={task.task_id}
                  className="bg-white  rounded-2xl p-2 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={18} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">
                        {task.task_title}
                      </h3>

                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <FolderKanban size={14} className="text-blue-500" />
                        <span>{task.project_name}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <CalendarDays size={14} />
                        <span>{task.completed_at}</span>
                      </div>
                    </div>

                    {/* Completed Badge */}
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      Done
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <CheckCircle2 size={40} className="text-gray-300 mb-2" />

                <p className="text-gray-500">No completed tasks yet</p>
              </div>
            )}
          </div>
        </div>
        {/* box2 */}
        <div className=" border border-white/50 bg-white/50 backdrop-blur-lg rounded-xl overflow-y-auto p-4">
          <h2 className="text-lg font-semibold mb-4">Priority Breakdown</h2>

          <ResponsiveContainer width="100%" height={194}>
            <BarChart
              layout="vertical"
              data={[
                {
                  priority: "High",
                  count: dashboard?.priority_breakdown?.high || 0,
                },
                {
                  priority: "Medium",
                  count: dashboard?.priority_breakdown?.medium || 0,
                },
                {
                  priority: "Low",
                  count: dashboard?.priority_breakdown?.low || 0,
                },
              ]}
            >
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="priority"
                width={70}
                tick={<CustomYAxisTick />}
              />
              <Tooltip />

              <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={12}>
                <Cell fill="#ef4444" />
                <Cell fill="#f59e0b" />
                <Cell fill="#22c55e" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* box3 */}
        <div className=" border border-white/50 bg-white/50 backdrop-blur-lg rounded-xl overflow-y-auto p-4">
          <h2 className="text-lg font-semibold mb-2">My Projects</h2>

          <div className="space-y-4">
            {dashboard?.my_projects?.map((project) => (
              <div
                key={project.project_id}
                className="bg-white/80 backdrop-blur-md border border-white rounded-2xl p-2 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <FolderKanban size={14} className="text-blue-500" />

                      <h3 className="font-semibold text-gray-900 text-sm">
                        {project.project_name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <CalendarDays size={14} />
                      <span>{project.project_due_date}</span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.project_status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {project.project_status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div className="bg-blue-50 rounded-xl p-1 flex flex-col items-center ">
                    <div className="flex items-center  gap-2">
                      <ListTodo size={14} className="text-blue-600" />
                      <span className="text-xs text-gray-500">Total</span>
                    </div>

                    <p className="text-base font-bold mt-1">
                      {project.my_total_tasks}
                    </p>
                  </div>

                  <div className="bg-amber-50 rounded-xl p-1 flex flex-col items-center ">
                    <div className="flex items-center gap-2">
                      <CircleDashed size={14} className="text-amber-600" />
                      <span className="text-xs text-gray-500">In Progress</span>
                    </div>

                    <p className="text-base font-bold mt-1">
                      {project.my_in_progress_tasks}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-1 flex flex-col items-center ">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-green-600" />
                      <span className="text-xs text-gray-500">Done</span>
                    </div>

                    <p className="text-base font-bold mt-1">
                      {project.my_done_tasks}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{project.my_progress_percentage}%</span>
                  </div>

                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${project.my_progress_percentage}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;

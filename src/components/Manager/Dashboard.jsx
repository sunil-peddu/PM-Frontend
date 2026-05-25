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

        <section className="grid grid-cols-3 grid-rows-2 gap-3 flex-1">
          <div className="row-span-2 bg-white rounded-2xl p-4">
            <TaskProgressChart
              data={{
                done_tasks: dashboardData?.stats?.done_tasks || 0,
                todo_tasks: dashboardData?.stats?.todo_tasks || 0,
                overdue_tasks: dashboardData?.stats?.overdue_tasks || 0,
              }}
            />
          </div>
          <div className="bg-white rounded-2xl p-4">Urgent tasks</div>
          <div className="row-span-2 bg-white rounded-2xl p-4">
            Team Workload
          </div>
          <div className="bg-white rounded-2xl p-4">Recent task activity</div>
        </section>
      </main>
    </>
  );
}

export default Dashboard;

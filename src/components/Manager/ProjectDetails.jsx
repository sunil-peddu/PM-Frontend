import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { ArrowLeft, Plus, UserMinus, UserPlus } from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";
import AssignProject from "../Admin/AssignProject";
import CreateTask from "./CreateTask ";

function ProjectDetails() {
  const { token } = useAuth();

  const navigate = useNavigate();
  const { id } = useParams();
  const hasFetched = useRef(false);
  const [project, setProject] = useState(null);
  const [projectStats, setProjectStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [openAddMembers, setOpenAddMembers] = useState(false);
  const [openRemoveMembers, setOpenRemoveMembers] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  // ---------------- FETCH PROJECT DETAILS ----------------
  const getProject = async () => {
    try {
      const response = await axios.get(`${URL}/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setProject(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch project");
    }
  };
  // ---------------- FETCH PROJECT STATS ----------------
  const getProjectStats = async () => {
    try {
      const response = await axios.get(`${URL}/projects/${id}/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setProjectStats(response.data.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch project stats",
      );
    }
  };

  // ---------------- FETCH TASKS ----------------
  const getTasks = async () => {
    try {
      const response = await axios.get(`${URL}/tasks/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setTasks(response.data.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch tasks");
    }
  };

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;

    getProject();
    getProjectStats();
    getTasks();
  }, []);

  return (
    <main className="w-full h-full flex flex-col gap-4 min-h-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="border border-gray-300 rounded-lg p-2 hover:bg-gray-100 transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>

          <p className="text-2xl font-medium">
            {project?.name || "Project Details"}
          </p>
        </div>

        <div className="text-sm flex items-center gap-4">
          <button onClick={() => setOpenCreateTask(true)} className="button_bg">
            <Plus size={18} />
            New Task
          </button>
          <button onClick={() => setOpenAddMembers(true)} className="button_bg">
            <UserPlus size={18} />
            Add Members
          </button>

          <button
            onClick={() => setOpenRemoveMembers(true)}
            className="button_bg"
          >
            <UserMinus size={18} />
            Remove Members
          </button>
        </div>
      </div>

      <section className="bg-white rounded-xl shadow-sm p-4 flex-1 overflow-y-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-5 gap-4">
          {/* Total */}
          <div className="bg-blue-50  rounded-xl p-4 text-center">
            <p className="text-sm text-blue-600 font-medium">Total</p>

            <h2 className="text-2xl font-bold text-blue-700">
              {projectStats?.total || 0}
            </h2>
          </div>

          {/* Todo */}
          <div className="bg-gray-50  rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500 font-medium">Todo</p>

            <h2 className="text-2xl font-bold text-gray-700">
              {projectStats?.todo || 0}
            </h2>
          </div>

          {/* In Progress */}
          <div className="bg-yellow-50  rounded-xl p-4 text-center">
            <p className="text-sm text-yellow-600 font-medium">In Progress</p>

            <h2 className="text-2xl font-bold text-yellow-700">
              {projectStats?.in_progress || 0}
            </h2>
          </div>

          {/* Done */}
          <div className="bg-green-50  rounded-xl p-4 text-center">
            <p className="text-sm text-green-600 font-medium">Done</p>

            <h2 className="text-2xl font-bold text-green-700">
              {projectStats?.done || 0}
            </h2>
          </div>

          {/* Overdue */}
          <div className="bg-red-50  rounded-xl p-4 text-center">
            <p className="text-sm text-red-600 font-medium">Overdue</p>

            <h2 className="text-2xl font-bold text-red-700">
              {projectStats?.overdue || 0}
            </h2>
          </div>
        </div>

        {/* Tasks */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tasks</h2>

          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="border border-gray-200 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>

                    <p className="text-sm text-gray-500">{task.description}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                      ${
                        task.status === "done"
                          ? "bg-green-100 text-green-700"
                          : task.status === "in_progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : task.status === "overdue"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No tasks found
            </div>
          )}
        </div>
      </section>
      {/* Add Members */}
      <AssignProject
        open={openAddMembers}
        setOpen={setOpenAddMembers}
        project={project}
        mode="add"
      />

      {/* Remove Members */}
      <AssignProject
        open={openRemoveMembers}
        setOpen={setOpenRemoveMembers}
        project={project}
        mode="remove"
      />
      <CreateTask
        open={openCreateTask}
        setOpen={setOpenCreateTask}
        projectId={id}
        refreshTasks={() => {
          getTasks();
          getProjectStats();
        }}
      />
    </main>
  );
}

export default ProjectDetails;

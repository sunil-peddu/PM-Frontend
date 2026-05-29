import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  Plus,
  UserMinus,
  UserPlus,
  CalendarDays,
  UserRoundCog,
  Pencil,
  History,
  Trash2,
  User2,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import Tooltip from "../Common/Tooltip";

import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";
import AssignProject from "../Admin/AssignProject";
import CreateTask from "./CreateTask ";
import ReassignTask from "./ReassignTask";
import TaskHistory from "./TaskHistory";

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
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedTaskHistory, setSelectedTaskHistory] = useState(null);

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

  const deleteTask = async (taskId) => {
    try {
      const response = await axios.delete(`${URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      toast.success(response?.data?.message || "Task deleted successfully");

      // Refresh data
      getTasks();
      getProjectStats();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete task");
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

          {tasks.filter((task) => task.project_id === Number(id)).length > 0 ? (
            <div className="space-y-4">
              {tasks
                .filter((task) => task.project_id === Number(id))
                .map((task) => (
                  <div
                    key={task.id}
                    className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
                  >
                    {/* Top Section */}
                    <div className="flex justify-between items-start">
                      {/* Left Side */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {task.title}
                        </h3>

                        <p className="text-sm text-gray-500 max-w-4xl  ">
                          {task.description}
                        </p>
                      </div>

                      {/* Right Side */}
                      <div className="flex items-center gap-3">
                        {/* Priority */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                  ${
                    task.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                  }`}
                        >
                          {task.priority}
                        </span>

                        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                          <CalendarDays size={16} className="text-blue-600" />
                          <span>{task.due_date}</span>
                        </div>

                        {/* Assigned User */}
                        <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                          <User2 size={16} className="text-purple-600" />
                          <span>{task.assigned_user_name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex justify-end gap-4 mt-2 pt-2 border-t border-gray-100">
                      <Tooltip text="Reassign">
                        <button
                          onClick={() => {
                            setSelectedTaskId(task);
                            setReassignOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          <UserRoundCog size={18} />
                        </button>
                      </Tooltip>

                      <Tooltip text="Edit">
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setEditOpen(true);
                          }}
                          className="text-green-600 hover:text-green-800 cursor-pointer"
                        >
                          <Pencil size={18} />
                        </button>
                      </Tooltip>

                      <Tooltip text="History">
                        <button
                          onClick={() => {
                            setSelectedTaskHistory(task);
                            setHistoryOpen(true);
                          }}
                          className="text-yellow-600 hover:text-yellow-800 cursor-pointer"
                        >
                          <History size={18} />
                        </button>
                      </Tooltip>

                      <Tooltip text="Delete">
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </Tooltip>
                    </div>
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
      <CreateTask
        open={editOpen}
        setOpen={setEditOpen}
        projectId={id}
        refreshTasks={() => {
          getTasks();
          getProjectStats();
        }}
        mode="edit"
        editTask={selectedTask}
      />
      <ReassignTask
        open={reassignOpen}
        setOpen={setReassignOpen}
        projectId={id}
        task={selectedTaskId}
        refreshTasks={() => {
          getTasks();
          getProjectStats();
        }}
      />
      <TaskHistory
        open={historyOpen}
        setOpen={setHistoryOpen}
        task={selectedTaskHistory}
      />
    </main>
  );
}

export default ProjectDetails;

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  CalendarDays,
  History,
  User2,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import Tooltip from "../Common/Tooltip";
import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";
import TaskHistory from "../Manager/TaskHistory";
import TaskComments from "./TaskComments";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function ProjectDetails() {
  const { token } = useAuth();

  const navigate = useNavigate();
  const { id } = useParams();

  const hasFetched = useRef(false);

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedTaskHistory, setSelectedTaskHistory] = useState(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [selectedTaskComments, setSelectedTaskComments] = useState(null);
  const [dragging, setDragging] = useState(false);

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

  const projectTasks = tasks.filter((task) => task.project_id === Number(id));

  const todoTasks = projectTasks.filter((task) => task.status === "todo");

  const inProgressTasks = projectTasks.filter(
    (task) => task.status === "in_progress",
  );

  const doneTasks = projectTasks.filter((task) => task.status === "done");

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.patch(
        `${URL}/tasks/${taskId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      getTasks();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update task status",
      );
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    try {
      setDragging(true);

      const taskId = Number(result.draggableId);
      const newStatus = result.destination.droppableId;

      await updateTaskStatus(taskId, newStatus);
    } finally {
      setDragging(false);
    }
  };

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;

    getProject();
    getTasks();
  }, []);

  const TaskCard = ({ task }) => (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      {/* Top */}
      <div className="flex items-start justify-between">
        <div className="flex gap-2 flex-wrap">
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

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize
          ${
            task.status === "done"
              ? "bg-green-100 text-green-700"
              : task.status === "in_progress"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
          }`}
          >
            {task.status.replace("_", " ")}
          </span>
        </div>

        {task.is_overdue && (
          <div className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full">
            <AlertTriangle size={14} />
            <span className="text-xs">Overdue</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-800 mt-4">{task.title}</h3>

      {/* Description */}
      <p className="text-sm text-gray-500 mt-2 line-clamp-3">
        {task.description}
      </p>

      {/* Details */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarDays size={14} />
          <span>{task.due_date}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User2 size={14} />
          <span>{task.assigned_user_name}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 mt-4 pt-3 border-t border-gray-100">
        <Tooltip text="Comments">
          <button
            onClick={() => {
              setSelectedTaskComments(task);
              setCommentsOpen(true);
            }}
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            <MessageCircle size={18} />
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
      </div>
    </div>
  );

  return (
    <main className="w-full h-full flex flex-col gap-4 min-h-0 overflow-hidden">
      {/* Header */}
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

      <section className="bg-white rounded-xl shadow-sm p-4 flex-1 overflow-y-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-full">
            <Droppable droppableId="todo">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-purple-50 rounded-3xl p-4 "
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-purple-500" />

                      <h2 className="font-semibold text-lg">Todo</h2>
                    </div>

                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                      {todoTasks.length}
                    </span>
                  </div>

                  {todoTasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={String(task.id)}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={provided.draggableProps.style}
                          className="cursor-grab active:cursor-grabbing"
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* IN PROGRESS COLUMN */}
            <Droppable droppableId="in_progress">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-amber-50 rounded-3xl p-4 "
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-amber-500" />

                      <h2 className="font-semibold text-lg">In Progress</h2>
                    </div>

                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">
                      {inProgressTasks.length}
                    </span>
                  </div>

                  {inProgressTasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={String(task.id)}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={provided.draggableProps.style}
                          className="cursor-grab active:cursor-grabbing"
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* DONE COLUMN */}
            <Droppable droppableId="done">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-green-50 rounded-3xl p-4 "
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500" />

                      <h2 className="font-semibold text-lg">Done</h2>
                    </div>

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      {doneTasks.length}
                    </span>
                  </div>

                  {doneTasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={String(task.id)}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={provided.draggableProps.style}
                          className="cursor-grab active:cursor-grabbing"
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </section>

      <TaskHistory
        open={historyOpen}
        setOpen={setHistoryOpen}
        task={selectedTaskHistory}
      />
      <TaskComments
        open={commentsOpen}
        setOpen={setCommentsOpen}
        task={selectedTaskComments}
      />
    </main>
  );
}

export default ProjectDetails;

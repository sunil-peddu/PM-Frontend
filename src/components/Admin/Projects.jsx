import {
  Plus,
  SquarePen,
  Eye,
  UserPlus,
  UserMinus,
  ListTodo,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";
import Tooltip from "../Common/Tooltip";
import axios from "axios";
import toast from "react-hot-toast";
import { Fragment } from "react";
import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";

import CreateProject from "./CreateProject";
import AssignProject from "./AssignProject";
import UpdateProjectStatus from "./UpdateProjectStatus";
function Projects() {
  const { token } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [expandedProject, setExpandedProject] = useState(null);
  const [projectDetails, setProjectDetails] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedAssignProject, setSelectedAssignProject] = useState(null);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [selectedRemoveProject, setSelectedRemoveProject] = useState(null);
  const [statusOpen, setStatusOpen] = useState(false);

  const hasFetched = useRef(false);

  // ================= Get Projects =================
  const getProjects = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${URL}/projects/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setProjects(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  // ================= Initial Fetch =================
  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;

    getProjects();
  }, []);

  // ================= Filter =================
  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [projects, searchTerm]);

  // ================= Highlight Search =================
  const highlightText = (text, search) => {
    if (!search) return text;

    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(`(${escapedSearch})`, "gi");

    return text.split(regex).map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 text-black px-1 rounded">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const getProjectDetails = async (projectId) => {
    try {
      const response = await axios.get(`${URL}/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setProjectDetails((prev) => ({
        ...prev,
        [projectId]: response.data.data,
      }));

      setExpandedProject(expandedProject === projectId ? null : projectId);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch project details",
      );
    }
  };

  return (
    <>
      <main className="w-full h-full flex flex-col gap-3 min-h-0 overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-end">
          <div>
            <p className="text-xl font-medium pb-1">Projects</p>

            <p className="text-sm text-gray-600">
              Manage all your projects here.
            </p>
          </div>

          {/* Create Button */}
          <button
            onClick={() => {
              setIsEdit(false);

              setSelectedProject(null);

              setOpen(true);
            }}
            className="button_bg"
          >
            <Plus size={16} />
            Create Project
          </button>
        </header>

        {/* Table Section */}
        <section className="bg-white rounded-xl shadow-sm p-4 flex-1 min-h-0 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            {/* Search */}
            <div className="pb-4 flex justify-end">
              <input
                type="text"
                placeholder="Search project by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 bg-blue-50 rounded-lg px-3 py-2 text-sm outline-none"
              />
            </div>

            {/* Table */}
            <table className="w-full text-sm">
              {/* Head */}
              <thead className="sticky top-0 bg-white border-b border-gray-200 z-10">
                <tr className="text-left">
                  <th className="py-3 px-3 font-medium">Project Name</th>

                  <th className="py-3 px-3 font-medium">Description</th>

                  <th className="py-3 px-3 font-medium">Status</th>

                  <th className="py-3 px-3 font-medium">Due Date</th>

                  <th className="py-3 px-3 font-medium text-start">Actions</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-400">
                      Loading projects...
                    </td>
                  </tr>
                ) : filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <Fragment key={project.id}>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        {/* Project Name */}
                        <td className="py-3 px-3">
                          <p className="font-medium text-gray-800">
                            {highlightText(project.name, searchTerm)}
                          </p>
                        </td>

                        {/* Description */}
                        <td className="py-3 px-3 text-gray-600 max-w-md">
                          <p className="line-clamp-2">{project.description}</p>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              project.status === "active"
                                ? "bg-green-50 text-green-600"
                                : project.status === "completed"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-yellow-50 text-yellow-600"
                            }`}
                          >
                            {project.status}
                          </span>
                        </td>

                        {/* Due Date */}
                        <td className="py-3 px-3 text-gray-500 whitespace-nowrap">
                          {new Date(project.due_date).toLocaleDateString()}
                        </td>

                        {/* Actions */}

                        <td className="py-3 px-3">
                          <div className="flex items-center justify-start gap-3">
                            {/* Edit */}
                            <Tooltip text="Edit">
                              <button
                                onClick={() => {
                                  setSelectedProject(project);

                                  setIsEdit(true);

                                  setOpen(true);
                                }}
                                className="cursor-pointer text-blue-600 hover:text-blue-700 transition"
                              >
                                <SquarePen size={16} />
                              </button>
                            </Tooltip>
                            <Tooltip text="Update Status">
                              <button
                                onClick={() => {
                                  setSelectedProject(project);
                                  setStatusOpen(true);
                                }}
                                className="cursor-pointer text-orange-600 hover:text-orange-700 transition"
                              >
                                <RefreshCw size={16} />
                              </button>
                            </Tooltip>
                            {/* Assign */}
                            {/* Assign */}
                            <Tooltip text="Assign to project">
                              <button
                                onClick={() => {
                                  setSelectedAssignProject(project);
                                  setAssignOpen(true);
                                }}
                                className="cursor-pointer text-green-600 hover:text-green-700 transition"
                              >
                                <UserPlus size={16} />
                              </button>
                            </Tooltip>

                            {/* Remove */}
                            <Tooltip text="Remove from project">
                              <button
                                onClick={() => {
                                  setSelectedRemoveProject(project);
                                  setRemoveOpen(true);
                                }}
                                className="cursor-pointer text-red-600 hover:text-red-700 transition"
                              >
                                <UserMinus size={16} />
                              </button>
                            </Tooltip>
                            {/* View */}
                            <Tooltip text="View Project">
                              <button
                                onClick={() => getProjectDetails(project.id)}
                                className="cursor-pointer text-gray-600 hover:text-black transition"
                              >
                                <Eye size={16} />
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                      {expandedProject === project.id && (
                        <tr>
                          <td colSpan="5" className="bg-gray-50 px-6 py-5">
                            {projectDetails[project.id] && (
                              <div className="grid grid-cols-3 gap-4">
                                {/* Total Tasks */}
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <ListTodo
                                      size={18}
                                      className="text-blue-600"
                                    />
                                  </div>

                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Total Tasks
                                    </p>

                                    <p className="text-xl font-semibold text-blue-700">
                                      {
                                        projectDetails[project.id].progress
                                          .total_tasks
                                      }
                                    </p>
                                  </div>
                                </div>

                                {/* Completed Tasks */}
                                <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle2
                                      size={18}
                                      className="text-green-600"
                                    />
                                  </div>

                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Completed
                                    </p>

                                    <p className="text-xl font-semibold text-green-700">
                                      {
                                        projectDetails[project.id].progress
                                          .completed_tasks
                                      }
                                    </p>
                                  </div>
                                </div>

                                {/* Progress */}
                                {/* Progress */}
                                <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                                      <TrendingUp
                                        size={18}
                                        className="text-violet-600"
                                      />
                                    </div>

                                    <div>
                                      <p className="text-xs text-gray-500">
                                        Progress
                                      </p>

                                      <p className="text-xl font-semibold text-violet-700">
                                        {
                                          projectDetails[project.id].progress
                                            .percentage
                                        }
                                        %
                                      </p>
                                    </div>
                                  </div>

                                  {/* Progress Bar */}
                                  <div className="w-full h-2 bg-violet-100 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-violet-600 transition-all duration-500"
                                      style={{
                                        width: `${projectDetails[project.id].progress.percentage}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-400">
                      No projects found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Popup */}
        <CreateProject
          open={open}
          setOpen={setOpen}
          getProjects={getProjects}
          isEdit={isEdit}
          editData={selectedProject}
        />
        <AssignProject
          open={assignOpen}
          setOpen={setAssignOpen}
          project={selectedAssignProject}
          mode="add"
        />
        <AssignProject
          open={removeOpen}
          setOpen={setRemoveOpen}
          project={selectedRemoveProject}
          mode="remove"
        />
        <UpdateProjectStatus
          open={statusOpen}
          setOpen={setStatusOpen}
          project={selectedProject}
          getProjects={getProjects}
        />
      </main>
    </>
  );
}

export default Projects;

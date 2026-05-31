import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { URL } from "../../url";
import { useAuth } from "../AuthProvider/AuthProvider";

function Projects() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const hasFetched = useRef(false);

  const [projects, setProjects] = useState([]);

  // ---------------- FETCH PROJECTS ----------------
  const getProjects = async () => {
    try {
      const response = await axios.get(`${URL}/projects/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setProjects(response.data.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch projects",
      );
    }
  };

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;
    getProjects();
  }, []);

  return (
    <main className="w-full h-full flex flex-col gap-4 min-h-0 overflow-hidden">
      <p className="text-2xl font-medium">
        Projects Overview
      </p>

      <section className="bg-white rounded-xl shadow-sm p-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project.id}
                onClick={() =>
                  navigate(`/manager/projects/${project.id}`)
                }
                className="border border-gray-200 rounded-xl p-4 space-y-4 cursor-pointer hover:shadow-md transition-all"
              >
                {/* Top */}
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-semibold">
                    {project.name}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                      ${
                        project.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{
                        width: `${project.progress.percentage}%`,
                      }}
                    />
                  </div>

                  <p className="text-sm text-gray-500">
                    {project.progress.percentage}% Completed
                  </p>
                </div>

                {/* Bottom */}
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-yellow-50 rounded-lg p-2 text-center">
                    <p className="text-gray-500">
                      Total Tasks
                    </p>

                    <p className="font-semibold">
                      {project.progress.total_tasks}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-2 text-center">
                    <p className="text-gray-500">
                      Completed
                    </p>

                    <p className="font-semibold">
                      {project.progress.completed_tasks}
                    </p>
                  </div>

                  <div className="bg-red-50 rounded-lg p-2 text-center">
                    <p className="text-gray-500">
                      Due Date
                    </p>

                    <p className="font-semibold">
                      {project.due_date}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center py-10 text-gray-500">
              No projects found
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Projects;
import "./App.css";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./components/AuthProvider/AuthProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login/login";
import SuperAdmin from "./components/Landing/SuperAdmin";
import Admin from "./components/Landing/Admin";
import Manager from "./components/Landing/Manager";
import User from "./components/Landing/User";
import Dashboard from "./components/SuperAdmin/Dashboard";
import Organization from "./components/SuperAdmin/Organization";
import AuditLogs from "./components/SuperAdmin/AuditLogs";
import ProtectedRoute from "./components/Pages/ProtectedRoute";
import AdminDashboard from "./components/Admin/Dashboard";
import AdminProjects from "./components/Admin/Projects";
import AdminTeam from "./components/Admin/Team";
import AdminAuditLogs from "./components/Admin/AuditLogs";
import ManagerDashboard from "./components/Manager/Dashboard";
import ManagerProjects from "./components/Manager/Projects";
import ManagerAuditLogs from "./components/Manager/AuditLogs";
import ProjectDetails from "./components/Manager/ProjectDetails";
function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="bottom-right" reverseOrder={false} />
          <Routes>
            <Route path="/" element={<Login />} />
            {/* Super Admin Layout */}
            <Route
              path="/super-admin"
              element={
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <SuperAdmin />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="organization" element={<Organization />} />
              <Route path="audit-logs" element={<AuditLogs />} />
            </Route>
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Admin />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="team" element={<AdminTeam />} />
              <Route path="logs" element={<AdminAuditLogs />} />
            </Route>
            <Route
              path="/manager"
              element={
                <ProtectedRoute allowedRoles={["manager"]}>
                  <Manager />
                </ProtectedRoute>
              }
            >
              <Route index element={<ManagerDashboard />} />
              <Route path="dashboard" element={<ManagerDashboard />} />
              <Route path="projects" element={<ManagerProjects />} />
              <Route path="logs" element={<ManagerAuditLogs />} />
              <Route path="projects/:id" element={<ProjectDetails />} />
            </Route>
            <Route
              path="/employee"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <User />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;

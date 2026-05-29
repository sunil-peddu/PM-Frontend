import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Load data from localStorage on refresh
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  // Login
  const login = (userData, accessToken) => {
    // Save in state
    setUser(userData);
    setToken(accessToken);
    setIsAuthenticated(true);

    // Save in localStorage
    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));

    // Navigate by role
    if (userData.role === "super_admin") {
      navigate("/super-admin");
    } else if (userData.role === "admin") {
      navigate("/admin");
    } else if (userData.role === "manager") {
      navigate("/manager");
    } else if (userData.role === "user") {
      navigate("/employee");
    } else {
      navigate("/");
    }
  };

  // Logout
  const logout = () => {
    // Clear state
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => {
  return useContext(AuthContext);
};
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/store";

interface Props {
  children: React.ReactNode; // ✅ allow single or multiple children
}

const PublicRoute: React.FC<Props> = ({ children }) => {
  const role = useSelector((state: RootState) => state.user.role) || localStorage.getItem("role");
  const userId = useSelector((state: RootState) => state.user.userId) || localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if ((userId || token) && role === "ADMIN") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return <>{children}</>; // ✅ fragment wraps multiple children safely
};

export default PublicRoute;

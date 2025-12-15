import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/store";

interface Props {
  children: React.ReactNode; // ✅ allow multiple children
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const token = localStorage.getItem("token");

  if (!userId && !token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>; // wrap children in fragment
};

export default PrivateRoute;

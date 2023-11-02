import React from "react";
import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import LoginPage from "../Pages/Login/Login";
import SignupPage from "../Pages/Signup/Signup";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Todos from "../Pages/Todos/Todos";

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate replace to={"/todos"} />} />
        <Route path="/todos" element={<Todos />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      <Route path="/" element={<PublicRoute />}>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
      </Route>
    </RouterRoutes>
  );
};

export default Routes;

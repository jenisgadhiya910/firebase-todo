import { isEmpty } from "lodash";
import React from "react";
import { Navigate } from "react-router-dom";
import MainLayout from "../Component/MainLayout/MainLayout";
import { useUserAuth } from "../Context/UserAuthContext";
import { Spin } from "antd";

const ProtectedRoute = () => {
  const {user,loading} = useUserAuth()

  if (loading) {
    return <Spin />;
  }

  if (isEmpty(user)) {
    return <Navigate to={`/auth/login`} replace />;
  }

  return <MainLayout />;
};

export default ProtectedRoute;

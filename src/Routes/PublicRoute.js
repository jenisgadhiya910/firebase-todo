import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { useUserAuth } from "../Context/UserAuthContext";
import { isEmpty } from "lodash";

const PublicRoute = () => {
  const { user,loading } = useUserAuth();

  if (loading) {
    return <Spin />;
  }

  return !isEmpty(user) ? <Navigate to={"/todos"} /> : <Outlet />;
};

export default PublicRoute;

import React, { useEffect, useState } from "react";
import { Avatar, Dropdown, Layout, Tag } from "antd";
import "./MainLayout.scss";
import { Outlet } from "react-router";
import { LogoutOutlined } from "@ant-design/icons";
import { useUserAuth } from "../../Context/UserAuthContext";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
const { Header, Content } = Layout;

function MainLayout(props) {
  const { user, logOut, setUser } = useUserAuth();
  const [userInfo, setUserInfo] = useState();

  const handleLogout = () => {
    logOut();
  };

  useEffect(() => {
    if (!userInfo) {
      getUserInfo();
    }
  }, [user]);

  const getUserInfo = async () => {
    const userDataQuery = query(
      collection(db, "users"),
      where("id", "==", user?.uid),
      limit(1)
    );
    const userDoc = await getDocs(userDataQuery);
    const userData = {
      ...user,
      ...userDoc?.docs?.[0]?.data(),
      id: userDoc?.docs?.[0]?.id,
    };
    setUserInfo(userData);
    setUser(userData);
  };

  return (
    <Layout className="main-layout">
      <Header>
        <div>
          <h3 style={{ color: "white" }}>
            Firebase demo {user?.role === "admin" && <Tag>Admin</Tag>}
          </h3>
        </div>
        <Dropdown
          menu={{
            items: [
              {
                label: "Logout",
                icon: <LogoutOutlined />,
                onClick: () => handleLogout(),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Avatar
            size={"large"}
            src={user?.avatar}
          >{`${userInfo?.first_name?.[0]?.toUpperCase()}${userInfo?.last_name?.[0]?.toUpperCase()}`}</Avatar>
        </Dropdown>
      </Header>
      <Content style={{ minHeight: "calc(100vh - 82px)", background: "#fff" }}>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default MainLayout;

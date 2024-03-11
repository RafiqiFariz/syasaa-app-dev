import { IonApp, IonRouterOutlet } from "@ionic/react";
import { LoginPage } from "../../pages/login/Login";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";
import { DashboardPage } from "../../pages/dashboard/DashboardPage";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { UserPage } from "../../pages/users/UserPage";
import { AddUserPage } from "../../pages/users/Add/AddUserPage";
import { EditUserPage } from "../../pages/users/Edit/EditUserPage";
import { RolePage } from "../../pages/roles/RolePage";
import { EditRolePage } from "../../pages/roles/Edit/EditRolePage";
import { AddRolePage } from "../../pages/roles/Add/AddRolePage";
import { PermissionPage } from "../../pages/permissions/PermissionPage";
import { AddPermissionPage } from "../../pages/permissions/Add/AddPermissionPage";
import { EditPermissionPage } from "../../pages/permissions/Edit/EditPermissionPage";
import { AuthContext } from "../../context/Auth";

export const Router: React.FC = () => {
  const { isLogin, setIsLogin } = useContext(AuthContext);

  useEffect(() => {
    const getAuth = async () => {
      try {
        const response = await fetch("http://localhost:8000/user", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
          },
        });

        const data = await response.json();

        if (data.message === "Unauthenticated.") {
          setIsLogin({
            isLogin: false,
            isPending: false,
          });
          console.log(data, "data123");
        } else {
          setIsLogin({
            isLogin: true,
            isPending: false,
          });
          console.log(data, "data");
        }
      } catch (error) {
        setIsLogin({
          isLogin: false,
          isPending: false,
        });
      }
    };

    getAuth();
  }, [isLogin.isLogin]);
  console.log(isLogin, "isLogin");
  if (isLogin.isPending) {
    return (
      <div className="d-flex absolute justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  }
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route
            exact
            path="/login"
            render={() =>
              !isLogin.isLogin ? <LoginPage /> : <Redirect to={"/dashboard"} />
            }
          />
          <Route
            exact
            path="/dashboard"
            render={() =>
              isLogin.isLogin ? <DashboardPage /> : <Redirect to={"/login"} />
            }
          />
          <Route
            exact
            path="/users"
            render={() =>
              isLogin.isLogin ? <UserPage /> : <Redirect to="/login" />
            }
          />
          <Route
            exact
            path="/users/add"
            render={() =>
              isLogin.isLogin ? <AddUserPage /> : <Redirect to="/login" />
            }
          />
          <Route
            exact
            path="/users/edit/:id"
            render={() =>
              isLogin.isLogin ? <EditUserPage /> : <Redirect to="/login" />
            }
          />
          <Route
            exact
            path="/roles"
            render={() =>
              isLogin.isLogin ? <RolePage /> : <Redirect to="/login" />
            }
          />
          <Route
            exact
            path="/roles/edit/:id"
            render={() =>
              isLogin.isLogin ? <EditRolePage /> : <Redirect to="/login" />
            }
          />
          <Route
            exact
            path="/roles/add"
            render={() =>
              isLogin.isLogin ? <AddRolePage /> : <Redirect to="/login" />
            }
          />
          <Route
            exact
            path="/permissions"
            render={() =>
              isLogin.isLogin ? <PermissionPage /> : <Redirect to="/login" />
            }
          />
          <Route
            exact
            path="/permissions/add"
            render={() =>
              isLogin.isLogin ? <AddPermissionPage /> : <Redirect to="/login" />
            }
          />
          <Route
            exact
            path="/permissions/edit/:id"
            render={() =>
              isLogin.isLogin ? (
                <EditPermissionPage />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

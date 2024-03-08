import { IonApp, IonRouterOutlet } from "@ionic/react";
import { LoginPage } from "../../pages/login/Login";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";
import { RegisterPage } from "../../pages/register/register";
import { DashboardPage } from "../../pages/dashboard/DashboardPage";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { UserPage } from "../../pages/users/UserPage";
import { AddUserPage } from "../../pages/users/insert/AddUserPage";
import { EditUserPage } from "../../pages/users/edit/EditUserPage";

export const Router: React.FC = () =>{
  const [isLogin,setIsLogin] = useState(true)
  useEffect(()=>{
    const getToken = async () =>{
      let token = Cookies.get('XSRF-TOKEN')
      if(token){
        setIsLogin(true)
      }else{
        setIsLogin(false)
      }
    }
    getToken()
  },[])
  console.log(isLogin, 'isLogin')
  return(
    <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route
            exact
            path="/login"
            render={() => <LoginPage />
            }
        />
        <Redirect exact from="/" to="/login" />
        <Route
            exact
            path="/register"
            render={() => <RegisterPage />
            }
        />
        <Route
            exact
            path="/dashboard"
            render={() => isLogin ? <DashboardPage /> : <Redirect to="/login" />
            }
        />
        <Route
            exact
            path="/users"
            render={() => isLogin ? <UserPage /> : <Redirect to="/login" />
            }
        />
        <Route
            exact
            path="/users/add"
            render={() => isLogin ? <AddUserPage /> : <Redirect to="/login" />
            }
        />
        <Route
            exact
            path="/users/edit/:id"
            render={() => isLogin ? <EditUserPage /> : <Redirect to="/login" />
            }
        />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
  )
}
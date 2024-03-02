import { IonApp, IonRouterOutlet } from "@ionic/react";
import { LoginPage } from "../../pages/login/login";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";
import { RegisterPage } from "../../pages/register/register";

export const Router: React.FC = () =>(
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
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
)
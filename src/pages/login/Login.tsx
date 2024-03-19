import { IonItem } from "@ionic/react";
import Cookies from "js-cookie";
import { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../../context/Auth";
import fetchAPI from "../../fetch";
export const LoginPage = () => {
  const history = useHistory();

  const { isLogin, setIsLogin } = useContext(AuthContext);

  const [form, setFrom] = useState({
    email: "",
    password: "",
    remember: 0,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    remember: 0,
  });

  // Handle form change
  const handleChange = (event: any) => {
    const { name, value } = event.target;

    // Update form state
    setFrom({
      ...form,
      [name]: value,
    });

    // Clear errors
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;

    // Validate email
    if (!form.email || !form.email.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required",
      }));

      isValid = false;
    } else if (!form.email.includes("@")) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format",
      }));

      isValid = false;
    }

    // Validate password
    if (!form.password || !form.password.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required",
      }));

      isValid = false;
    } else if (form.password.length < 8) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 8 characters",
      }));

      isValid = false;
    }

    return isValid;
  };

  // Handle form submission
  const onFinish = async (event: any) => {
    event.preventDefault();
    try {
      const response = await fetchAPI("/sanctum/csrf-cookie", {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 204) {
        const loginResponse = await fetchAPI("/login", {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        const meessage = await loginResponse.json();
        if (loginResponse.ok) {
          localStorage.setItem("user", JSON.stringify(form));

          // Redirect to dashboard
          history.push("/dashboard");
          setIsLogin({
            isLogin: true,
            isPending: true,
          });
        } else {
          console.log("Login failed");

          setErrors({
            ...errors,
            email: meessage.errors.email ? meessage.errors.email[0] : "",
            password: meessage.errors.password
              ? meessage.errors.password[0]
              : "",
          });
        }
      }
    } catch (error) {
      console.log(error, "Error");
    }
  };

  // console.log(errors, "errors");

  const appName = import.meta.env.VITE_APP_NAME;

  return (
    <div className="container my-auto mt-5">
      <div className="row">
        <div className="col-lg-4 col-md-8 col-12 mx-auto">
          <div className="card z-index-0 fadeIn3 fadeInBottom">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-primary shadow-primary border-radius-lg py-3 pe-1 mt-3">
                <h4 className="text-white font-weight-bolder text-center mt-2 mb-0">
                  {appName}
                </h4>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={onFinish} noValidate={true}>
                <div className="input-group input-group-dynamic mb-2">
                  <span className="input-group-text" id="basic-addon1">
                    <i className="bi bi-person-fill"></i>
                  </span>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    aria-label="email"
                    aria-describedby="basic-addon1"
                  />
                </div>
                {errors.email && (
                  <span className="text-danger text-s">{errors.email}</span>
                )}
                <div className="input-group input-group-dynamic mb-2">
                  <span className="input-group-text" id="basic-addon2">
                    <i className="bi bi-person-lock"></i>
                  </span>
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    aria-label="Password"
                    aria-describedby="basic-addon2"
                  />
                </div>
                {errors.password && (
                  <span className="text-danger text-s">{errors.password}</span>
                )}
                <div className="form-check form-switch d-flex align-items-center my-3">
                  <input
                    name="remember"
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                  />
                  <label className="form-check-label mb-0 ms-3">
                    Remember me
                  </label>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn bg-primary w-100 my-4 mb-2 text-white"
                  >
                    Sign in
                  </button>
                </div>
                <p className="mt-4 text-sm text-center">
                  Don't have an account?
                  <Link
                    className="text-primary font-weight-bold ms-2"
                    to="/register"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

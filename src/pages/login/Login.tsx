import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/Auth";
import fetchAPI from "../../fetch";
import Alert from "../../components/Alert";

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

  const handleChange = (event: any) => {
    const { name, value } = event.target;

    setFrom({
      ...form,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const onFinish = async (event: any) => {
    event.preventDefault();
    try {
      const csrfCookie = await fetchAPI("/sanctum/csrf-cookie", {
        method: "GET",
      });

      if (csrfCookie.status !== 204) return;

      const response = await fetchAPI("/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.toast("Login Success", "success");
        setIsLogin({
          isLogin: true,
          isPending: false,
        });
        history.push("/dashboard");
      } else {
        setErrors(data.errors);
      }
    } catch (error) {
      console.log(error, "Error");
    }
  };

  const appName = import.meta.env.VITE_APP_NAME;

  return (
    <div className="container my-auto mt-5">
      <div className="row">
        <div className="col-lg-4 col-md-8 col-12 mx-auto">
          <div className="card z-index-0 fadeIn3 fadeInBottom">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-primary shadow-primary border-radius-lg py-3 pe-1">
                <h4 className="text-white font-weight-bolder text-center mt-2 mb-0">
                  {appName}
                </h4>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={onFinish} noValidate={true}>
                <div className="input-group input-group-static mb-4 text-start">
                  <label>Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    className="form-control"
                    placeholder="syasa@example.com"
                  />
                  {errors.email && (
                    <span className="text-danger text-sm">{errors.email}</span>
                  )}
                </div>
                <div className="input-group input-group-static mb-4 text-start">
                  <label>Password</label>
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type="password"
                    className="form-control"
                    placeholder="********"
                    aria-label="Password"
                  />
                  {errors.password && (
                    <span className="text-danger text-sm">{errors.password}</span>
                  )}
                </div>
                <div className="form-check form-switch d-flex align-items-center my-4">
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
                    className="btn bg-gradient-dark w-100 mb-0 text-white"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

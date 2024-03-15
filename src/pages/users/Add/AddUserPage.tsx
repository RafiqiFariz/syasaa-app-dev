import Cookies from "js-cookie";
import { UserLayout } from "../../../components/Layout/Layout";
import { useState } from "react";
import { useHistory } from "react-router";
import fetchAPI from "../../../fetch";
import { ErrorMessage } from "../../../components/ErrorMessage";

export const AddUserPage = () => {
  const [form, setFrom] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    role_id: "0",
  });
  const [errors, setErrors] = useState({});

  const history = useHistory();

  // Handle form change
  const handleChange = (event: any) => {
    const {name, value} = event.target;

    setFrom({
      ...form,
      [name]: value,
    });
  };

  // Handle form submit
  const onFinish = async (event: any) => {
    event.preventDefault();

    try {
      const response = await fetchAPI("/api/v1/users", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors);
      } else {
        history.push("/users");
      }
    } catch (error) {
      console.log(error, "Error");
    }
  };

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12 col-lg-8 m-auto">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div
                className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">
                  Add User
                </h6>
              </div>
              <div className="card-body">
                <form onSubmit={onFinish}>
                  <div className="input-group input-group-dynamic mb-4 has-validation">
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      type="text"
                      className={`form-control ${errors["name"] ? "is-invalid" : ""}`}
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon0"
                    />
                    <ErrorMessage field="name" errors={errors}/>
                  </div>
                  <div className="input-group input-group-dynamic mb-4 has-validation">
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      className={`form-control ${errors["email"] ? "is-invalid" : ""}`}
                      placeholder="Email"
                      aria-label="email"
                      aria-describedby="basic-addon1"
                    />
                    <ErrorMessage field="email" errors={errors}/>
                  </div>
                  <div className="input-group input-group-dynamic mb-4 has-validation">
                    <input
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      type="password"
                      className={`form-control ${errors["password"] ? "is-invalid" : ""}`}
                      placeholder="Password"
                      aria-label="Password"
                      aria-describedby="password"
                    />
                    <ErrorMessage field="password" errors={errors}/>
                  </div>
                  <div className="input-group input-group-dynamic mb-4 has-validation">
                    <input
                      name="password_confirmation"
                      value={form.password_confirmation}
                      onChange={handleChange}
                      type="password"
                      className={`form-control ${errors["confirm_password"] ? "is-invalid" : ""}`}
                      placeholder="Confirm Password"
                      aria-label="Confirm Password"
                      aria-describedby="confirm-password"
                    />
                    <ErrorMessage field="confirm_password" errors={errors}/>
                  </div>
                  <div className="input-group input-group-static mb-4 has-validation">
                    <label
                      htmlFor="selectRoles"
                      className="ms-0"
                    >
                      Role
                    </label>
                    <select
                      name="role_id"
                      value={form.role_id}
                      className={`form-control ${errors["role_id"] ? "is-invalid" : ""}`}
                      id="selectRoles"
                      onChange={handleChange}
                    >
                      <option value={1}>Admin</option>
                      <option value={2}>Staff</option>
                      <option value={3}>Lecture</option>
                      <option value={4}>Mahasiswa</option>
                    </select>
                    <ErrorMessage field="role_id" errors={errors}/>
                  </div>
                  <div className="button-row d-flex mt-4">
                    <button className="btn bg-gradient-dark ms-auto mb-0" type="submit" title="Send">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

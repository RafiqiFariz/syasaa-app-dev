import Cookies from "js-cookie";
import { UserLayout } from "../../../components/Layout/Layout";
import { useContext, useState } from "react";
import { useHistory } from "react-router";
import fetchAPI from "../../../fetch";
import { ErrorMessage } from "../../../components/ErrorMessage";
import Alert from "../../../components/Alert";
import { FilterRole } from "../components/FilterRole";

interface IForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  role_id: number;
}

export const AddUserPage = () => {
  const [form, setFrom] = useState<IForm>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    role_id: 1,
  });
  const [rolesOptions, setRolesOptions] = useState({
    faculty_id: 1,
    address: "",
    class_id: 1,
  });
  const [errors, setErrors] = useState({});

  const history = useHistory();

  // Handle form change
  const handleChange = (event: any) => {
    const { name, value } = event.target;

    if (name === "role_id") {
      setFrom({
        ...form,
        [name]: parseInt(value),
      });
      return;
    }

    setFrom({
      ...form,
      [name]: value,
    });
  };

  const handleRoleOptionsChange = (event: any) => {
    const { name, value } = event.target;
    console.log(event.target, "event.target.value");
    if (name === "faculty_id" || name === "class_id") {
      setRolesOptions({
        ...rolesOptions,
        [name]: parseInt(value),
      });
    } else {
      setRolesOptions({
        ...rolesOptions,
        [name]: value,
      });
    }
  };

  // Handle form submit
  const onFinish = async (event: any) => {
    event.preventDefault();
    const body = {
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
      phone: form.phone,
      role_id: form.role_id,
      ...rolesOptions,
    };

    try {
      const response = await fetchAPI("/api/v1/users", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors);
      } else {
        history.goBack();
        Alert.success("Success", data.message);
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
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">Add User</h6>
              </div>
              <div className="card-body">
                <form onSubmit={onFinish}>
                  <div className="input-group input-group-dynamic mb-4 has-validation">
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      type="text"
                      className={`form-control ${
                        errors["name"] ? "is-invalid" : ""
                      }`}
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon0"
                    />
                    <ErrorMessage field="name" errors={errors} />
                  </div>
                  <div className="input-group input-group-dynamic mb-4 has-validation">
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      className={`form-control ${
                        errors["email"] ? "is-invalid" : ""
                      }`}
                      placeholder="Email"
                      aria-label="email"
                      aria-describedby="basic-addon1"
                    />
                    <ErrorMessage field="email" errors={errors} />
                  </div>
                  <div className="input-group input-group-dynamic mb-4 has-validation">
                    <input
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      type="password"
                      className={`form-control ${
                        errors["password"] ? "is-invalid" : ""
                      }`}
                      placeholder="Password"
                      aria-label="Password"
                      aria-describedby="password"
                    />
                    <ErrorMessage field="password" errors={errors} />
                  </div>
                  <div className="input-group input-group-dynamic mb-4 has-validation">
                    <input
                      name="password_confirmation"
                      value={form.password_confirmation}
                      onChange={handleChange}
                      type="password"
                      className={`form-control ${
                        errors["confirm_password"] ? "is-invalid" : ""
                      }`}
                      placeholder="Confirm Password"
                      aria-label="Confirm Password"
                      aria-describedby="confirm-password"
                    />
                    <ErrorMessage field="confirm_password" errors={errors} />
                  </div>
                  <div className="input-group input-group-static mb-4 has-validation">
                    <label htmlFor="selectRoles" className="ms-0">
                      Role
                    </label>
                    <select
                      name="role_id"
                      value={form.role_id}
                      className={`form-control ${
                        errors["role_id"] ? "is-invalid" : ""
                      }`}
                      id="selectRoles"
                      onChange={handleChange}
                    >
                      <option value={1}>Admin</option>
                      <option value={2}>Staff</option>
                      <option value={3}>Lecture</option>
                      <option value={4}>Mahasiswa</option>
                    </select>
                    <ErrorMessage field="role_id" errors={errors} />
                  </div>
                  <FilterRole
                    role={form.role_id}
                    onChange={handleRoleOptionsChange}
                    value={rolesOptions}
                    errors={errors}
                  />
                  <div className="button-row d-flex mt-4">
                    <button
                      className="btn bg-gradient-dark ms-auto mb-0"
                      type="submit"
                      title="Send"
                    >
                      Submit
                    </button>
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

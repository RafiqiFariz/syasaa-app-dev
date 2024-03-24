import Cookies from "js-cookie";
import { UserLayout } from "../../../components/Layout/Layout";
import { useHistory, useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import Alert from "../../../components/Alert";
import { ErrorMessage } from "../../../components/ErrorMessage";
import { FilterRole } from "../components/FilterRole";

export const EditUserPage = () => {
  const { id } = useParams<{ id: string }>();

  const [form, setFrom] = useState({
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

  const getUserDataById = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/users/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
        },
      });
      const data = await response.json();
      console.log(data, "data");
      if (response.ok) {
        setFrom(data.data);
        setRolesOptions({
          address: data.data?.lecturer.address ?? "",
          faculty_id: data.data.faculty ?? 1,
          class_id: data.data.student ?? 1,
        });
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

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
      const response = await fetch(`http://localhost:8000/api/v1/users/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
          "Content-Type": "application/json", // Add this line
        },
        body: JSON.stringify(body), // Convert form to JSON
      });

      const data = await response.json();

      if (response.ok) {
        history.goBack();
        Alert.success("Success", data.message);
      } else {
        setErrors(data.errors);
      }
    } catch (error) {
      console.log(error, "Error");
    }
  };
  useEffect(() => {
    getUserDataById();
  }, [id]);
  console.log(form, "form");
  console.log(rolesOptions, "rolesOptions");
  return (
    <UserLayout>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12 d-flex justify-content-center">
            <div className="card my-4 w-75">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                  <h6 className="text-white text-capitalize ps-3">
                    Edit User Form
                  </h6>
                </div>
                <div className="card-body px-5 pb-2">
                  <form onSubmit={onFinish}>
                    <div className="input-group input-group-dynamic mb-4">
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
                    <div className="input-group input-group-dynamic mb-4">
                      <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        type="email"
                        className={`form-control ${
                          errors["email"] ? "is-invalid" : ""
                        }`}
                        placeholder="email"
                        aria-label="email"
                        aria-describedby="basic-addon1"
                      />
                      <ErrorMessage field="email" errors={errors} />
                    </div>
                    <div className="input-group input-group-dynamic mb-4">
                      <input
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        type="password"
                        className={`form-control ${
                          errors["password"] ? "is-invalid" : ""
                        }`}
                        placeholder="password"
                        aria-label="Password"
                        aria-describedby="basic-addon2"
                      />
                      <ErrorMessage field="password" errors={errors} />
                    </div>
                    <div className="input-group input-group-dynamic mb-4">
                      <input
                        name="password_confirmation"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        type="password"
                        className={`form-control ${
                          errors["password_confirmation"] ? "is-invalid" : ""
                        }`}
                        placeholder="Confirm Password"
                        aria-label="Confirm Password"
                        aria-describedby="basic-addon3"
                      />
                      <ErrorMessage
                        field="password_confirmation"
                        errors={errors}
                      />
                    </div>
                    <div className="input-group input-group-static mb-4">
                      <label
                        htmlFor="exampleFormControlSelect1"
                        className="ms-0"
                      >
                        Role
                      </label>
                      <select
                        name="role_id"
                        value={form.role_id}
                        className={`form-control ${
                          errors["role_id"] ? "is-invalid" : ""
                        }`}
                        id="exampleFormControlSelect1"
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
                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn bg-primary w-100 my-4 mb-2 text-white"
                      >
                        Update User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

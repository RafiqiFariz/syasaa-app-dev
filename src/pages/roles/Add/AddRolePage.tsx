import { useEffect, useState } from "react";
import { UserLayout } from "../../../components/Layout/Layout";
import { useHistory } from "react-router";
import Cookies from "js-cookie";
import fetchAPI from "../../../fetch";
import { ErrorMessage } from "../../../components/ErrorMessage";

export const AddRolePage = () => {
  const history = useHistory();
  const [form, setForm] = useState({
    name: "",
    permissions: [{id: 0, name: ""}],
  });
  const [options, setOptions] = useState<Array<any>>([]);
  const [errors, setErrors] = useState({});

  const handleChange = (event: any) => {
    const {name, value} = event.target;
    console.log(event.target.name);
    setForm((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSelect = (event: any) => {
    const {value} = event.target;

    // Mengabaikan jika nilai yang dipilih adalah 0 atau sudah ada di dalam array permissions
    if (
      parseInt(value) === 0 ||
      form.permissions.some((permission) => permission.id === parseInt(value))
    ) {
      return;
    }

    // Menyiapkan objek permission baru
    const newPermission = {
      id: parseInt(value),
      name: options.find((option) => option.id === parseInt(value))?.name || "",
    };

    // Mengganti permissions dengan array baru yang termasuk permission baru
    setForm((prev: any) => {
      if (prev.permissions[0].id === 0) {
        return {
          ...prev,
          permissions: [newPermission],
        };
      }
      return {
        ...prev,
        permissions: [...prev.permissions, newPermission],
      };
    });
  };

  const deleteSelectedHandler = (index: number) => {
    if (form.permissions.length === 1) {
      setForm((prev: any) => {
        return {
          ...prev,
          permissions: [
            {
              id: 0,
              name: "",
            },
          ],
        };
      });
      return;
    }
    setForm((prev: any) => {
      return {
        ...prev,
        permissions: prev.permissions.filter((item: any) => item.id !== index),
      };
    });
  };

  console.log(form, "form");

  const getPermissions = async () => {
    try {
      const response = await fetchAPI("/api/v1/permissions", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
        },
      });

      const data = await response.json();

      if (data) {
        setOptions(data.data);
      }
      console.log(data, "data roles");
    } catch (error) {
      console.log(error, "error");
    }
  };

  const onFinish = async (event: any) => {
    event.preventDefault();
    try {
      const body = {
        name: form.name,
        permissions: form.permissions.map((permission: any) =>
          parseInt(permission.id)
        ),
      };

      console.log(body, "body");

      const response = await fetchAPI("/api/v1/roles", {
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
      console.log(data, "data role");

      if (!response.ok) {
        setErrors(data.errors);
      } else {
        history.push("/roles");
      }
    } catch (error) {
      console.log(error, "Error");
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12 col-lg-8 m-auto">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div
                className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">
                  Add Role
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
                      className={`form-control ${errors['name'] ? "is-invalid" : ""}`}
                      placeholder="Role Name"
                      aria-label="Role Name"
                      aria-describedby="role name"
                    />
                    <ErrorMessage field="name" errors={errors}/>
                  </div>
                  <div className="input-group input-group-static has-validation">
                    <label className="ms-0">Permissions</label>
                    <select
                      id="permissions"
                      title="Select Permissions"
                      className={`form-control ${errors['permissions'] ? "is-invalid" : ""}`}
                      multiple
                      onChange={handleSelect}
                    >
                      {options.map((option) => {
                        return (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        );
                      })}
                    </select>
                    <ErrorMessage field="permissions" errors={errors}/>
                  </div>
                  <div className="input-group input-group-dynamic mt-3 mb-4 w-100">
                    <div className="d-flex flex-wrap w-100 gap-2">
                      {form.permissions.map(
                        (permission: any, index: number) => {
                          if (permission.id === 0) {
                            return (
                              <span
                                key={index}
                                className="badge bg-primary me-2 d-flex align-items-center"
                              >
                                  No Permission
                                </span>
                            );
                          }
                          return (
                            <span
                              key={index}
                              className="badge bg-primary me-2 d-flex align-items-center"
                            >
                                {permission.name}
                              <button
                                type="button"
                                className="btn-close mx-2"
                                aria-label="Close"
                                onClick={() =>
                                  deleteSelectedHandler(permission.id)
                                }
                              ></button>
                              </span>
                          );
                        }
                      )}
                    </div>
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

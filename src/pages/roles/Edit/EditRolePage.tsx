import { useHistory, useParams } from "react-router";
import { UserLayout } from "../../../public/Layout/Layout";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export const EditRolePage = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState({
    name: "",
    permissions: [
      {
        id: 0,
        name: "",
      },
    ],
  });
  const [options, setOptions] = useState<Array<any>>([]);
  const history = useHistory();
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    console.log(event.target.name, "asdas");
    setForm((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const getRoles = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/roles/${id}?includePermissions=${id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
          },
        }
      );
      const data = await response.json();
      if (data) {
        console.log(data, "data");
        setForm({
          name: data.data.name,
          permissions: data.data.permissions,
        });
      }
      console.log(data, "dataRoles");
    } catch (error) {
      console.log(error, "error");
    }
  };
  const onFinish = async (event: any) => {
    event.preventDefault();
    console.log("Received values of form: ", JSON.stringify(form));
    try {
      const payload = {
        name: form.name,
        permissions: form.permissions.map((permission: any) => permission.id),
        _method: "PUT",
      };
      console.log(payload, "payload");
      const response = await fetch(`http://localhost:8000/api/v1/roles/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
          "Content-Type": "application/json", // Add this line
        },
        body: JSON.stringify(payload), // Convert form to JSON
      });
      const data = await response.json();
      if (data) {
        history.push("/roles");
      }
    } catch (error) {
      console.log(error, "Error");
    }
  };
  const DeleteSelectedHandler = (index: number) => {
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
  const handleSelect = (event: any) => {
    const { value } = event.target;

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
  const getPermissions = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/permissions", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
        },
      });
      const data = await response.json();
      console.log(data, "data----");
      if (response.ok) {
        console.log(data, "data----");
        setOptions(data.data);
      }
      console.log(data, "dataRoles");
    } catch (error) {
      console.log(error, "error");
    }
  };
  useEffect(() => {
    getRoles();
    getPermissions();
  }, [id]);

  console.log(form, "form");
  return (
    <UserLayout>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12 d-flex justify-content-center">
            <div className="card my-4 w-75">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                  <h6 className="text-white text-capitalize ps-3">
                    Edit Role Form
                  </h6>
                </div>
                <div className="card-body px-5 pb-2">
                  <form onSubmit={onFinish}>
                    <div className="input-group input-group-dynamic mb-4">
                      <span className="input-group-text" id="basic-addon0">
                        <i className="bi bi-person-fill"></i>
                      </span>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        type="text"
                        className="form-control"
                        placeholder="Role Name"
                        aria-label="Role Name"
                        aria-describedby="basic-addon0"
                      />
                    </div>
                    <div className="input-group input-group-static">
                      <label className="ms-0">Permissions</label>
                      <select
                        className="form-control"
                        id="exampleFormControlSelect2"
                        title="Select Options"
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
                    </div>
                    <div
                      className="input-group input-group-dynamic mt-3 mb-4 w-100"
                      style={{
                        overflowY: "auto",
                        maxHeight: "200px",
                      }}
                    >
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
                                    DeleteSelectedHandler(permission.id)
                                  }
                                ></button>
                              </span>
                            );
                          }
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn bg-primary w-100 my-4 mb-2 text-white"
                      >
                        Update Role
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

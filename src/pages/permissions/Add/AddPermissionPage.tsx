import { useState } from "react";
import { UserLayout } from "../../../public/Layout/Layout";
import Cookies from "js-cookie";
import { useHistory } from "react-router";

export const AddPermissionPage = () => {
  const history = useHistory();
  const [form, setForm] = useState({
    name: "",
  });
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  const onFinish = async (event: any) => {
    try {
      event.preventDefault();
      const response = await fetch("http://localhost:8000/api/v1/permissions", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (data) {
        history.push("/permissions");
      }
      console.log(data, "data");
    } catch (error) {
      console.log(error, "Error");
    }
  };
  return (
    <UserLayout>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12 d-flex justify-content-center">
            <div className="card my-4 w-50">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                  <h6 className="text-white text-capitalize ps-3">
                    Create Permissions Form
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
                        placeholder="Permissions Name"
                        aria-label="Permissions Name"
                        aria-describedby="basic-addon0"
                      />
                    </div>
                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn bg-primary w-100 my-4 mb-2 text-white"
                      >
                        Create Role
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

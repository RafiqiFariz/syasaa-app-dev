import { useEffect, useState } from "react";
import { UserLayout } from "../../../public/Layout/Layout";
import { useHistory, useParams } from "react-router";
import Cookies from "js-cookie";

export const EditPermissionPage = () => {
  const [form, setForm] = useState({
    name: "",
  });
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const getPermissionsById = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/permissions/${id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data) {
        setForm(data.data);
        console.log(data, "data");
      }
    } catch (error) {
      console.log(error, "error");
    }
  };
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    console.log(event.target.name);
    setForm({
      ...form,
      [name]: value,
    });
  };
  const onFinish = async (event: any) => {
    event.preventDefault();
    try {
      const payload = {
        name: form.name,
        _method: "PUT",
      };
      const response = await fetch(
        `http://localhost:8000/api/v1/permissions/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (data) {
        history.push("/permissions");
      }
    } catch (error) {
      console.log(error, "Error");
    }
  };
  useEffect(() => {
    getPermissionsById();
  }, []);
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
                        Update Permissions
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

import { useEffect, useState } from "react";
import { ErrorMessage } from "../../../components/ErrorMessage";
import { UserLayout } from "../../../components/Layout/Layout";
import { useHistory, useParams } from "react-router";
import Cookies from "js-cookie";
import fetchAPI from "../../../fetch";
import Swal from "sweetalert2";

export const EditFacultiesPage = () => {
  const [form, setForm] = useState({
    name: "",
  });
  const [errors, setErrors] = useState({});

  const { id } = useParams<{ id: string }>();

  const history = useHistory();

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const getFacultyData = async () => {
    try {
      const response = await fetchAPI(`/api/v1/faculties/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setForm(data.data);
      }
    } catch (error) {
      console.error(error, "Error");
    }
  };

  useEffect(() => {
    getFacultyData();
  }, []);

  console.log(form, "form");

  const onFinish = async (event: any) => {
    try {
      event.preventDefault();

      const payload = {
        name: form.name,
        _method: "PUT",
      };
      const result = await Swal.fire({
        title: "Update Confirmation!",
        text: "Are you sure you want to Update this faculty?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1D24CA",
        cancelButtonColor: "#F44335",
        confirmButtonText: "Yes, Update it!",
        customClass: {
          confirmButton: "btn btn-primary btn-sm ",
          cancelButton: "btn btn-danger btn-sm ",
        },
        heightAuto: false,
      });

      if (!result.isConfirmed) return;

      const response = await fetchAPI(`/api/v1/faculties/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors);
      } else {
        history.goBack();
      }
    } catch (error) {
      console.error(error, "Error");
    }
  };

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12 col-lg-6 m-auto">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">Add Faculty</h6>
              </div>
              <div className="card-body">
                <form onSubmit={onFinish}>
                  <div className="input-group input-group-dynamic mb-4 has-validation">
                    <input
                      name="name"
                      value={form.name ?? ""}
                      onChange={handleChange}
                      type="text"
                      className={`form-control ${
                        errors["name"] ? "is-invalid" : ""
                      }`}
                      placeholder="Faculty Name"
                      aria-label="Faculties Name"
                      aria-describedby="basic-addon0"
                    />
                    <ErrorMessage field="name" errors={errors} />
                  </div>
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

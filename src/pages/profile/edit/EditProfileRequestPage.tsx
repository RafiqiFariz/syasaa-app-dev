import { useState } from "react";
import { UserLayout } from "../../../components/Layout/Layout";
import fetchAPI from "../../../fetch";
import Cookies from "js-cookie";
import { useHistory } from "react-router";
import { ErrorMessage } from "../../../components/ErrorMessage";

export const EditProfileRequestPage = () => {
  const [form, setForm] = useState({
    new_value: "",
    changeField: "name",
    description: "",
    image: null,
  });

  const [errors, setErrors] = useState({});

  const options = [
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "image", label: "Image" },
  ];

  const history = useHistory();

  const UserLogin = JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };
  console.log(form, "form.changeField");

  const onFinish = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("changed_data", form.changeField);
    formData.append("description", form.description);
    formData.append("status", "pending");
    formData.append("student_id", UserLogin.student.id);

    if (form.changeField === "image") {
      console.log("salah masuk sini");
      formData.append("image", form.image);
      formData.delete("old_value");
    } else {
      console.log("masuk sini");
      formData.append("new_value", form.new_value);
      formData.append("old_value", UserLogin[form.changeField]);
    }
    console.log("fdataorm ", form);

    try {
      const response = await fetchAPI("/api/v1/update-profile-requests", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
        },
      });
      const data = await response.json();
      console.log(data, "response");

      if (response.ok) {
        history.push("/profile");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors(error.errors);
    }
  };

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12 d-flex justify-content-center">
          <div className="card my-4 w-50">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">
                  Edit Profile Request Form
                </h6>
              </div>
              <div className="card-body px-5 pb-2">
                <form onSubmit={onFinish}>
                  <div className="input-group input-group-static mb-4 has-validation">
                    <label>Change Profile Data</label>
                    <select
                      name="changeField"
                      className="form-control"
                      onChange={handleChange}
                      value={form.changeField}
                    >
                      {options.map((item, i) => (
                        <option key={i} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <ErrorMessage field="changeField" errors={errors} />
                  </div>
                  {form.changeField === "image" ? (
                    <div className="input-group input-group-static has-validation mb-3">
                      <label className="mb-1">Change Image</label>
                      <input
                        className="form-control form-control-sm"
                        id="formFileSm"
                        type="file"
                        name="image"
                        onChange={handleChange}
                      />
                      <ErrorMessage field="image" errors={errors} />
                    </div>
                  ) : (
                    <div className="input-group input-group-static mb-4 has-validation">
                      <label className="mb-1">New {form.changeField}</label>
                      <input
                        name="new_value"
                        value={form.new_value || ""}
                        onChange={handleChange}
                        type="text"
                        className={`form-control ${
                          errors["new_value"] ? "is-invalid" : ""
                        }`}
                        placeholder={`New ${form.changeField}`}
                      />
                      <ErrorMessage field="new_value" errors={errors} />
                    </div>
                  )}

                  <div className="input-group input-group-static has-validation mt-3 mb-4 w-100">
                    <label>Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows={5}
                      placeholder="Description"
                      spellCheck="false"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn bg-primary w-100 my-4 mb-2 text-white"
                    >
                      Send Request
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

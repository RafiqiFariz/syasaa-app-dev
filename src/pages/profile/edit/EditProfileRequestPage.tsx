import { useState } from "react";
import { UserLayout } from "../../../components/Layout/Layout";
import fetchAPI from "../../../fetch";
import Cookies from "js-cookie";

export const EditProfileRequestPage = () => {
  const [form, setForm] = useState({
    changeField: "",
    description: "",
    image: "",
  });

  const options = [
    {
      value: "name",
      label: "Name",
    },
    {
      value: "email",
      label: "Email",
    },
    {
      value: "phone",
      label: "Phone",
    },
  ];
  const UserLogin = JSON.parse(localStorage.getItem("user"));
  console.log(UserLogin, "UserLogin");
  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({
        ...form,
        [name]: files[0], // Simpan file gambar ke dalam state
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const onFinish = async (e: any) => {
    e.preventDefault();
    const formData = {
      changed_data: form.changeField,
      description: form.description,
      image: form.image,
      status: "pending",
      student_id: UserLogin.student.id,
      change_to: UserLogin.name,
    };
    // Buat objek FormData

    console.log(formData, "formData");
    try {
      const response = await fetchAPI("/api/v1/update-profile-requests", {
        method: "POST",

        body: JSON.stringify(formData), // Kirim FormData ke API
      });
      const data = await response.json();
      console.log("Response from API:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  console.log(form, "form");
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
                      name={"changeField"}
                      className="form-control"
                      // id={name_form}
                      onChange={handleChange}
                    >
                      {options.map((item, i) => (
                        <option key={i} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group input-group-static has-validation mb-3">
                    <label className="mb-1">Change Image</label>
                    <input
                      className="form-control form-control-sm"
                      id="formFileSm"
                      type="file"
                      name="image"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-group input-group-static has-validation mt-3 mb-4 w-100">
                    <label>Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      // value={form.description ?? ""}
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
                      Update Permissions
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

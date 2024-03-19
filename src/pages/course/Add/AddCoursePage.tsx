import { useState } from "react";
import { ErrorMessage } from "../../../components/ErrorMessage";
import { UserLayout } from "../../../components/Layout/Layout";
import Cookies from "js-cookie";
import fetchAPI from "../../../fetch";
import { useHistory } from "react-router";

export const AddCoursePage = () => {
  const history = useHistory();
  const [errors, setErrors] = useState({} as any);
  const [form, setForm] = useState({
    name: "",
    description: null,
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setForm((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const onFinish = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetchAPI("/api/v1/courses", {
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
      console.log(response, "data");
      if (!response.ok) {
        setErrors(data.errors);
      }
      if (response.ok) {
        history.goBack();
      }
    } catch (error) {
      console.log(error, "error");
    }
  };
  console.log(form, "form");
  return (
    <UserLayout>
      <div className="row">
        <div className="col-12 col-lg-8 m-auto">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">Add Course</h6>
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
                      placeholder="Course Name"
                      aria-label="Course Name"
                      aria-describedby="course name"
                    />
                    <ErrorMessage field="name" errors={errors} />
                  </div>
                  <div className="input-group input-group-dynamic mt-3 mb-4 w-100">
                    <textarea
                      name="description"
                      className="form-control"
                      rows={5}
                      placeholder="Description Course"
                      spellCheck="false"
                      onChange={handleChange}
                    ></textarea>
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

import { useEffect, useState } from "react";
import { ErrorMessage } from "../../../components/ErrorMessage";
import { UserLayout } from "../../../components/Layout/Layout";
import Cookies from "js-cookie";
import fetchAPI from "../../../fetch";
import { useHistory } from "react-router";

interface OptionsData {
  id: number;
  name: string;
}

export const AddMajorPage = () => {
  const [form, setForm] = useState({
    name: "",
    faculty_id: 1,
  });
  const [errors, setErrors] = useState({});
  const [faculties, setFaculties] = useState<Array<OptionsData>>([]);

  const history = useHistory();

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const onFinish = async (event: any) => {
    event.preventDefault();
    try {
      const response = await fetchAPI("/api/v1/majors", {
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

      if (response.ok) {
        history.goBack();
      } else {
        setErrors(data.errors);
      }
    } catch (error) {
      console.error(error, "Error");
    }
  };

  const getFacultyData = async () => {
    try {
      const response = await fetchAPI("/api/v1/faculties", {
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
        setFaculties(data.data);
      }
    } catch (error) {
      console.error(error, "Error");
    }
  };

  useEffect(() => {
    getFacultyData();
  }, []);
  console.log(form, "faculties");

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12 col-lg-6 m-auto">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">Add Major</h6>
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
                      placeholder="Major Name"
                      aria-label="Major Name"
                      aria-describedby="basic-addon0"
                    />
                    <ErrorMessage field="name" errors={errors} />
                  </div>
                  <div className="input-group input-group-static mb-4">
                    <label htmlFor="exampleFormControlSelect1" className="ms-0">
                      Faculty
                    </label>
                    <select
                      name="faculty_id"
                      className="form-control"
                      id="exampleFormControlSelect1"
                      onChange={handleChange}
                    >
                      {faculties.map((faculty) => (
                        <option key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </option>
                      ))}
                    </select>
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

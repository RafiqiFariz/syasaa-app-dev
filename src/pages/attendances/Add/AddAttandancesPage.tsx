import { useContext, useEffect, useState } from "react";
import { UserLayout } from "../../../components/Layout/Layout";
import { useGeoLocation } from "../../../hooks/useGeoLocation";
import { useHistory } from "react-router";
import { getDistance } from "geolib";
import { ErrorMessage } from "../../../components/ErrorMessage";
import Cookies from "js-cookie";
import fetchAPI from "../../../fetch";
import Swal from "sweetalert2";
import Alert from "../../../components/Alert";

export const AddAttandancesPage = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    course_class_id: "",
    student_image: "",
    lecturer_image: "",
  });
  const [errors, setErrors] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const getUserLocation = useGeoLocation();
  const history = useHistory();

  const getLocation = async () => {
    console.log(getUserLocation, "location");
    const distance = getDistance(
      {
        latitude: getUserLocation.location?.latitude,
        longitude: getUserLocation.location?.longitude,
      },
      {
        latitude: parseFloat(user.student.class.lat),
        longitude: parseFloat(user.student.class.lng),
      }
    );
    if (distance >= 10) {
      const result = await Alert.confirm(
        "Location Confirmation",
        "You are not in the class location, please change places or do attendance request!",
        "Go Back to Attendances"
      );
      console.log(result, "result");
      return history.push("/attendances");
    }
  };

  const getCourseClass = async () => {
    try {
      const response = await fetchAPI(
        `/api/v1/course-classes?includeCourse=1&class_id=${user.student.class_id}`
      );
      const data = await response.json();
      console.log(data, "data123123");
      if (response.ok) {
        if (data.data.length === 0) {
          setErrors({
            course_class_id: ["You don't have any class"],
          });
        }
        setCourses(data.data);
        setForm({
          ...form,
          course_class_id: data.data[0].id,
        });
      }
    } catch (error) {
      console.error(error, "Error");
    }
  };

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({
        ...form,
        [name]: files[0],
      });
    } else if (name === "present") {
      setForm({
        ...form,
        [name]: e.target.checked,
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
    const formData = new FormData();
    formData.append("student_image", form.student_image);
    formData.append("lecturer_image", form.lecturer_image);
    formData.append("student_id", user.student.id);
    formData.append("course_class_id", form.course_class_id);
    formData.append("is_present", "1");

    console.log(formData.get("course_class_id"), "form123");
    try {
      const response = await fetch("http://localhost:8000/api/v1/attendances", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
        },
      });
      const data = await response.json();
      console.log(data, "data");
      console.log(response, "response");
      if (response.ok) {
        // history.push("/attendances");
        // Alert.success("Success", data.message);
      } else {
        Alert.error("Error", data.message);
        // setErrors(data.errors);
      }
    } catch (error) {
      // setErrors(error.errors);
      console.error(error, "error");
    }
  };

  useEffect(() => {
    if (!getUserLocation.loading) {
      getLocation();
      getCourseClass();
    }
  }, [getUserLocation.loading]);

  if (getUserLocation.loading) {
    return (
      <div className="d-flex absolute justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  }

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12 col-lg-6 m-auto">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">
                  Add Attendance
                </h6>
              </div>
              <div className="card-body">
                <form onSubmit={onFinish}>
                  <div className="input-group input-group-static has-validation mb-3">
                    <label>Course Class</label>
                    <select
                      name="course_class_id"
                      className={`form-control ${
                        errors["course_class_id"] ? "is-invalid" : ""
                      }`}
                      // id={name_form}
                      value={form.course_class_id}
                      onChange={handleChange}
                      disabled={courses.length === 0}
                    >
                      {courses.map((item, i) => {
                        console.log(item, "item");
                        return (
                          <option key={i} value={item.id}>
                            {item.course.name} - {user.student.class.name}
                          </option>
                        );
                      })}
                    </select>
                    <ErrorMessage field="course_class_id" errors={errors} />
                  </div>
                  <div className="has-validation mb-3">
                    <label className="mb-1">Student Image</label>
                    <input
                      name="student_image"
                      className={`form-control form-control-sm ${
                        errors["student_image"] ? "is-invalid" : ""
                      }`}
                      id="formFilesm"
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                    />
                    <ErrorMessage field="student_image" errors={errors} />
                  </div>
                  <div className="has-validation mb-3">
                    <label className="mb-1">Lecturer Image</label>
                    <input
                      className={`form-control form-control-sm ${
                        errors["student_image"] ? "is-invalid" : ""
                      }`}
                      id="formFileSm"
                      type="file"
                      accept="image/*"
                      name="lecturer_image"
                      onChange={handleChange}
                    />
                    <ErrorMessage field="lecturer_image" errors={errors} />
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

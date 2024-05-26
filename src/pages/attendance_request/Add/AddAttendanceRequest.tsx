import { useEffect, useRef, useState } from "react";
import { UserLayout } from "../../../components/Layout/Layout";
import fetchAPI from "../../../fetch";
import { useGeoLocation } from "../../../hooks/useGeoLocation";
import { getDistance } from "geolib";
import Alert from "../../../components/Alert";
import { useHistory } from "react-router";
import { ErrorMessage } from "../../../components/ErrorMessage";
import Cookies from "js-cookie";
import WebcamComponent from "../../../components/WebCamComponent";

export const AddAttendanceRequest = () => {
  const getUserLocation = useGeoLocation();
  const evidenceOptions = [
    {
      value: "present",
      label: "Present",
    },
    {
      value: "absent",
      label: "Absent",
    },
    {
      value: "late",
      label: "Late",
    },
    {
      value: "permit",
      label: "Permit",
    },
    {
      value: "sick",
      label: "Sick",
    },
    {
      value: "other",
      label: "Other",
    },
  ];

  const [form, setForm] = useState({
    course_class_id: "",
    student_image: null,
    evidence: "present",
    description: "",
  });

  const [courseClass, setCourseClass] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    course_class_id: [""],
    student_image: "",
    evidence: "",
    description: "",
  });

  const UserLogin = JSON.parse(localStorage.getItem("user") || "{}");

  const history = useHistory();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedOption, setSelectedOption] = useState("upload");

  const getCourseClass = async () => {
    setLoading(true);
    try {
      const response = await fetchAPI(
        `/api/v1/course-classes?includeCourse=1&class_id=${UserLogin.student.class_id}`
      );
      const data = await response.json();
      console.log(data, "data123123");
      if (response.ok) {
        if (data.data.length === 0) {
          setErrors({
            description: "", evidence: "", student_image: "",
            course_class_id: ["You don't have any class"]
          });
          setLoading(false);
        }

        const mappedData = data.data.map((item) => {
          return {
            value: item.id,
            label: `${item.course.name} - ${UserLogin.student.class.name}`,
          };
        });

        setCourseClass(mappedData);
        setLoading(false);
      }
    } catch (error) {
      console.error(error, "Error");
    }
  };
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error(error, "Error");
    }
  };

  const stopVideo = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }
  };

  useEffect(() => {
    getCourseClass();
    startVideo();

    return () => {
      stopVideo();
    };
  }, []);

  const handleChange = (event: any) => {
    const {name, value} = event.target;

    if (name === "student_image") {
      setForm({
        ...form,
        student_image: event.target.files[0],
      });
      return;
    }
    setForm({
      ...form,
      [name]: value,
    });
  };

  const options = [
    {value: "upload", label: "upload Image"},
    {value: "capture", label: "capture Image"},
  ];

  const onFinish = async (event: any) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("student_id", UserLogin.student.id);
      formData.append("course_class_id", form.course_class_id);
      formData.append("evidence", form.evidence);
      formData.append("description", form.description);
      formData.append("student_image", form.student_image);
      // console.log(formData.get("student_image"), "formdata");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/attendance-requests`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            Accept: "application/json",
            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        history.goBack();
        Alert.success("Success", data.message);
        return;
      }

      console.log(data, "data");

      setErrors(data.errors);

      if (response.status === 409) {
        history.push("/attendance-requests");
        Alert.error("Error", data.message);
      }

    } catch (error) {
      console.error(error, "Error");
    }
  };

  const handleCaptureStudentImage = async (e) => {
    e.preventDefault();

    // jika student_image tidak null, pengguna bisa mengambil gambar kembali
    if (form.student_image !== null) {
      setForm((prev: any) => {
        return {
          ...prev,
          student_image: null,
        };
      });
      await startVideo();
      return;
    }

    console.log('yeay')

    // jika student_image null, pengguna bisa mengambil gambar
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")
      .drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File(
        [blob],
        "captured_image.jpg",
        {
          type: "image/jpeg",
        }
      );

      setForm((prev: any) => {
        return {
          ...prev,
          student_image: file,
        };
      });
    }, "image/jpeg");
    stopVideo();
  };

  console.log(form, "form");

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12 col-lg-6 m-auto">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div
                className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">
                  Add Attendance Request
                </h6>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={onFinish}>
                <div className="input-group input-group-static has-validation mb-3 d-flex justify-content-center">
                  {form.student_image === null ? (
                    <video
                      ref={videoRef}
                      autoPlay={true}
                      muted
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    <img
                      src={`${
                        form.student_image
                          ? URL.createObjectURL(form.student_image as any)
                          : "https://via.placeholder.com/150"
                      }`}
                      className="rounded-3 my-2"
                      alt="none"
                    />
                  )}

                  <canvas ref={canvasRef} style={{display: "none"}}/>

                  {errors?.student_image && (
                    <span className="text-danger text-sm">{errors?.student_image}</span>
                  )}
                </div>
                <button
                  className={`btn ${form.student_image ? 'btn-outline-info' : 'bg-gradient-info'} d-flex justify-content-center align-content-center align-middle w-100 mb-3`}
                  onClick={handleCaptureStudentImage}
                >
                  {form.student_image && (
                    <i className="bi bi-arrow-repeat me-2 fs-6"></i>
                  )}
                  <span className="change-camera-text">
                    {form.student_image !== null
                      ? "Retake Image"
                      : "Capture Image"}
                  </span>
                </button>

                <div className="input-group input-group-static has-validation mb-3">
                  <label>Schedule</label>
                  <select
                    name="course_class_id"
                    className={`form-control ${
                      errors["course_class_id"] ? "is-invalid" : ""
                    }`}
                    value={form.course_class_id}
                    onChange={handleChange}
                    disabled={courseClass.length === 0 || loading}
                  >
                    <option value="" disabled selected>
                      Select Schedule
                    </option>
                    {courseClass.map((item, i) => {
                      return (
                        <option key={i} value={item.value}>
                          {item.label}
                        </option>
                      );
                    })}
                  </select>
                  <ErrorMessage field="course_class_id" errors={errors}/>
                </div>

                <div className="input-group input-group-static has-validation mb-3">
                  <label>Evidence</label>
                  <select
                    name="evidence"
                    className={`form-control ${
                      errors["evidence"] ? "is-invalid" : ""
                    }`}
                    // id={name_form}
                    value={form.evidence}
                    onChange={handleChange}
                    //   disabled={courses.length === 0}
                  >
                    {evidenceOptions.map((item, i) => {
                      return (
                        <option key={i} value={item.value}>
                          {item.label}
                        </option>
                      );
                    })}
                  </select>
                  <ErrorMessage field="evidence" errors={errors}/>
                </div>
                <div className="input-group input-group-static has-validation mb-3">
                  <label>Description</label>
                  <textarea
                    name="description"
                    className={`form-control ${
                      errors["description"] ? "is-invalid" : ""
                    }`}
                    rows={5}
                    placeholder="Description"
                    value={form.description}
                    spellCheck="false"
                    onChange={handleChange}
                  />
                  <ErrorMessage field="description" errors={errors}/>
                </div>

                <div className="button-row d-flex mt-4">
                  <button
                    className="btn bg-gradient-dark ms-auto mb-0"
                    type="submit"
                    title="Send"
                    // onClick={onFinish}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

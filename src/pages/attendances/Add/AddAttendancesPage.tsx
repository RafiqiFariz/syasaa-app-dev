import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { UserLayout } from "../../../components/Layout/Layout";
import { useGeoLocation } from "../../../hooks/useGeoLocation";
import { useHistory } from "react-router";
import { getDistance } from "geolib";
import { ErrorMessage } from "../../../components/ErrorMessage";
import * as faceapi from "face-api.js";
import Alert from "../../../components/Alert";
import "../attendance.css";
import _ from "lodash";
import { AuthContext } from "../../../context/Auth";
import fetchAPI from "../../../fetch";
import Cookies from "js-cookie";

export const AddAttendancesPage = () => {
  const {isLogin, setIsLogin} = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    course_class_id: "",
    student_image: null,
    lecturer_image: null,
  });
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [errors, setErrors] = useState({});
  const getUserLocation = useGeoLocation();
  const history = useHistory();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const [facingMode, setFacingMode] = useState("user");
  const [prediction, setPrediction] = useState(null);
  const [isPredictionDone, setIsPredictionDone] = useState({
    student: false,
    lecturer: false,
  });
  const [step, setStep] = useState(1);
  const [distance, setDistance] = useState(0);
  const [flashlight, setFlashlight] = useState(true);

  const user = isLogin.data;
  const ALLOWED_DISTANCE = 20;

  const defaultInstructions = () => {
    return (
      <>
        <p className="mb-0">Detecting your face...</p>
        <p className="mb-0">Make sure you are in a well-lit environment.</p>
      </>
    );
  };

  const [instructions, setInstructions] = useState<String | JSX.Element>(
    defaultInstructions
  );

  const getLocation = async () => {
    // console.log(getUserLocation, "location");
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

    // distance harus diubah ketika di production
    if (distance >= ALLOWED_DISTANCE) {
      const result = await Alert.confirm(
        "Location Confirmation",
        "You are not in the class location, please change places or do attendance request!",
        "Go Back to Attendances",
        "",
        false
      );

      const response = await fetchAPI("/api/v1/attendances", {
        method: "POST",
        body: JSON.stringify({
          student_id: user.student.id,
          is_present: 0,
        }),
      });

      const data = response.json();
      if (data) return history.push("/attendances");
    }

    setDistance(distance);
  };

  const startVideo = () => {
    const constraints = {
      video: {
        zoom: true,
        facingMode: facingMode,
        width: {min: 1024, ideal: 1280, max: 1920},
        height: {min: 576, ideal: 720, max: 1080},
      },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        if (!dimensions.width && !dimensions.height) {
          calculate();
        }
      })
      .catch((error) => {
        console.error(error, "Error getting video stream");
      });
  };

  const calculate = () => {
    let width = window.getComputedStyle(videoRef.current).width;
    let height = window.getComputedStyle(videoRef.current).height;
    width = width.replace("px", "");
    height = height.replace("px", "");

    setDimensions({
      width: +width,
      height: +height,
    });

    canvasRef.current.width = +width;
    canvasRef.current.height = +height;
  };

  const stopVideo = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }
  };

  const handleChangeCamera = () => {
    setFacingMode(facingMode === "user" ? "environment" : "user");
  };

  const handleFlashlight = () => {
    const video = videoRef.current;
    const track = video.srcObject.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);

    imageCapture.getPhotoCapabilities().then(async () => {
      const photoCapabilities = await imageCapture.getPhotoCapabilities();
      if (photoCapabilities.fillLightMode.includes("flash")) {
        await track.applyConstraints({
          advanced: [{torch: flashlight}],
        });
        setFlashlight((prev) => !prev);
      }
    });
  };

  const predictFace = async () => {
    const API_ML_URL = import.meta.env.VITE_API_ML_URL;
    const formData = new FormData();
    formData.append("image", form.student_image);
    return await fetch(`${API_ML_URL}/predict`, {
      method: "POST",
      body: formData,
    });
  };

  const captureImage = async (canvas: any) => {
    if (isPredictionDone.student && isPredictionDone.lecturer) return;

    canvas.toBlob((blob) => {
      const timestamp = new Date().getTime();
      const file = new File([blob], `${timestamp}.jpg`, {
        type: "image/jpeg",
      });

      if (!isPredictionDone.student) {
        setForm({
          ...form,
          student_image: file,
        });
      } else {
        setForm({
          ...form,
          lecturer_image: file,
        });
      }
    }, "image/jpeg");
  };

  const loadModels = async () => {
    await faceapi.loadFaceDetectionModel("./models");
    await detectFace();
  };

  const detectFace = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const intervalId = setInterval(async () => {
      if (!canvas.width && !canvas.height) return;

      const displaySize = {width: canvas.width, height: canvas.height};
      faceapi.matchDimensions(canvas, displaySize);

      const detections = await faceapi.detectSingleFace(video);

      if (detections) {
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        canvas
          .getContext("2d")
          .clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
      }
    }, 1000);

    intervalRef.current = intervalId;
  };

  useEffect(() => {
    startVideo();
    setTimeout(() => {
      videoRef && loadModels();
    }, 1000);

    return () => {
      stopVideo();
      clearInterval(intervalRef.current);
    };
  }, [dimensions, facingMode]);

  const handleInstruction = () => {
    if (isPredictionDone.student && !isPredictionDone.lecturer && step === 1) {
      setStep(2);
      return (
        <>
          <p className="mb-0">Now, take a picture of your lecturer!</p>
          <p className="mb-0">Change your camera first!</p>
        </>
      );
    } else if (isPredictionDone.student && !isPredictionDone.lecturer && step === 2) {
      return (
        <>
          <p className="mb-0">Make sure the distance between the camera and the lecturer is no more than 2 meters, so that it can be detected properly.</p>
        </>
      );
    } else if (isPredictionDone.student && isPredictionDone.lecturer) {
      return "Attendance was successful";
    } else {
      return defaultInstructions();
    }
  };

  const handlePredictFace = async () => {
    try {
      if (isPredictionDone.student && isPredictionDone.lecturer) return;

      if (step === 1 || (step === 2 && facingMode === "environment")) {
        const response = await predictFace();
        const data = await response.json();

        if (_.isArray(data) && !_.isEmpty(data)) {
          setPrediction(data);

          const predictionName = _.replace(data[0][0], "_", " ");
          const currentName = _.toLower(user.name);
          const lecturerName = _.toLower(selectedSchedule.lecturer.user.name);

          if (predictionName !== currentName) {
            Alert.error(
              "Error",
              "Oops! It looks like there was a mismatch between the predicted face and the expected face. Please ensure that your camera is clear and well-positioned, then try again. If the issue persists, please contact our support team for further assistance."
            );
            return;
          }

          if (step === 1) {
            setInstructions(`Face detected, ${data[0][0]}`);
            setPrediction(null);
          } else {
            setInstructions(`Lecturer face detected, ${prediction[0][0]}`);
            setPrediction(null);
          }

          setIsPredictionDone({
            // lecturer: predictionName === lecturerName && step === 2,
            lecturer: step === 2, // karena prediksi lecturer selalu salah, maka di hardcode
            student: predictionName === currentName,
          });
        }
      }
    } catch (e) {
      console.error(e, "error");
    }
  };

  // capture image every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (dimensions.width && dimensions.height) {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas
          .getContext("2d")
          .drawImage(video, 0, 0, dimensions.width, dimensions.height);
        await captureImage(canvas);
      }
    }, 3000);
    return () => clearInterval(intervalId);
  });

  // predict face every 3 seconds, after image is captured
  useEffect(() => {
    const isStudentAccSufficient =
      form.student_image && prediction && prediction[0][1] >= 75;
    const isLecturerAccSufficient =
      form.lecturer_image && prediction && prediction[0][1] >= 75;

    handlePredictFace();
  }, [form, step, facingMode]);

  useEffect(() => {
    setTimeout(() => {
      setInstructions(
        handleInstruction()
      );
    }, 2000);
  }, [isPredictionDone, facingMode])

  const getCourseClass = async () => {
    try {
      const response = await fetchAPI(
        `/api/v1/course-classes?includeCourse=1&includeLecturer=1&class_id=${user.student.class_id}`
      );
      const data = await response.json();
      console.log(data, "data123123");

      const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

      const d = new Date();
      let day = weekday[d.getDay()];

      // cari course hari ini, dengan jam sekarang berada di antara start_time dan end_time
      const course = _.find(data.data, (item: any) => {
        const startTime = new Date();
        let [hours, minutes, seconds] = item.start_time.split(':').map(Number);
        startTime.setHours(hours, minutes, seconds);

        [hours, minutes, seconds] = item.end_time.split(':').map(Number);
        const endTime = new Date();
        endTime.setHours(hours, minutes, seconds);
        return day === item.day && d >= startTime && d <= endTime;
      });

      setSelectedSchedule(course);

      if (response.ok) {
        if (data.data.length === 0) {
          setErrors({
            course_class_id: ["You don't have any class"],
          });
        }
        setCourses(data.data);
        setForm({
          ...form,
          course_class_id: course.id,
        });
      }
    } catch (error) {
      console.error(error, "Error");
    }
  };

  const handleChange = (e: any) => {
    const {name, value, files} = e.target;
    if (files) {
      setForm({
        ...form,
        [name]: files[0],
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

    const present =
      distance <= ALLOWED_DISTANCE &&
      isPredictionDone.student &&
      isPredictionDone.lecturer;

    formData.append("student_image", form.student_image);
    formData.append("lecturer_image", form.lecturer_image);
    formData.append("course_class_id", form.course_class_id);
    formData.append("student_id", user.student.id);
    formData.append("is_present", present ? "1" : "0");
    console.log(form, "form123");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/attendances`, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
        },
      });
      const data = await response.json();
      console.log(data, "data");

      if (response.ok) {
        history.push("/attendances");
        Alert.success("Success", data.message);
      } else {
        Alert.error("Error", data.message);
        setErrors(data.errors);
        history.push("/attendances");
      }
    } catch (error) {
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
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                <h6 className="text-white text-capitalize ps-3">Clock In</h6>
              </div>
            </div>
            <div className="card-body">
              <div className="alert alert-info text-white d-flex">
                  <span className="alert-icon align-middle me-2">
                    <i className="bi bi-info-circle-fill"></i>
                  </span>
                <span
                  className={`alert-text ${!isPredictionDone.student ? 'blinking-text' : ''}`}
                >{instructions}</span>
              </div>
              <form onSubmit={onFinish}>
                <div className="d-flex align-items-center position-relative ratio ratio-16x9 mb-3">
                  <video
                    src=""
                    crossOrigin="anonymous"
                    ref={videoRef}
                    autoPlay={true}
                    width="100%"
                    height="100%"
                  ></video>
                  <canvas
                    ref={canvasRef}
                    width="100%"
                    className="position-absolute top-50 start-50 translate-middle"
                  ></canvas>
                </div>
                <div
                  className="btn-group w-100"
                  role="group"
                  aria-label="Basic checkbox toggle button group"
                >
                  <input
                    type="checkbox"
                    className="btn-check"
                    id="btncheck1"
                    autoComplete="off"
                    disabled={facingMode !== "environment"}
                    onClick={handleFlashlight}
                  />
                  <label
                    className="btn btn-outline-info ms-0 d-flex justify-content-center align-content-center align-middle"
                    htmlFor="btncheck1"
                  >
                    <i className="bi bi-lightning-fill me-1 fs-6"></i>
                    <span>Flashlight</span>
                  </label>

                  <input
                    type="checkbox"
                    className="btn-check"
                    id="btncheck2"
                    autoComplete="off"
                    onClick={handleChangeCamera}
                  />
                  <label
                    className="btn btn-outline-info ms-0 d-flex justify-content-center align-content-center align-middle"
                    htmlFor="btncheck2"
                  >
                    <i className="bi bi-arrow-repeat me-2 fs-6"></i>
                    <span className="change-camera-text">Change Camera</span>
                  </label>
                </div>

                <div className="input-group input-group-static has-validation mb-3">
                  <label>Course Class</label>
                  <select
                    name="course_class_id"
                    className={`form-control ${
                      errors["course_class_id"] ? "is-invalid" : ""
                    }`}
                    value={form.course_class_id}
                    onChange={handleChange}
                    disabled={courses.length === 0}
                  >
                    {courses.map((item, i) => {
                      return (
                        <option key={i} value={item.id}>
                          {item.course.name} - {user.student.class.name}
                        </option>
                      );
                    })}
                  </select>
                  <ErrorMessage field="course_class_id" errors={errors}/>
                </div>
                <div className="has-validation mb-3 d-none">
                  <label className="mb-1">Student Image</label>
                  <input
                    name="student_image"
                    className={`form-control form-control-sm ${
                      errors["student_image"] ? "is-invalid" : ""
                    }`}
                    id="studentImage"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  <ErrorMessage field="student_image" errors={errors}/>
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
    </UserLayout>
  );
};

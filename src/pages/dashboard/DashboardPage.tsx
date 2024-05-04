import { useContext, useEffect, useState } from "react";
import { UserLayout } from "../../components/Layout/Layout";
import fetchAPI from "../../fetch";
import { AuthContext } from "../../context/Auth";

export const DashboardPage = () => {
  const [profileRequest, setProfileRequest] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [attendanceRequest, setAttendanceRequest] = useState<any>({});
  const [users, setUsers] = useState<any>({});
  const [faculty, setFaculty] = useState<any>({});
  const [roles, setRoles] = useState<any>({});
  const [permissions, setPermissions] = useState<any>({});
  const [majors, setMajors] = useState<any>({});
  const [classes, setClasses] = useState<any>({});
  const [Attendance, setAttendance] = useState<any>({});
  const [Schedules, setSchedules] = useState<any>({});
  const [studentReject, setStudentReject] = useState<any>({});
  const [studentApprove, setStudentApprove] = useState<any>({});
  const [studentSick, setStudentSick] = useState<any>({});
  const [studentLate, setStudentLate] = useState<any>({});
  const [studentAbsent, setStudentAbsent] = useState<any>({});
  const [studentPresent, setStudentPresent] = useState<any>({});
  const { isLogin, setIsLogin } = useContext(AuthContext);

  const UserLogin = JSON.parse(localStorage.getItem("user"));

  const getRolesData = async () => {
    try {
      const response = await fetchAPI(`/api/v1/roles`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setRoles(data.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getProfileRequest = async () => {
    try {
      const response = await fetchAPI("/api/v1/update-profile-requests", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        const filteredData = data.data.filter(
          (item) => item.status === "pending"
        );

        if (UserLogin.role_id === 1) {
          setProfileRequest(filteredData);
        } else if (UserLogin.role_id === 4) {
          const userFilter = filteredData.filter(
            (item) => item.student.user_id === UserLogin.id
          );
          setProfileRequest(userFilter);
        }
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      const response = await fetchAPI("/api/v1/users?paginate=false", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data, "data");
        if (UserLogin.role_id === 1) {
          return setUsers(data.data);
        } else if (UserLogin.role_id === 2) {
          const userFilter = data.data.filter((item) => item.role_id === 3);
          return setUsers(userFilter);
        } else if (UserLogin.role_id === 3) {
          const userFilter = data.data.filter((item) => item.role_id === 4);
          return setUsers(userFilter);
        }
        // setUsers(data.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getAttandanceRequest = async () => {
    try {
      const response = await fetchAPI("/api/v1/attendance-requests", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        const filteredData = data.data.filter(
          (item) => item.status === "pending"
        );

        let userFilter;
        let sick;
        let late;
        let absent;
        let approve;
        let reject;
        let present;

        if (UserLogin.role_id === 1) {
          setAttendanceRequest(filteredData);
        } else if (UserLogin.role_id === 3) {
          userFilter = filteredData.filter(
            (item) => item.course_class.lecturer_id === UserLogin.lecturer.id
          );
          setAttendanceRequest(userFilter);
        } else if (UserLogin.role_id === 4) {
          userFilter = filteredData.filter(
            (item) => item.student.user_id === UserLogin.id
          );
          sick = data.data.filter((item) => item.evidence === "sick");
          late = data.data.filter((item) => item.evidence === "late");
          absent = data.data.filter((item) => item.evidence === "absent");
          approve = data.data.filter((item) => item.status === "accepted");
          reject = data.data.filter((item) => item.status === "rejected");
          present = data.data.filter((item) => item.evidence === "present");
          setStudentSick(sick);
          setStudentLate(late);
          setStudentAbsent(absent);
          setStudentApprove(approve);
          setStudentReject(reject);
          setAttendanceRequest(userFilter);
          setStudentPresent(present);
        }
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getFacultyData = async () => {
    try {
      const response = await fetchAPI(`/api/v1/faculties`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setFaculty(data.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getPermissionsData = async () => {
    try {
      const response = await fetchAPI(`/api/v1/permissions`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setPermissions(data.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getMajorData = async () => {
    try {
      const response = await fetchAPI(
        `/api/v1/majors?includeClasses=1&paginate=false`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (UserLogin.role_id === 2) {
          const userFilter = data.data.filter(
            (item) => item.faculty_id === UserLogin.faculty_staff.faculty_id
          );
          return setMajors(userFilter);
        }
        // setMajors(data.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getClassesData = async () => {
    try {
      const response = await fetchAPI(`/api/v1/major-classes?paginate=false`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        if (UserLogin.role_id === 2) {
          const userFilter = data.data.filter(
            (item) =>
              item.major.faculty_id === UserLogin.faculty_staff.faculty_id
          );
          return setClasses(userFilter);
        }
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getCourseClass = async () => {
    try {
      let url;
      if (UserLogin.role_id === 3) {
        url = `/api/v1/course-classes?lecturer_id=${UserLogin.lecturer.id}&paginate=false`;
      }
      const response = await fetchAPI(url, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setSchedules(data.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getAttandance = async () => {
    try {
      let url;
      if (UserLogin.role_id === 3) {
        url = `/api/v1/attendances?includeCourseClass=1&paginate=false&lecturer_id=${UserLogin.lecturer.id}`;
      }
      const response = await fetchAPI(url, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setAttendance(data.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfileRequest();
    getAttandanceRequest();
    getUsers();
    getFacultyData();
    getRolesData();
    getPermissionsData();
    getMajorData();
    getClassesData();
    getAttandance();
    getCourseClass();
  }, []);

  // useEffect(() => {
  //   if (!isLogin.data) {
  //     return;
  //   }

  //   const fetchData = async () => {
  //     await Promise.all([
  //       getProfileRequest(),
  //       getAttandanceRequest(),
  //       getUsers(),
  //       getFacultyData(),
  //       getRolesData(),
  //       getPermissionsData(),
  //     ]);

  //     getListDashboard(isLogin.data.role_id);
  //   };

  //   fetchData();
  // }, [isLogin.data]);

  const AdminDashboard = [
    {
      title: "Information",
      status: "pending",
      data: attendanceRequest,
      icon: "person",
      gradient: "warning",
      color_text: "text-warning",
      desc: "Attendance Request",
    },
    {
      title: "Information",
      status: "pending",
      data: profileRequest,
      icon: "weekend",
      desc: "Profile Request",
      gradient: "warning",
      color_text: "text-warning",
    },
    {
      title: "Users",
      data: users,
      status: "active",
      icon: "person",
      gradient: "success",
      color_text: "text-success",
      desc: "Total Users",
    },
    {
      title: "Faculty",
      data: faculty,
      status: "active",
      icon: "weekend",
      gradient: "info",
      color_text: "text-info",
      desc: "Total Faculty",
    },
    {
      title: "Roles",
      data: roles,
      status: "active",
      icon: "person",
      gradient: "success",
      color_text: "text-success",
      desc: "Total Roles",
    },
    {
      title: "Permissions",
      data: permissions,
      status: "active",
      icon: "weekend",
      gradient: "info",
      color_text: "text-info",
      desc: "Total Permissions",
    },
  ];

  const StudentDashboard = [
    {
      title: "Information",
      status: "Pending",
      data: attendanceRequest,
      icon: "person",
      gradient: "warning",
      color_text: "text-warning",
      desc: "Attendance Request",
    },
    {
      title: "Information",
      status: "Pending",
      data: profileRequest,
      icon: "weekend",
      gradient: "warning",
      color_text: "text-warning",
      desc: "Profile Request",
    },
    {
      title: "Information",
      status: "Accepted",
      data: studentApprove,
      icon: "person",
      gradient: "success",
      color_text: "text-success",
      desc: "Attandance Request Accepted",
    },
    {
      title: "Information",
      status: "Rejected",
      data: studentReject,
      icon: "person",
      gradient: "danger",
      color_text: "text-danger",
      desc: "Attandance Request Rejected",
    },
    {
      title: "Information",
      status: "Present",
      data: studentPresent,
      icon: "person",
      gradient: "success",
      color_text: "text-success",
      desc: "Attandance Request Present",
    },
    {
      title: "Information",
      status: "Absent",
      data: studentAbsent,
      icon: "person",
      gradient: "danger",
      color_text: "text-danger",
      desc: "Attandance Request Absent",
    },
    {
      title: "Information",
      status: "Sick",
      data: studentSick,
      icon: "person",
      gradient: "info",
      color_text: "text-info",
      desc: "Attandance Request Sick",
    },
    {
      title: "Information",
      status: "Late",
      data: studentLate,
      icon: "person",
      gradient: "info",
      color_text: "text-info",
      desc: "Attandance Request Late",
    },
  ];

  const FacultyDashboard = [
    {
      title: "Faculty Lecturers",
      data: users,
      status: "active",
      icon: "person",
      gradient: "success",
      color_text: "text-success",
      desc: "Total Users",
    },
    {
      title: "Faculty Majors",
      data: majors,
      status: "active",
      icon: "weekend",
      gradient: "info",
      color_text: "text-info",
      desc: "Total Majors",
    },
    {
      title: "Faculty Classes",
      data: classes,
      status: "active",
      icon: "weekend",
      gradient: "info",
      color_text: "text-info",
      desc: "Total Classes",
    },
  ];

  const LecturerDashboard = [
    {
      title: "Information",
      status: "pending",
      data: attendanceRequest,
      icon: "person",
      gradient: "warning",
      color_text: "text-warning",
      desc: "Attendance Request",
    },
    {
      title: "Students",
      data: users,
      status: "active",
      icon: "person",
      gradient: "success",
      color_text: "text-success",
      desc: "Total Students",
    },
    {
      title: "Attandances",
      data: Attendance,
      status: "active",
      icon: "person",
      gradient: "dark",
      color_text: "text-dark",
      desc: "Total Attandances",
    },
    {
      title: "Schedules",
      data: Schedules,
      status: "active",
      icon: "weekend",
      gradient: "info",
      color_text: "text-info",
      desc: "Total Schedules",
    },
  ];

  console.log(LecturerDashboard, "Dashboard");

  return (
    <UserLayout>
      <div className="row">
        {UserLogin.role_id === 1
          ? AdminDashboard.map((item, index) => (
              <div className=" col-sm-6 mb-xl-0 mb-4 my-4" key={index}>
                <div className="card">
                  <div className="card-header p-3 pt-2">
                    <div
                      className={`icon icon-lg icon-shape bg-gradient-${item.gradient} shadow-${item.gradient} text-center border-radius-xl mt-n4 position-absolute`}
                    >
                      <i className="material-icons opacity-10">{item.icon}</i>
                    </div>
                    <div className="text-end pt-1">
                      <p className="text-sm mb-0 text-capitalize text-bold">
                        {item.title}
                      </p>
                      {item.status && (
                        <p
                          className={`text-sm mb-0 text-capitalize text-bold ${item.color_text}`}
                        >
                          {item.status}
                        </p>
                      )}
                      <h4 className={`mb-0 ${item.color_text}`}>
                        {item.data.length}
                      </h4>
                    </div>
                  </div>
                  <hr className="dark horizontal my-0" />
                  <div className="card-footer p-3">
                    <p className="mb-0">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))
          : UserLogin.role_id === 4
          ? StudentDashboard.map((item, index) => (
              <div className="col-sm-6 mb-xl-0 mb-4 my-4" key={index}>
                <div className="card">
                  <div className="card-header p-3 pt-2">
                    <div
                      className={`icon icon-lg icon-shape bg-gradient-${item.gradient} shadow-${item.gradient} text-center border-radius-xl mt-n4 position-absolute`}
                    >
                      <i className="material-icons opacity-10">{item.icon}</i>
                    </div>
                    <div className="text-end pt-1">
                      <p className="text-sm mb-0 text-capitalize text-bold">
                        {item.title}
                      </p>
                      {item.status && (
                        <p
                          className={`text-sm mb-0 text-capitalize text-bold ${item.color_text}`}
                        >
                          {item.status}
                        </p>
                      )}
                      <h4 className={`mb-0 ${item.color_text}`}>
                        {item.data.length}
                      </h4>
                    </div>
                  </div>
                  <hr className="dark horizontal my-0" />
                  <div className="card-footer p-3">
                    <p className="mb-0">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))
          : UserLogin.role_id === 2
          ? FacultyDashboard.map((item, index) => (
              <div className="col-sm-6 mb-xl-0 mb-4 my-4" key={index}>
                <div className="card">
                  <div className="card-header p-3 pt-2">
                    <div
                      className={`icon icon-lg icon-shape bg-gradient-${item.gradient} shadow-${item.gradient} text-center border-radius-xl mt-n4 position-absolute`}
                    >
                      <i className="material-icons opacity-10">{item.icon}</i>
                    </div>
                    <div className="text-end pt-1">
                      <p className="text-sm mb-0 text-capitalize text-bold">
                        {item.title}
                      </p>
                      {item.status && (
                        <p
                          className={`text-sm mb-0 text-capitalize text-bold ${item.color_text}`}
                        >
                          {item.status}
                        </p>
                      )}
                      <h4 className={`mb-0 ${item.color_text}`}>
                        {item.data.length}
                      </h4>
                    </div>
                  </div>
                  <hr className="dark horizontal my-0" />
                  <div className="card-footer p-3">
                    <p className="mb-0">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))
          : LecturerDashboard.map((item, index) => (
              <div className=" col-sm-6 mb-xl-0 mb-4 my-4" key={index}>
                <div className="card">
                  <div className="card-header p-3 pt-2">
                    <div
                      className={`icon icon-lg icon-shape bg-gradient-${item.gradient} shadow-${item.gradient} text-center border-radius-xl mt-n4 position-absolute`}
                    >
                      <i className="material-icons opacity-10">{item.icon}</i>
                    </div>
                    <div className="text-end pt-1">
                      <p className="text-sm mb-0 text-capitalize text-bold">
                        {item.title}
                      </p>
                      {item.status && (
                        <p
                          className={`text-sm mb-0 text-capitalize text-bold ${item.color_text}`}
                        >
                          {item.status}
                        </p>
                      )}
                      <h4 className={`mb-0 ${item.color_text}`}>
                        {item.data.length}
                      </h4>
                    </div>
                  </div>
                  <hr className="dark horizontal my-0" />
                  <div className="card-footer p-3">
                    <p className="mb-0">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
      </div>
      {/* <div className="row mt-4">
        <div className="col-lg-4 col-md-6 mt-4 mb-4">
          <div className="card z-index-2 ">
            <div className="bg-gradient-success card-header mt-n4  position-relative pt-3 mx-3 d-flex justify-content-center z-index-2 bg-transparent">
              <div
                className="d-flex  border-6 border-white justify-content-center align-items-center"
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  border: "10px solid green",
                }}
              >
                <span
                  className="font-weight-bold text-white"
                  style={{ fontSize: "44px", color: "green" }}
                >
                  50%
                </span>
              </div>
            </div>
            <div className="card-body">
              <h6 className="mb-0 ">Website Views</h6>
              <p className="text-sm ">Last Campaign Performance</p>
              <hr className="dark horizontal" />
              <div className="d-flex ">
                <i className="material-icons text-sm my-auto me-1">schedule</i>
                <p className="mb-0 text-sm"> campaign sent 2 days ago </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 mt-4 mb-4">
          <div className="card z-index-2  ">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
              <div className="bg-gradient-success shadow-success border-radius-lg py-3 pe-1">
                <div className="chart">
                  <canvas
                    id="chart-line"
                    className="chart-canvas"
                    height="170"
                  ></canvas>
                </div>
              </div>
            </div>
            <div className="card-body">
              <h6 className="mb-0 "> Daily Sales </h6>
              <p className="text-sm ">
                {" "}
                (<span className="font-weight-bolder">+15%</span>) increase in
                today sales.
              </p>
              <hr className="dark horizontal" />
              <div className="d-flex ">
                <i className="material-icons text-sm my-auto me-1">schedule</i>
                <p className="mb-0 text-sm"> updated 4 min ago </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 mt-4 mb-3">
          <div className="card z-index-2 ">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
              <div className="bg-gradient-dark shadow-dark border-radius-lg py-3 pe-1">
                <div className="chart">
                  <canvas
                    id="chart-line-tasks"
                    className="chart-canvas"
                    height="170"
                  ></canvas>
                </div>
              </div>
            </div>
            <div className="card-body">
              <h6 className="mb-0 ">Completed Tasks</h6>
              <p className="text-sm ">Last Campaign Performance</p>
              <hr className="dark horizontal" />
              <div className="d-flex ">
                <i className="material-icons text-sm my-auto me-1">schedule</i>
                <p className="mb-0 text-sm">just updated</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <footer className="footer py-4  ">
        <div className="container-fluid">
          <div className="row align-items-center justify-content-lg-between">
            <div className="col-lg-6 mb-lg-0 mb-4">
              <div className="copyright text-center text-sm text-muted text-lg-start">
                © {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </UserLayout>
  );
};

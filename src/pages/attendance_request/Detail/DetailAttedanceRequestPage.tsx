import React, { useContext, useEffect, useState } from "react";
import { UserLayout } from "../../../components/Layout/Layout";
import { AuthContext } from "../../../context/Auth";
import { useParams } from "react-router";
import fetchAPI from "../../../fetch";
import { set } from "lodash";

export const DetailAttedanceRequestPage = () => {
  // Example attendance request data
  //   const attendanceRequest = {
  //     name: "John Doe",
  //     course_class: "Introduction to Computer Science",
  //     picture: "https://via.placeholder.com/150",
  //     evidence: "present",
  //     status: "Pending",
  //     description: "Unable to attend the class due to medical reasons.",
  //   };

  const [attendanceRequest, setAttendanceRequest] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const { id } = useParams<{ id: string }>();

  const getDetailAttendanceRequest = async () => {
    setLoading(true);
    try {
      const response = await fetchAPI(`/api/v1/attendance-requests/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      if (response.ok) {
        // setAttendanceRequest(data);
        console.log(data.data.course_class.course.name, "data.data");
        setAttendanceRequest({
          name: data.data.student.user.name,
          course: data.data.course_class.course.name,
          picture: data.data.student_image,
          evidence: data.data.evidence,
          status: data.data.status,
          description: data.data.description,
        });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error, "error");
    }
  };

  console.log(loading, "loading");

  useEffect(() => {
    getDetailAttendanceRequest();
  }, []);
  if (loading) {
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
                  Detail Attendance Request
                </h6>
              </div>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={attendanceRequest.name}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Course Class</label>
                <input
                  type="text"
                  className="form-control"
                  value={attendanceRequest.course}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Picture</label>
                <div>
                  <img
                    src={attendanceRequest.picture}
                    alt="Picture"
                    className="img-fluid"
                    style={{ maxWidth: "250px" }}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Evidence</label>
                <div>
                  <input
                    type="text"
                    className="form-control"
                    value={attendanceRequest.evidence}
                    readOnly
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <input
                  type="text"
                  className="form-control"
                  value={attendanceRequest.status}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={attendanceRequest.description}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

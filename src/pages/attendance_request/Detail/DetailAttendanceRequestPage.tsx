import React, { useContext, useEffect, useState } from "react";
import { UserLayout } from "../../../components/Layout/Layout";
import { useParams } from "react-router";
import fetchAPI from "../../../fetch";
import { set } from "lodash";

export const DetailAttendanceRequestPage = () => {
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
                <label className="form-label ms-0">Name</label>
                <div className="text-dark">
                  {attendanceRequest.name}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label ms-0">Course Class</label>
                <div className="text-dark">
                  {attendanceRequest.course}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label ms-0">Picture</label>
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
                <label className="form-label ms-0">Evidence</label>
                <div className="text-dark">
                  {attendanceRequest.evidence}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label ms-0">Status</label>
                <div className="text-dark">
                  {attendanceRequest.status}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label ms-0">Description</label>
                <div className="text-dark">
                  {attendanceRequest.description ?? "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

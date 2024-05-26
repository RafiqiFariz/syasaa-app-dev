import React, { useEffect, useState } from "react";
import { UserLayout } from "../../../components/Layout/Layout";
import { useParams } from "react-router";
import fetchAPI from "../../../fetch";

export const DetailProfileRequestPage = () => {
  const [profileRequest, setProfileRequest] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const { id } = useParams<{ id: string }>();

  const getDetailProfileRequest = async () => {
    setLoading(true);
    try {
      const response = await fetchAPI(`/api/v1/update-profile-requests/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data.data, "data.data");
        setProfileRequest({
          name: data.data.student.user.name,
          fieldChange: data.data.changed_data,
          beforeChange: data.data.old_value,
          afterChange: data.data.new_value,
          status: data.data.status,
          description: data.data.description,
        });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    getDetailProfileRequest();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
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
                  Detail Profile Request
                </h6>
              </div>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileRequest?.name || ""}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Field Change</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileRequest?.fieldChange || ""}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Before Change</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileRequest?.beforeChange || ""}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">After Change</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileRequest?.afterChange || ""}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                {profileRequest.status === "pending" ? (
                  <span className="badge badge-sm bg-gradient-warning d-flex justify-content-center col-3">
                    Pending
                  </span>
                ) : profileRequest.status === "accepted" ? (
                  <span className="badge badge-sm bg-gradient-success d-flex justify-content-center col-3">
                    accepted
                  </span>
                ) : (
                  <span className="badge badge-sm bg-gradient-danger d-flex justify-content-center col-3">
                    Rejected
                  </span>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={profileRequest?.description || ""}
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

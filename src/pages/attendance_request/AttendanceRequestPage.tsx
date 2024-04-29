import { useEffect, useState } from "react";
import { UserLayout } from "../../components/Layout/Layout";
import fetchAPI from "../../fetch";

export const AttendanceRequestPage = () => {
  const [attendances, setAttendances] = useState<any>({});
  const getData = async () => {
    try {
      const response = await fetchAPI("/api/v1/attendance-requests", {
        method: "GET",
      });

      // const data = await response.json();
      console.log(response, "data123");
      if (response.ok) {
        // console.log(data, "data123");
      }
    } catch (error) {
      console.log(error, "error");
    }
  };
  useEffect(() => {
    getData();
  }, []);
  // console.log();
  return (
    <UserLayout>
      <div className="row">
        <div className="col-12">
          <div
            className="card"
            style={
              {
                // height: attendances?.data?.length > 0 ? "100%" : "85vh",
              }
            }
          >
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3 mb-0">
                  Attendances Request
                </h6>
              </div>
            </div>
            <div className="card-body px-0 pb-2">
              <div className="d-flex mx-4 justify-content-start gap-2 col-6">
                {/* {UserLogin.role_id !== 1 && (
                  <>
                    {UserLogin.role_id === 2 && (
                      <ReactSelect
                        className="col-6"
                        options={optionMajor}
                        value={selectedMajor}
                        name="Major"
                        placeholder={"Select Major"}
                        onChange={handleMajorChange}
                        isLoading={isLoading}
                      />
                    )}
                    <ReactSelect
                      className="col-6"
                      options={optionClass}
                      name={"Class"}
                      value={selectedClass}
                      placeholder={"Select Class"}
                      isLoading={isLoading}
                      onChange={handleClassChange}
                    />
                  </>
                )} */}
              </div>
              <div className="table-responsive">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      {/* {columns.map((item, index) => {
                        if (!item) {
                          return (
                            <div
                              key={index}
                              style={{
                                display: "none",
                              }}
                            ></div>
                          );
                        }
                        return (
                          <th
                            key={index}
                            className="text-uppercase text-secondary text-xxs font-weight-bolder text-center"
                          >
                            {item.name}
                          </th>
                        );
                      })} */}
                    </tr>
                  </thead>
                  <tbody>
                    {/* {isLoading ? (
                      <tr>
                        {Array(columns.length)
                          .fill(0)
                          .map((_, i) => (
                            <td
                              key={i}
                              className="text-center placeholder-glow"
                            >
                              <span className="placeholder col-10"></span>
                            </td>
                          ))}
                      </tr>
                    ) : attendances.data?.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length} className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      attendances.data?.map((item: any, index) => {
                        console.log(item, "item");
                        return (
                          <tr key={index}>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              {item.id}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3">
                              {item.student.user.name}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              <div className="avatar avatar-xl position-relative">
                                <img
                                  src={item.student_image}
                                  alt="profile_image"
                                  className="w-100 border-radius-lg shadow-sm"
                                />
                              </div>
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              <div className="avatar avatar-xl position-relative">
                                <img
                                  src={item.lecturer_image}
                                  alt="profile_image"
                                  className="w-100 border-radius-lg shadow-sm"
                                />
                              </div>
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              {item.is_present !== 0 ? "Present" : "Absent"}
                            </td>

                            {UserLogin.role_id !== 1 ? (
                              <></>
                            ) : (
                              <td className="align-middle">
                                <div className="d-flex gap-2 justify-content-center">
                                  <button
                                    className="btn btn-primary btn-sm mb-0"
                                    onClick={() => {
                                      // history.push(`/users/edit/${item.id}`);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm mb-0"
                                    // onClick={() => deleteUser(item.id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })
                    )} */}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-center pt-4 px-4">
              {/* <Pagination
                activePage={attendances?.meta?.current_page}
                itemsCountPerPage={attendances?.meta?.per_page}
                totalItemsCount={attendances?.meta?.total ?? 0}
                onChange={handleChangePage}
                itemClass="page-item"
                linkClass="page-link"
                firstPageText="First"
                lastPageText="Last"
                prevPageText={<>&laquo;</>}
                nextPageText={<>&raquo;</>}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

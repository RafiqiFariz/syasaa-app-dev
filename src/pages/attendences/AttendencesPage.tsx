import { useEffect, useState } from "react";
import { UserLayout } from "../../components/Layout/Layout";
import fetchAPI from "../../fetch";
import { DefaultPaginatedResponse } from "../../types";
import Pagination from "react-js-pagination";

export const AttendancesPage = () => {
  const [attendances, setAttendances] = useState<DefaultPaginatedResponse<any>>(
    {}
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  let columns = [
    {
      name: "ID",
      selector: "id",
      key: 1,
    },
    {
      name: "Name",
      selector: "name",
      key: 2,
    },
    {
      name: "Student Image",
      selector: "student_img",
      key: 3,
    },
    {
      name: "Lecture Image",
      selector: "lecture_img",
      key: 3,
    },
    {
      name: "Attendence",
      selector: "is_present",
      key: 3,
    },
    {
      name: "Action",
      selector: "action",
    },
  ];
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchAPI("/api/v1/attendances", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setAttendances(data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error, "error");
        setIsLoading(false);
      }
    };
    getData();
  }, [currentPage]);
  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };
  console.log(attendances, "attendances");
  return (
    <UserLayout>
      <div className="row">
        <div className="col-12">
          <div
            className="card"
            style={{
              height: attendances?.data?.length > 0 ? "100%" : "85vh",
            }}
          >
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3 mb-0">
                  Courses
                </h6>
                <button
                  className="btn btn-info btn-md mx-4 mb-0"
                  onClick={() => {
                    // history.push(`/course/add`);
                  }}
                >
                  Add Course
                </button>
              </div>
            </div>
            <div className="card-body px-0 pb-2">
              <div className="table-responsive">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      {columns.map((item, index) => {
                        return (
                          <th
                            key={index}
                            className="text-uppercase text-secondary text-xxs font-weight-bolder text-center"
                          >
                            {item.name}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
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
                        console.log(item.lecture_img, "item");
                        return (
                          <tr key={index}>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              {item.id}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3">
                              {item.student}
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
                            <td className="align-middle">
                              <div className="d-flex gap-2 justify-content-center">
                                <button
                                  className="btn btn-primary btn-sm mb-0"
                                  onClick={() => {
                                    // history.push(`/course/edit/${item.id}`);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm mb-0"
                                  // onClick={() => deleteCourse(item.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-center pt-4 px-4">
              <Pagination
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
              />
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

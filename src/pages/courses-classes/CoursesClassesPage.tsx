import { useEffect, useState } from "react";
import { UserLayout } from "../../components/Layout/Layout";
import Pagination from "react-js-pagination";
import { DefaultPaginatedResponse } from "../../types";
import fetchAPI from "../../fetch";

export const CoursesClasses = () => {
  const columns = [
    {
      name: "ID",
      selector: "id",
      key: 1,
    },
    {
      name: "Class",
      selector: "class",
      key: 2,
    },
    {
      name: "Course",
      selector: "course",
      key: 3,
    },
    // {
    //   name: "Lecture",
    //   selector: "lecture",
    //   key: 4,
    // },
    {
      name: "Start Time",
      selector: "start_time",
      key: 4,
    },
    {
      name: "End Time",
      selector: "end_time",
      key: 5,
    },
    // {
    //   name: "Action",
    //   selector: "action",
    // },
  ];

  const [CoursesClasses, setCoursesClasses] = useState<
    DefaultPaginatedResponse<any>
  >({});
  const [Classes, setClasses] = useState({});
  const [Lectures, setLectures] = useState({});
  const [menu, setMenu] = useState({
    id: "",
    class: "",
    course: "",
    lecture: "",
    start_time: "",
    end_time: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getData = async () => {
    try {
      const response = await fetchAPI(
        `/api/v1/course-classes?includeClass=1&includeCourse=1&includeLecturer=1&page=${currentPage}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log(data, "courses classes");
        setCoursesClasses(data);

        setIsLoading(false);
      }
    } catch (error) {
      console.log(error, "error");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [currentPage]);

  console.log(Classes, "CoursesClasses");
  console.log(menu, "menu");
  return (
    <UserLayout>
      <div className="row">
        <div className="col-12">
          <div
            className="card"
            style={{
              padding: "10px, 10px, 10px, 10px",
              height: CoursesClasses?.data?.length > 0 ? "100%" : "85vh",
            }}
          >
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3 mb-0">
                  Courses Classes
                </h6>
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
                    ) : CoursesClasses.data?.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length} className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      CoursesClasses.data?.map((item: any, index) => {
                        return (
                          <tr key={index}>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              {item.id}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center ">
                              {item.class.name}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 ">
                              <div
                                style={{
                                  maxHeight: "100px",
                                  overflowY: "auto",
                                }}
                              >
                                {item.course.name}
                              </div>
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              {item.start_time}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              {item.end_time}
                            </td>
                            {/* <td className="align-middle">
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
                            </td> */}
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
                activePage={CoursesClasses?.meta?.current_page}
                itemsCountPerPage={CoursesClasses?.meta?.per_page}
                totalItemsCount={CoursesClasses?.meta?.total ?? 0}
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

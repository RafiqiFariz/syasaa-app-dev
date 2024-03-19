import { useEffect, useState } from "react";
import { UserLayout } from "../../components/Layout/Layout";
import Pagination from "react-js-pagination";
import { DefaultPaginatedResponse } from "../../types";
import { useHistory } from "react-router";
import fetchAPI from "../../fetch";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

interface ItemData {
  id: number;
  name: string;
  faculty: {
    id: number;
    name: string;
  };
}

export const MajorsPage = () => {
  const [major, setMajor] = useState<DefaultPaginatedResponse<ItemData>>({});
  const history = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const columns = [
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
      name: "Faculty",
      selector: "faculty",
      key: 3,
    },
    {
      name: "Action",
      selector: "action",
    },
  ];
  const getMajorData = async () => {
    try {
      const response = await fetchAPI(`/api/v1/majors`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMajor(data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    getMajorData();
  }, []);

  const deleteMajor = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: "Delete Confirmation!",
        text: "Are you sure you want to delete this major?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1D24CA",
        cancelButtonColor: "#F44335",
        confirmButtonText: "Yes, Delete it!",
        customClass: {
          confirmButton: "btn btn-primary btn-sm ",
          cancelButton: "btn btn-danger btn-sm ",
        },
        heightAuto: false,
      });

      if (!result.isConfirmed) return;
      const response = await fetchAPI(`/api/v1/majors/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
        },
      });

      if (response.ok) {
        getMajorData();
      }
    } catch (error) {
      console.error(error, "Error");
    }
  };

  console.log(major, "major");
  return (
    <UserLayout>
      <div className="row">
        <div className="col-12">
          <div
            className="card"
            style={{
              height: major?.data?.length > 0 ? "100%" : "85vh",
            }}
          >
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3 mb-0">Majors</h6>
                <button
                  className="btn btn-info btn-md mx-4 mb-0"
                  onClick={() => {
                    history.push(`/majors/add`);
                  }}
                >
                  Add Major
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
                            className="text-uppercase text-secondary text-xxs font-weight-bolder"
                          >
                            <div>{item.name}</div>
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
                    ) : major.data?.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length} className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      major.data?.map((item: ItemData, index) => {
                        console.log(item.faculty?.name, "item");
                        return (
                          <tr key={index}>
                            <td className="text-sm font-weight-normal px-4 py-3">
                              {item.id}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3">
                              {item.name}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3">
                              {item.faculty?.name}
                            </td>
                            <td className="align-middle">
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-primary btn-sm mb-0"
                                  onClick={() => {
                                    history.push(`/majors/edit/${item.id}`);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm mb-0"
                                  onClick={() => deleteMajor(item.id)}
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
                activePage={major?.meta?.current_page}
                itemsCountPerPage={major?.meta?.per_page}
                totalItemsCount={major?.meta?.total ?? 0}
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

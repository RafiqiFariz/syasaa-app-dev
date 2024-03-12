import { useEffect, useState } from "react";
import { UserLayout } from "../../components/Layout/Layout";
import { useHistory } from "react-router";
import Cookies from "js-cookie";

export const PermissionPage = () => {
  const history = useHistory();

  const [permissions, setPermissions] = useState<Array<any>>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const columns = [
    {
      name: "Name",
      selector: "name",
      key: 1,
    },
    {
      name: "Action",
      selector: "action",
    },
  ];

  const getPermissionsData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/permissions?page=${currentPage}`,
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
        setPermissions(data.data);

        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);

      console.log(error, "error");
    }
  };
  const handleChangePage = (newPage: number) => {
    setIsLoading(true);

    setCurrentPage(newPage);
  };
  const deletePermission = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/permissions/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
          },
        }
      );

      if (response.ok) {
        getPermissionsData();
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    getPermissionsData();
  }, [currentPage]);

  return (
    <UserLayout>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div
              className="card"
              style={{
                height: "85vh",
              }}
            >
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                  <h6 className="text-white text-capitalize ps-3 d-flex align-items-center">
                    Permissions
                  </h6>
                  <button
                    className="btn btn-info btn-md mx-4"
                    onClick={() => {
                      history.push(`/permissions/add`);
                    }}
                  >
                    Add Permissions
                  </button>
                </div>
              </div>
              <div
                className="card-body px-0 pb-2"
                style={{
                  overflowY: "auto",
                  maxHeight: "max-content",
                }}
              >
                <div className="table-responsive p-0">
                  <table className="table align-items-center mb-0">
                    <thead>
                      <tr>
                        {columns.map((item, index) => {
                          return (
                            <th
                              key={index}
                              className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                            >
                              <div className="d-flex justify-content-center">
                                {item.name}
                              </div>
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
                              <td key={i} className="text-center placeholder-glow">
                                <span className="placeholder col-10"></span>
                              </td>
                            ))}
                        </tr>
                      ) : permissions.length === 0 ? (
                        <tr>
                          <td colSpan={columns.length} className="text-center">
                            No data available
                          </td>
                        </tr>
                      ) : (
                        permissions.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <div className="d-flex px-2 py-1 justify-content-center">
                                  <div></div>
                                  <div className="d-flex flex-column justify-content-center">
                                    <h6 className="mb-0 text-sm">
                                      {item.name}
                                    </h6>
                                  </div>
                                </div>
                              </td>
                              <td className="align-middle">
                                <div className="d-flex justify-content-center">
                                  <button
                                    className="btn btn-primary btn-sm mx-1"
                                    onClick={() => {
                                      history.push(
                                        `/permissions/edit/${item.id}`
                                      );
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deletePermission(item.id)}
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
              <div className="text-center mt-4 mx-5">
                <nav>
                  <ul className="pagination pagination-md gap-1">
                    {Array.from({ length: 20 }, (_, index) => index + 1).map(
                      (page) => (
                        <li
                          key={page}
                          className={`page-item ${
                            page === currentPage ? "active" : ""
                          }`}
                          aria-current="page"
                        >
                          <button
                            className={`page-link ${
                              page === currentPage
                                ? "text-white"
                                : "text-primary"
                            }`}
                            onClick={() => handleChangePage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

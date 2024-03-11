import { useEffect, useState } from "react";
import { UserLayout } from "../../public/Layout/Layout";
import { useHistory } from "react-router";
import Cookies from "js-cookie";
interface userData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  roleId: number;
}

export const RolePage = () => {
  const history = useHistory();

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

  const [userData, setUserData] = useState<Array<userData>>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getUserData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/roles", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": localStorage.getItem("XSRF-TOKEN") || "",
        },
      });
      const data = await response.json();
      console.log(data, "data");
      if (data) {
        setUserData(data.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error, "error");
      setIsLoading(false);
    }
  };
  const deleteRole = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/roles/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
        },
      });
      const data = await response.json();
      if (response.ok) {
        getUserData();
      }
    } catch (error) {
      console.log(error, "error");
    }
  };
  useEffect(() => {
    getUserData();
  }, []);
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
                <div className="bg-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                  <h6 className="text-white text-capitalize ps-3 d-flex align-items-center">
                    Manage Users Roles
                  </h6>
                  <button
                    className="btn btn-info btn-md mx-4"
                    onClick={() => {
                      history.push(`/roles/add`);
                    }}
                  >
                    Add Role
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
                        {columns.map((column, index) => (
                          <th
                            key={index}
                            className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                          >
                            <div className="d-flex justify-content-center">
                              {column.name}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          {Array(columns.length)
                            .fill(0)
                            .map((_, i) => (
                              <td key={i} className="text-center">
                                <span className="placeholder col-10"></span>
                              </td>
                            ))}
                        </tr>
                      ) : (
                        userData.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <div className="d-flex px-2 py-1 justify-content-center">
                                  <div>
                                    {/* <img src="../assets/img/team-2.jpg" className="avatar avatar-sm me-3 border-radius-lg" alt="user1"> */}
                                  </div>
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
                                      history.push(`/roles/edit/${item.id}`);
                                    }}
                                  >
                                    Change Role
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm mx-1"
                                    onClick={() => deleteRole(item.id)}
                                  >
                                    Delete Role
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
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

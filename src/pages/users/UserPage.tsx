import { useEffect, useState } from "react";
import { UserLayout } from "../../components/Layout/Layout";
import { useHistory } from "react-router";
import Cookies from "js-cookie";

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  roleId: number;
}

interface RoleData {
  id: number;
  name: string;
}

export const UserPage = () => {
  const history = useHistory();

  const userId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "").id
    : {};

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<Array<UserData>>([]);
  const [roles, setRoles] = useState<Array<RoleData>>([]);

  // Get roles
  const getRoles = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/roles", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data) {
        setRoles(data.data);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  // Get user data
  const getUserData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/users", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data.data);
        setIsLoading(false);
      }

      // Set loading to false when data is fetched
    } catch (error) {
      console.log(error, "error");
      setIsLoading(false); // Set loading to false if there is an error
    }
  };

  // Get Role Data
  useEffect(() => {
    getRoles();
  }, []);

  // Get user data
  useEffect(() => {
    getUserData();
  }, []);

  // Table columns
  const columns = [
    {
      name: "Name",
      selector: "name",
      key: 1,
    },
    {
      name: "Email",
      selector: "email",
      key: 2,
    },
    {
      name: "Phone",
      selector: "phone",
      key: 3,
    },
    {
      name: "Role",
      selector: "role_id",
      key: 4,
    },
    {
      name: "Action",
      selector: "action",
    },
  ];

  // Delete user data
  const deleteUserData = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/users/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
        },
      });

      if (response.ok) {
        getUserData();
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

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
                <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 d-flex justify-content-between align-items-center">
                  <h6 className="text-white text-capitalize ps-3">
                    Users
                  </h6>
                  <button
                    className="btn btn-info btn-md mx-4 mb-0"
                    onClick={() => {
                      history.push(`/users/add`);
                    }}
                  >
                    Add User
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
                        {columns.map((item, i) => (
                          <th
                            key={i}
                            className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                          >
                            {item.name}
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
                              <td key={i} className="text-center placeholder-glow">
                                <span className="placeholder col-10"></span>
                              </td>
                            ))}
                        </tr>
                      ) : (
                        userData.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="d-flex px-2 py-1">
                                <div className="d-flex flex-column justify-content-center">
                                  <h6 className="mb-0 text-sm">{item.name}</h6>
                                </div>
                              </div>
                            </td>
                            <td>
                              <p className="text-xs font-weight-bold mb-0">
                                {item.email}
                              </p>
                            </td>
                            <td className="align-middle text-start text-sm">
                              <p className="text-xs font-weight-bold mb-0">
                                {item.phone ?? "-"}
                              </p>
                            </td>
                            <td className="align-middle">
                              <span className="text-secondary text-xs font-weight-bold">
                                {roles.filter(
                                  (role) => role.id == item.roleId
                                )[0]?.name ?? "-"}
                              </span>
                            </td>
                            <td className="align-middle">
                              <button
                                className="btn btn-primary btn-sm mx-1"
                                disabled={userId === item.id}
                                onClick={() => {
                                  history.push(`/users/edit/${item.id}`);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                disabled={userId === item.id}
                                onClick={() => deleteUserData(item.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
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

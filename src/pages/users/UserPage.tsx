import { useEffect, useState } from "react";
import { UserLayout } from "../../components/Layout/Layout";
import { useHistory } from "react-router";
import Cookies from "js-cookie";
import fetchAPI from "../../fetch";
import Pagination from "react-js-pagination";
import { DefaultPaginatedResponse } from "../../types";
import _ from "lodash";
import Swal from "sweetalert2";

interface ItemData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  roleId: number;
  role: {
    id: number;
    name: string;
  }
}

export const UserPage = () => {
  const history = useHistory();

  const userId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "").id
    : {};

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<DefaultPaginatedResponse<ItemData>>({});
  const [currentPage, setCurrentPage] = useState(1);

  const getUserData = async () => {
    try {
      const response = await fetchAPI("/api/v1/users?includeRole=1", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error, "error");
      setIsLoading(false);
    }
  };

  // Table columns
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
      name: "Email",
      selector: "email",
      key: 3,
    },
    {
      name: "Phone",
      selector: "phone",
      key: 4,
    },
    {
      name: "Role",
      selector: "role_id",
      key: 5,
    },
    {
      name: "Action",
      selector: "action",
    },
  ];

  // Delete user data
  const deleteUser = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        heightAuto: false,
      });

      if (!result.isConfirmed) return;

      const response = await fetchAPI(`/api/v1/users/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
        },
        body: JSON.stringify({_method: "DELETE"})
      });

      if (response.ok) {
        await getUserData();
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Get user data
  useEffect(() => {
    getUserData();
  }, [currentPage]);

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12">
          <div
            className="card"
            style={{
              height: users.data?.length > 0 ? "100%" : "85vh",
            }}
          >
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div
                className="bg-gradient-primary shadow-primary border-radius-lg py-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3 mb-0">
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
            <div className="card-body px-0 pb-2">
              <div className="table-responsive">
                <table className="table align-items-center mb-0">
                  <thead>
                  <tr>
                    {columns.map((item, i) => (
                      <th
                        key={i}
                        className="text-uppercase text-secondary text-xxs font-weight-bolder"
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
                    users.data?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-sm font-weight-normal px-4 py-3">
                          <h6 className="mb-0 text-sm">{item.id}</h6>
                        </td>
                        <td className="text-sm font-weight-normal px-4 py-3">
                          <h6 className="mb-0 text-sm">{item.name}</h6>
                        </td>
                        <td className="text-sm font-weight-normal px-4 py-3">
                          <p className="text-xs font-weight-bold mb-0">
                            {item.email}
                          </p>
                        </td>
                        <td className="text-xs font-weight-bold px-4 py-3">
                          {item.phone ?? "-"}
                        </td>
                        <td className="text-xs font-weight-bold px-4 py-3">
                          {_.startCase(_.camelCase(item.role?.name)) ?? "-"}
                        </td>
                        <td className="align-middle">
                          {userId !== item.id && (
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-primary btn-sm mb-0"
                                onClick={() => {
                                  history.push(`/users/edit/${item.id}`);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm mb-0"
                                onClick={() => deleteUser(item.id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-center pt-4 px-4">
              <Pagination
                activePage={users?.meta?.current_page}
                itemsCountPerPage={users?.meta?.per_page}
                totalItemsCount={users?.meta?.total ?? 0}
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

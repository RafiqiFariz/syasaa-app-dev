import { useContext, useEffect, useState } from "react";
import { Sidebar } from "../Sidebar";
import { useHistory } from "react-router";
import Cookies from "js-cookie";
import _ from "lodash";
import { AuthContext } from "../../context/Auth";
import fetchAPI from "../../fetch";
import PerfectScrollbar from "react-perfect-scrollbar";
import Swal from "sweetalert2";

interface LayoutProps {
  children: React.ReactNode;
}

export const UserLayout = ({children}: LayoutProps) => {
  const history = useHistory();

  const {isLogin, setIsLogin} = useContext(AuthContext);
  const [user, setUser] = useState<any>({});

  const [nav, setNav] = useState(false);

  let pathname = window.location.pathname.split("/").join(" / ");

  const handleSignOut = async () => {
    try {
      const result = await Swal.fire({
        title: "Sign Out Confirmation",
        text: "Are you sure you want to sign out of your account?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1D24CA",
        cancelButtonColor: "#F44335",
        confirmButtonText: "Yes, Sign Out!",
        customClass: {
          confirmButton: "btn btn-primary btn-sm ",
          cancelButton: "btn btn-danger btn-sm ",
        },
        heightAuto: false,
      });

      console.log(result, "result");

      if (!result.isConfirmed) return;

      const response = await fetchAPI("/logout", {
        method: "POST",
      });

      if (response.ok) {
        localStorage.removeItem("user");

        history.push("/login");

        setIsLogin({
          isLogin: false,
          isPending: true,
          data: {},
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getUserProfilePhoto = () => {
    // jika path gambarnya ada di folder img/,
    // maka asumsinya adalah gambar tersebut digunakan untuk seeder
    if (user.image?.includes('img/')) {
      return user.image?.replace('storage/', '');
    }

    return user.image;
  }

  useEffect(() => {
    if (isLogin.data) {
      setUser(isLogin.data);
    }
  }, [isLogin.data]);

  console.log(user, "data");

  return (
    <div
      className={`g-sidenav-show bg-gray-200 ${
        nav ? "g-sidenav-pinned" : ""
      } h-100`}
    >
      <Sidebar/>
      <PerfectScrollbar>
        <main className="main-content position-relative max-height-vh-100 h-100">
          <nav
            className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl"
            id="navbarBlur"
            data-scroll="true"
          >
            <div className="container-fluid py-1 px-3">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                  {pathname.split("/").map((item, index) => {
                    const submenu = _.startCase(_.camelCase(item)) || item;
                    if (index === 0) {
                      return (
                        <li
                          key={index}
                          className="breadcrumb-item text-sm text-dark active"
                          aria-current="page"
                        >
                          Page
                        </li>
                      );
                    }

                    return (
                      <li
                        key={index}
                        className="breadcrumb-item text-sm text-dark active"
                        aria-current="page"
                      >
                        {submenu}
                      </li>
                    );
                  })}
                </ol>
                <h6 className="font-weight-bolder mb-0">
                  {_.startCase(_.camelCase(pathname.split("/").toString()))}
                </h6>
              </nav>
              <div
                className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4"
                id="navbar"
              >
                <div className="ms-md-auto pe-md-3 d-flex align-items-center"></div>
                <ul className="navbar-nav justify-content-end">
                  <li className="nav-item d-xl-none ps-3 d-flex align-items-center mx-3">
                    <a
                      onClick={() => setNav((prev) => !prev)}
                      className="nav-link text-body p-0"
                      id="iconNavbarSidenav"
                    >
                      <div className="sidenav-toggler-inner">
                        <i className="sidenav-toggler-line"></i>
                        <i className="sidenav-toggler-line"></i>
                        <i className="sidenav-toggler-line"></i>
                      </div>
                    </a>
                  </li>
                  <li className="nav-item dropdown d-flex align-items-center">
                    <a href="#" className="nav-link text-body p-0" id="dropdownMenuButton"
                       data-bs-toggle="dropdown" aria-expanded="false">
                      <span
                        className="d-flex align-items-center text-md text-bold gap-3">
                        <span>{user && user.name ? user.name : "Guest"}</span>
                        {user && user.image ? (
                          <img
                            src={getUserProfilePhoto()}
                            alt="profile"
                            className="avatar shadow"
                          />
                        ) : (
                          <i className="bi bi-person-circle fs-3"></i>
                        )}
                        </span>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end px-2 py-3 me-sm-n4"
                        aria-labelledby="dropdownMenuButton">
                      <li className="mb-2">
                        <button
                          className="dropdown-item"
                          onClick={() => history.push("/profile")}
                        >
                          Profile
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={handleSignOut}
                        >
                          Sign Out
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <div className="container-fluid py-4">{children}</div>
        </main>
      </PerfectScrollbar>
    </div>
  );
};

import { useContext, useEffect, useState } from "react";
import { SideBar } from "../../components/sidebar";
import { useHistory } from "react-router";
import Cookies from "js-cookie";
import _, { capitalize, set } from "lodash";
import { AuthContext } from "../../context/Auth";

interface LayoutProps {
  children: React.ReactNode;
}

export const UserLayout = ({ children }: LayoutProps) => {
  const history = useHistory();

  const { isLogin, setIsLogin } = useContext(AuthContext);

  const [nav, setNav] = useState(false);

  let pathname = window.location.pathname.split("/").join(" / ");

  const [userdata, setUserdata] = useState({
    name: "",
    email: "",
    phone: "",
    role_id: "0",
    role_name: "",
  });

  const getUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/user", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
        },
      });

      const data = await response.json();

      if (data) {
        setUserdata({
          name: data.name,
          email: data.email,
          phone: data?.phone,
          role_id: data.role.id,
          role_name: data.role.name,
        });
        localStorage.setItem("user", JSON.stringify(data));
      }
    } catch (e) {
      console.log(e);
    }
  };
  const HandleSignOut = async () => {
    try {
      const response = await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
        },
      });

      if (response.ok) {
        localStorage.removeItem("user");

        history.push("/login");
        setIsLogin({
          isLogin: false,
          isPending: true,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  const capitalize = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div
      className={`g-sidenav-show bg-gray-200 ${
        nav ? "g-sidenav-pinned" : ""
      } h-100`}
    >
      <SideBar user={userdata} />
      <div className="main-content position-relative max-height-vh-100 h-100">
        <nav
          className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl"
          id="navbarBlur"
          data-scroll="true"
        >
          <div className="container-fluid py-1 px-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                {pathname.split("/").map((item, index) => {
                  const caps = capitalize(item as string) || item;
                  console.log(caps, item, "---");
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
                      {caps}
                    </li>
                  );
                })}
              </ol>
              <h6 className="font-weight-bolder mb-0">Profile</h6>
            </nav>
            <div
              className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4"
              id="navbar"
            >
              <div className="ms-md-auto pe-md-3 d-flex align-items-center">
                <div className="input-group input-group-outline">
                  <label className="form-label">Type here...</label>
                  <input type="text" className="form-control" />
                </div>
              </div>
              <ul className="navbar-nav  justify-content-end">
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
                <li className="nav-item d-flex align-items-center">
                  <button
                    className="nav-link text-body font-weight-bold px-0"
                    onClick={HandleSignOut}
                  >
                    <span className="d-sm-inline d-none">Sign Out</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {children}
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

export const Sidebar = ({user}: { user: any }) => {
  const [list, setList] = useState<any>([]);
  const location = useLocation();

  const getList = () => {
    let list = [];
    if (user.role_id === 1) {
      list = [
        {
          name: "Dashboard",
          link: "/dashboard",
        },
        {
          name: "Users",
          link: "/users",
        },
        {
          name: "Faculties",
          link: "/faculties",
        },
        {
          name: "Majors",
          link: "/majors",
        },
        {
          name: "Classes",
          link: "/classes",
        },
        {
          name: "Courses",
          link: "/course",
        },
        {
          name: "Roles",
          link: "/roles",
        },
        {
          name: "Permissions",
          link: "/permissions",
        },
        {
          name: "Locations",
          link: "/locations",
        },
        {
          name: "Attendances",
          link: "/attendances",
        },
        {
          name: "Profile",
          link: "/profile",
        },
      ];
      setList(list);
    } else if (user.role_id === 2) {
      console.log("faculty");
    } else if (user.role_id === 3) {
      console.log("lecture");
    } else if (user.role_id === 4) {
      console.log("student");
      list = [
        {
          name: "Dashboard",
          link: "/dashboard",
        },
        {
          name: "Attendance",
          link: "/attendance",
        },
        {
          name: "Profile",
          link: "/profile",
        },
        {
          name: "Notification",
          link: "/notification",
        },
      ];
      setList(list);
    } else {
      console.log("guest");
    }
  };

  useEffect(() => {
    if (user) {
      getList();
    }
  }, [user]);

  const appName = import.meta.env.VITE_APP_NAME;

  return (
    <aside
      className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 bg-gradient-dark ps bg-white"
      id="sidenav-main"
    >
      <div className="sidenav-header d-flex justify-content-center align-items-center">
        <span className="ms-1 font-weight-bold text-white">{appName}</span>
      </div>
      <div
        className="collapse navbar-collapse h-100"
        id="sidenav-collapse-main"
      >
        <ul className="navbar-nav">
          {list.map((item: any, index: number) => {
            return (
              <li key={index} className="nav-item">
                <Link to={item.link}
                      className={`nav-link text-white ${
                        location.pathname.includes(item.link)
                          ? "active bg-primary bg-opacity-25"
                          : ""
                      }`}
                >
                  <span className="nav-link-text ms-1">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

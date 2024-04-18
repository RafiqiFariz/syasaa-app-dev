import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

export const Sidebar = ({ user }: { user: any }) => {
  const [list, setList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  console.log(user);
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
          name: "Courses Classes",
          link: "/courses-classes",
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
          name: "Attendances",
          link: "/attendences",
        },
        {
          name: "Profile",
          link: "/profile",
        },
      ];
      setList(list);
    } else if (user.role_id === 2) {
      list = [
        {
          name: "Dashboard",
          link: "/dashboard",
        },
        {
          name: "Lectures",
          link: "/users",
        },
        {
          name: "Majors",
          link: "/majors",
        },
        {
          name: "Course Classes",
          link: "/courses-classes",
        },
        {
          name: "Attendances",
          link: "/attendences",
        },
        {
          name: "Attendances Request",
          link: "/attendence-request",
        },
      ];
      setList(list);
    } else if (user.role_id === 3) {
      list = [
        {
          name: "Dashboard",
          link: "/dashboard",
        },
        {
          name: "Students",
          link: "/users",
        },
        {
          name: "Schedules",
          link: "/courses-classes",
        },
        {
          name: "Attendance",
          link: "/attendences",
        },
        {
          name: "Attendance Request",
          link: "/attendence-request",
        },
        {
          name: "Profile",
          link: "/profile",
        },
      ];
      setList(list);
    } else if (user.role_id === 4) {
      list = [
        {
          name: "Dashboard",
          link: "/dashboard",
        },
        {
          name: "Schedules",
          link: "/schedules",
        },
        {
          name: "Attendance",
          link: "/attendences",
        },
        {
          name: "Attendance Request",
          link: "/attendence-request",
        },
        {
          name: "Profile",
          link: "/profile",
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
                <Link
                  to={item.link}
                  className={`nav-link text-white ${
                    location.pathname === item.link
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

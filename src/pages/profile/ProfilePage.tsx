import { useContext } from "react";
import { UserLayout } from "../../components/Layout/Layout";
import { AuthContext } from "../../context/Auth";
import _ from "lodash";
import { useHistory } from "react-router";

export const ProfilePage = () => {
  const { isLogin, setIsLogin } = useContext(AuthContext);
  const history = useHistory();
  console.log(isLogin, "isLogin");
  return (
    <UserLayout>
      <div className="container-fluid px-2 px-md-4">
        <div
          className="page-header min-height-200 border-radius-xl mt-4"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
          }}
        >
          <span className="mask bg-gradient-primary opacity-6"></span>
        </div>
        <div className="card card-body mx-3 mx-md-4 mt-n6">
          <div className="row gx-4 mb-2">
            <div className="col-auto">
              <div className="avatar avatar-xl position-relative">
                <img
                  src="https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png"
                  alt="profile_image"
                  className="w-100 rounded-circle shadow-sm"
                />
              </div>
            </div>
            <div className="col-auto my-auto">
              <div className="h-100">
                <h5 className="mb-1">{isLogin.data.name}</h5>
                <p className="mb-0 font-weight-bold text-sm">
                  {_.startCase(_.camelCase(isLogin.data.role.name))}
                </p>
              </div>
            </div>
            <div className="col d-flex justify-content-end h-10">
              <button
                className="btn btn-primary btn-sm mb-0 h-10"
                style={{
                  height: "50px",
                }}
                onClick={() => history.push(`/profile/edit/${isLogin.data.id}`)}
              >
                <span className="p-0">Request Edit Profile</span>
              </button>
            </div>
          </div>
          <div className="row">
            <div className="row">
              <div className="col-12 col-xl-4">
                <div className="card card-plain h-100">
                  <div className="card-header pb-0 p-3">
                    <div className="row">
                      <div className="col-md-8 d-flex align-items-center">
                        <h6 className="mb-0">Profile Information</h6>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-3">
                    <ul className="list-group">
                      <li className="list-group-item border-0 ps-0 pt-0 text-sm">
                        <strong className="text-dark">Full Name:</strong> &nbsp;
                        {isLogin.data.name}
                      </li>
                      <li className="list-group-item border-0 ps-0 text-sm">
                        <strong className="text-dark">Phone:</strong> &nbsp;
                        {isLogin.data.phone_number || "088809990777"}
                      </li>
                      <li className="list-group-item border-0 ps-0 text-sm">
                        <strong className="text-dark">Email:</strong> &nbsp;
                        {isLogin.data.email || "@"}
                      </li>
                      <li className="list-group-item border-0 ps-0 text-sm">
                        <strong className="text-dark">Class :</strong> &nbsp;
                        {isLogin.data.student.class.name || "XII RPL"}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

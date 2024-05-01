import { useContext } from "react";
import { UserLayout } from "../../components/Layout/Layout";
import { AuthContext } from "../../context/Auth";
import _ from "lodash";
import { useHistory } from "react-router";

export const ProfilePage = () => {
  const {isLogin, setIsLogin} = useContext(AuthContext);
  const history = useHistory();
  const user = isLogin.data;
  const getUserProfilePhoto = () => {
    // jika path gambarnya ada di folder img/,
    // maka asumsinya adalah gambar tersebut digunakan untuk seeder
    if (user.image?.includes("img/")) {
      return user.image?.replace("storage/", "");
    }

    return user.image;
  };
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
        <div className="card card-body mx-3 mx-md-6 mt-n6">
          <div className="col gx-4 mb-2 mx-3 mx-md-6 mt-n5">
            <div className="d-flex justify-content-center zindex-fixed h-100 mb-3">
              <div className="avatar avatar-xl position-relative zindex-fixed h-100">
                <img
                  src={getUserProfilePhoto()}
                  alt="profile_image"
                  className="shadow w-100 rounded-circle"
                />
              </div>
            </div>
            <div className="my-auto">
              <div className="h-100 d-flex justify-content-center text-lg">
                <h5 className="mb-1">{isLogin.data.name}</h5>
              </div>
            </div>
            <div className="my-auto">
              <div className="h-100 d-flex justify-content-center ">
                <p className="mb-0 font-weight-bold text-lg">
                  {_.startCase(_.camelCase(isLogin.data.role.name))}
                </p>
              </div>
            </div>
          </div>

          <div className="row d-flex justify-content-center">
            <div className="col-12 col-xl-4">
              <div className="card card-plain h-100">
                <div className="card-body p-0 d-flex justify-content-center">
                  <ul className="list-group">
                    <li className="list-group-item border-0 p-0 mb-2 text-lg d-flex justify-content-center">
                      {isLogin.data.phone_number || "088809990777"}
                    </li>
                    <li className="list-group-item border-0 p-0 text-lg mb-2 d-flex justify-content-center">
                      {isLogin.data.email || "@"}
                    </li>
                    {isLogin.data.role_id === 3 || isLogin.data.role_id === 4 && (
                      <li className="list-group-item border-0 p-0 text-lg mb-2 d-flex justify-content-center">
                        {isLogin.data.role_id === 3 ? isLogin.data?.lecturer?.address : isLogin.data?.student?.class.name}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col d-flex justify-content-end h-10 d-flex justify-content-center">
            <button
              className="btn btn-primary btn-sm mb-0 h-10 rounded-pill"
              style={{
                height: "50px",
              }}
              onClick={() => history.push(`/profile/edit/${isLogin.data.id}`)}
            >
              <span className="p-1">Request Edit Profile</span>
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

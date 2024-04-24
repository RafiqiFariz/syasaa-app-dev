import { useContext } from "react";
import { UserLayout } from "../../components/Layout/Layout";
import { AuthContext } from "../../context/Auth";
import _ from "lodash";

export const ProfilePage = () => {
  const { isLogin, setIsLogin } = useContext(AuthContext);
  console.log(isLogin, "isLogin");
  return (
    <UserLayout>
      <div className="container-fluid px-2 px-md-4">
        <div
          className="page-header min-height-300 border-radius-xl mt-4"
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
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-12 col-xl-4">
                <div className="card card-plain h-100">
                  <div className="card-header pb-0 p-3">
                    <h6 className="mb-0">Conversations</h6>
                  </div>
                  <div className="card-body p-3">
                    <ul className="list-group">
                      <li className="list-group-item border-0 d-flex align-items-center px-0 mb-2 pt-0">
                        <div className="avatar me-3">
                          <img
                            src="../assets/img/kal-visuals-square.jpg"
                            alt="kal"
                            className="border-radius-lg shadow"
                          />
                        </div>
                        <div className="d-flex align-items-start flex-column justify-content-center">
                          <h6 className="mb-0 text-sm">Sophie B.</h6>
                          <p className="mb-0 text-xs">
                            Hi! I need more information..
                          </p>
                        </div>
                        <a
                          className="btn btn-link pe-3 ps-0 mb-0 ms-auto w-25 w-md-auto"
                          href="javascript:;"
                        >
                          Reply
                        </a>
                      </li>
                      <li className="list-group-item border-0 d-flex align-items-center px-0 mb-2">
                        <div className="avatar me-3">
                          <img
                            src="../assets/img/marie.jpg"
                            alt="kal"
                            className="border-radius-lg shadow"
                          />
                        </div>
                        <div className="d-flex align-items-start flex-column justify-content-center">
                          <h6 className="mb-0 text-sm">Anne Marie</h6>
                          <p className="mb-0 text-xs">
                            Awesome work, can you..
                          </p>
                        </div>
                        <a
                          className="btn btn-link pe-3 ps-0 mb-0 ms-auto w-25 w-md-auto"
                          href="javascript:;"
                        >
                          Reply
                        </a>
                      </li>
                      <li className="list-group-item border-0 d-flex align-items-center px-0 mb-2">
                        <div className="avatar me-3">
                          <img
                            src="../assets/img/ivana-square.jpg"
                            alt="kal"
                            className="border-radius-lg shadow"
                          />
                        </div>
                        <div className="d-flex align-items-start flex-column justify-content-center">
                          <h6 className="mb-0 text-sm">Ivanna</h6>
                          <p className="mb-0 text-xs">About files I can..</p>
                        </div>
                        <a
                          className="btn btn-link pe-3 ps-0 mb-0 ms-auto w-25 w-md-auto"
                          href="javascript:;"
                        >
                          Reply
                        </a>
                      </li>
                      <li className="list-group-item border-0 d-flex align-items-center px-0 mb-2">
                        <div className="avatar me-3">
                          <img
                            src="../assets/img/team-4.jpg"
                            alt="kal"
                            className="border-radius-lg shadow"
                          />
                        </div>
                        <div className="d-flex align-items-start flex-column justify-content-center">
                          <h6 className="mb-0 text-sm">Peterson</h6>
                          <p className="mb-0 text-xs">
                            Have a great afternoon..
                          </p>
                        </div>
                        <a
                          className="btn btn-link pe-3 ps-0 mb-0 ms-auto w-25 w-md-auto"
                          href="javascript:;"
                        >
                          Reply
                        </a>
                      </li>
                      <li className="list-group-item border-0 d-flex align-items-center px-0">
                        <div className="avatar me-3">
                          <img
                            src="../assets/img/team-3.jpg"
                            alt="kal"
                            className="border-radius-lg shadow"
                          />
                        </div>
                        <div className="d-flex align-items-start flex-column justify-content-center">
                          <h6 className="mb-0 text-sm">Nick Daniel</h6>
                          <p className="mb-0 text-xs">
                            Hi! I need more information..
                          </p>
                        </div>
                        <a
                          className="btn btn-link pe-3 ps-0 mb-0 ms-auto w-25 w-md-auto"
                          href="javascript:;"
                        >
                          Reply
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-12 mt-4">
                <div className="mb-5 ps-3">
                  <h6 className="mb-1">Projects</h6>
                  <p className="text-sm">Architects design houses</p>
                </div>
                <div className="row">
                  <div className="col-xl-3 col-md-6 mb-xl-0 mb-4">
                    <div className="card card-blog card-plain">
                      <div className="card-header p-0 mt-n4 mx-3">
                        <a className="d-block shadow-xl border-radius-xl">
                          <img
                            src="../assets/img/home-decor-1.jpg"
                            alt="img-blur-shadow"
                            className="img-fluid shadow border-radius-xl"
                          />
                        </a>
                      </div>
                      <div className="card-body p-3">
                        <p className="mb-0 text-sm">Project #2</p>
                        <a href="javascript:;">
                          <h5>Modern</h5>
                        </a>
                        <p className="mb-4 text-sm">
                          As Uber works through a huge amount of internal
                          management turmoil.
                        </p>
                        <div className="d-flex align-items-center justify-content-between">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm mb-0"
                          >
                            View Project
                          </button>
                          <div className="avatar-group mt-2">
                            <a
                              href="javascript:;"
                              className="avatar avatar-xs rounded-circle"
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="Elena Morison"
                            >
                              <img
                                alt="Image placeholder"
                                src="../assets/img/team-1.jpg"
                              />
                            </a>
                            <a
                              href="javascript:;"
                              className="avatar avatar-xs rounded-circle"
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="Ryan Milly"
                            >
                              <img
                                alt="Image placeholder"
                                src="../assets/img/team-2.jpg"
                              />
                            </a>
                            <a
                              href="javascript:;"
                              className="avatar avatar-xs rounded-circle"
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="Nick Daniel"
                            >
                              <img
                                alt="Image placeholder"
                                src="../assets/img/team-3.jpg"
                              />
                            </a>
                            <a
                              href="javascript:;"
                              className="avatar avatar-xs rounded-circle"
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="Peterson"
                            >
                              <img
                                alt="Image placeholder"
                                src="../assets/img/team-4.jpg"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-md-6 mb-xl-0 mb-4">
                    <div className="card card-blog card-plain">
                      <div className="card-header p-0 mt-n4 mx-3">
                        <a className="d-block shadow-xl border-radius-xl">
                          <img
                            src="../assets/img/home-decor-2.jpg"
                            alt="img-blur-shadow"
                            className="img-fluid shadow border-radius-lg"
                          />
                        </a>
                      </div>
                      <div className="card-body p-3">
                        <p className="mb-0 text-sm">Project #1</p>
                        <a href="javascript:;">
                          <h5>Scandinavian</h5>
                        </a>
                        <p className="mb-4 text-sm">
                          Music is something that every person has his or her
                          own specific opinion about.
                        </p>
                        <div className="d-flex align-items-center justify-content-between">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm mb-0"
                          >
                            View Project
                          </button>
                          <div className="avatar-group mt-2">
                            <a
                              href="javascript:;"
                              className="avatar avatar-xs rounded-circle"
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="Nick Daniel"
                            >
                              <img
                                alt="Image placeholder"
                                src="../assets/img/team-3.jpg"
                              />
                            </a>
                            <a
                              href="javascript:;"
                              className="avatar avatar-xs rounded-circle"
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="Peterson"
                            >
                              <img
                                alt="Image placeholder"
                                src="../assets/img/team-4.jpg"
                              />
                            </a>
                            <a
                              href="javascript:;"
                              className="avatar avatar-xs rounded-circle"
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="Elena Morison"
                            >
                              <img
                                alt="Image placeholder"
                                src="../assets/img/team-1.jpg"
                              />
                            </a>
                            <a
                              href="javascript:;"
                              className="avatar avatar-xs rounded-circle"
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="Ryan Milly"
                            >
                              <img
                                alt="Image placeholder"
                                src="../assets/img/team-2.jpg"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-md-6 mb-xl-0 mb-4">
                    <div className="card card-blog card-plain">
                      <div className="card-header p-0 mt-n4 mx-3">
                        <a className="d-block shadow-xl border-radius-xl">
                          <img
                            src="../assets/img/home-decor-3.jpg"
                            alt="img-blur-shadow"
                            className="img-fluid shadow border-radius-xl"
                          />
                        </a>
                      </div>
                      <div className="card-body p-3">
                        <p className="mb-0 text-sm">Project #3</p>
                        <a href="javascript:;">
                          <h5>Minimalist</h5>
                        </a>
                        <p className="mb-4 text-sm">
                          Different people have different taste, and various
                          types of music.
                        </p>
                        <div className="d-flex align-items-center justify-content-between">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm mb-0"
                          >
                            View Project
                          </button>
                          <div className="avatar-group mt-2">
                            <a
                              href="javascript:;"
                              className="avatar avatar-xs rounded-circle"
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="Peterson"
                            >
                              <img
                                alt="Image placeholder"
                                src="../assets/img/team-4.jpg"
                              />
                            </a>
                            <a
                              href="javascript:;"
                              className="avatar avatar-xs rounded-circle"
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="Nick Daniel"
                            >
                              <img
                                alt="Image placeholder"
                                src="../assets/img/team-3.jpg"
                              />
                            </a>
                            <a
                              href="javascript:;"
                              className="avatar avatar-xs rounded-circle"
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="Ryan Milly"
                            >
                              <img
                                alt="Image placeholder"
                                src="../assets/img/team-2.jpg"
                              />
                            </a>
                            <a
                              href="javascript:;"
                              className="avatar avatar-xs rounded-circle"
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="Elena Morison"
                            >
                              <img
                                alt="Image placeholder"
                                src="../assets/img/team-1.jpg"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-md-6 mb-xl-0 mb-4">
                    <div className="card card-blog card-plain">
                      <div className="card-header p-0 mt-n4 mx-3">
                        <a className="d-block shadow-xl border-radius-xl">
                          <img
                            src="https://images.unsplash.com/photo-1606744824163-985d376605aa?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                            alt="img-blur-shadow"
                            className="img-fluid shadow border-radius-xl"
                          />
                        </a>
                      </div>
                      <div className="card-body p-3">
                        <p className="mb-0 text-sm">Project #4</p>
                        <a href="javascript:;">
                          <h5>Gothic</h5>
                        </a>
                        <p className="mb-4 text-sm">
                          Why would anyone pick blue over pink? Pink is
                          obviously a better color.
                        </p>
                        <div className="d-flex align-items-center justify-content-between">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm mb-0"
                          >
                            View Project
                          </button>
                          <div className="avatar-group mt-2">
                            <a
                              href="javascript:;"
                              className="avatar avatar-xs rounded-circle"
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="Peterson"
                            >
                              <img
                                alt="Image placeholder"
                                src="../assets/img/team-4.jpg"
                              />
                            </a>
                            <a
                              href="javascript:;"
                              className="avatar avatar-xs rounded-circle"
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="Nick Daniel"
                            >
                              <img
                                alt="Image placeholder"
                                src="../assets/img/team-3.jpg"
                              />
                            </a>
                            <a
                              href="javascript:;"
                              className="avatar avatar-xs rounded-circle"
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="Ryan Milly"
                            >
                              <img
                                alt="Image placeholder"
                                src="../assets/img/team-2.jpg"
                              />
                            </a>
                            <a
                              href="javascript:;"
                              className="avatar avatar-xs rounded-circle"
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="Elena Morison"
                            >
                              <img
                                alt="Image placeholder"
                                src="../assets/img/team-1.jpg"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
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

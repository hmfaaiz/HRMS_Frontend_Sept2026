/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link, Switch, Redirect } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import { ContentRoute } from "../../../../_metronic/layout";
import Login from "./Login";
import Registration from "./Registration";
import ForgotPassword from "./ForgotPassword";
import "../../../../_metronic/_assets/sass/pages/login/classic/login-1.scss";
import { shallowEqual, useSelector } from "react-redux";
import Marquee from "react-fast-marquee";
export function AuthPage() {

  const auth = useSelector(({ auth }) => auth, shallowEqual);
  const UserAccess = auth?.userAccess;
  const user = auth?.user;
  return (
    <>
      <div
        className="d-flex flex-column m-0 p-0"
        // style={{
        //   backgroundImage: `url(${toAbsoluteUrl("/media/bg/bg-4.png")})`,
        // }}
      >
        {/*begin::Login*/}
        <div
          className=" d-flex flex-column"
          id="kt_login"
          style={{
            height: "100%", // Full height of the viewport
            // width: "100%", // Full width of the viewport
            // backgroundImage: 'linear-gradient(to bottom, rgb(36, 144, 207), rgb(13, 114, 185)',  // Linear gradient background
            backgroundImage: `url(${toAbsoluteUrl("/media/bg/login-bg.png")})`,
            backgroundSize: "cover", // Ensures the gradient covers the entire area
            backgroundPosition: "center", // Ensures the background is centered
          }}
        >
          {/* login div */}

          <div className="container-fluid h-100">
            <div className="row h-100">
              <div className="col-12 col-md-4 m-0 p-5 d-flex flex-column" style={{ borderRadius: '8px' }}>

                <Switch>
                  <ContentRoute path="/auth/login" component={Login} />
                  <ContentRoute
                    path="/auth/registration"
                    component={Registration}
                  />
                  <ContentRoute
                    path="/auth/forgot-password"
                    component={ForgotPassword}
                  />
                  <Redirect from="/auth" exact={true} to="/auth/login" />
                  <Redirect to="/auth/login" />
                </Switch>

              </div>
            </div>
          </div>

          {/* left side */}

          {/* <div className="login-left-container d-flex flex-column  col-8">
            <div
              className="login-left-container-inner"
              style={{
                width: "50vw",
              }}
            >
              <div
                className="login-left-container-inner-img"
                style={{
                  backgroundImage: `url(${toAbsoluteUrl(
                    "/media/bg/login-pic.png"
                  )})`,
                  backgroundSize: "cover", // Ensures the gradient covers the entire area
                  backgroundPosition: "center", // Ensures the background is centered
                }}
              ></div>
              <div className="d-flex flex-column mt-10">
                <div className="mb-3">
                  <h1>Technology Partners</h1>
                </div>




                <div style={{ padding: "20px 0", background: "#fff" }}>
                  <Marquee
                    speed={40}
                    gradient={false}
                    pauseOnHover={true}
                  >
                    <img
                      src="/media/bg/tech-partner1.png"
                      alt="Partner 1"
                      style={{ height: 50, marginRight: 30 }}
                    />
                    <img
                      src="/media/bg/tech-partner2.png"
                      alt="Partner 2"
                      style={{ height: 50, marginRight: 30 }}
                    />   <img
                      src="/media/bg/tech-partner2.png"
                      alt="Partner 2"
                      style={{ height: 50, marginRight: 30 }}
                    />   <img
                      src="/media/bg/tech-partner2.png"
                      alt="Partner 2"
                      style={{ height: 50, marginRight: 30 }}
                    />   <img
                      src="/media/bg/tech-partner2.png"
                      alt="Partner 2"
                      style={{ height: 50, marginRight: 30 }}
                    />   <img
                      src="/media/bg/tech-partner2.png"
                      alt="Partner 2"
                      style={{ height: 50, marginRight: 30 }}
                    />
                    <img
                      src="/media/bg/tech-partner3.png"
                      alt="Partner 3"
                      style={{ height: 50, marginRight: 30 }}
                    />
                    <img
                      src="/media/bg/tech-partner4.png"
                      alt="Partner 4"
                      style={{ height: 50, marginRight: 30 }}
                    />
                    <img
                      src="/media/bg/tech-partner1.png"
                      alt="Partner 5"
                      style={{ height: 50, marginRight: 30 }}
                    />
                  </Marquee>
                </div>
              </div>








            </div>

            <footer className="d-flex gap-4  login-left-footer justify-content-between p-4 pl-0">
              <div>
                <div className="mt-4">
                  <img
                    src="/media/bg/facebook-logo.png"
                    alt="Partner Logo"
                    // className="partner-image"
                    className="ml-0"

                  />
                  <img
                    src="/media/bg/insta-logo.png"
                    alt="Partner Logo"
                    className="ml-4"

                  />
                  <img
                    src="/media/bg/youtube-logo.png"
                    alt="Partner Logo"
                    className="ml-4"

                  />
                  <img
                    src="/media/bg/linkedin-logo.png"
                    alt="Partner Logo"
                    className="ml-4"

                  />
                </div>
              </div>
              <div>
                <p className="mt-5 pr-2">&copy;Copyright © 2024, Powered by Dynasoft Cloud</p>
              </div>


            </footer>
          </div> */}
        </div>
      </div>
    </>
  );
}

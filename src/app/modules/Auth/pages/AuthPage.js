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
import { Linkedin, Youtube, Facebook, Instagram } from 'lucide-react';
import { Carousel } from 'react-bootstrap';


export function AuthPage() {

  const auth = useSelector(({ auth }) => auth, shallowEqual);
  const UserAccess = auth?.userAccess;
  const user = auth?.user;
  return (
    <>


      <div
        className=" d-flex flex-column"
        id="kt_login"
        style={{
          height: "100vh", // full viewport height ✅
          backgroundImage: `url(${toAbsoluteUrl("/media/bg/hero-bg.webp")})`,
          backgroundSize: "cover", // covers full area ✅
          backgroundPosition: "center", // centers the image ✅
          backgroundRepeat: "no-repeat", // prevent tiling (optional)
        }}
      >
        {/* login div */}

        <div className="container-fluid h-100">
          <div className="row h-100 ">
            {/* Left Login Input */}
            <div className="col-12 col-md-4 m-0 p-5 d-flex flex-column " style={{ borderRadius: '8px' }}>

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


            {/* Right  */}


            <div className="col-12 col-md-8 pt-5 d-flex flex-column d-none">
              <div className="bg-white p-5 m-0 rounded-top">
                {/* <div
                  className=" d-flex flex-column"
                  id="kt_login"
                  style={{
                    height: "63vh", // full viewport height ✅
                    backgroundImage: `url(${toAbsoluteUrl("/media/bg/login-pic.png")})`,
                    backgroundSize: "cover", // covers full area ✅
                    backgroundPosition: "center", // centers the image ✅
                    backgroundRepeat: "no-repeat", // prevent tiling (optional)
                  }}
                >




                </div> */}
                <Carousel interval={3000}>
                  {[1, 2, 3].map((item, index) => (
                    <Carousel.Item key={index}>
                      <div
                        className="d-flex flex-column"
                        style={{
                          height: '63vh',
                          backgroundImage: `url(${toAbsoluteUrl("/media/bg/login-pic.png")})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                        }}
                      ></div>
                    </Carousel.Item>
                  ))}
                </Carousel>
                {/* <div
                  id="carouselExampleIndicators"
                  className="carousel slide"
                  data-ride="carousel"
                  data-interval="3000"
                >
                  <ol className="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                  </ol>

                  <div className="carousel-inner">
                    {[1, 2, 3].map((item, index) => (
                      <div
                        key={index}
                        className={`carousel-item ${index === 0 ? 'active' : ''}`}
                      >
                        <div
                          className="d-flex flex-column"
                          style={{
                            height: "63vh",
                            backgroundImage: `url(${toAbsoluteUrl("/media/bg/login-pic.png")})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          }}
                        ></div>
                      </div>
                    ))}
                  </div>

                  <a
                    className="carousel-control-prev"
                    href="#carouselExampleIndicators"
                    role="button"
                    data-slide="prev"
                  >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                  </a>
                  <a
                    className="carousel-control-next"
                    href="#carouselExampleIndicators"
                    role="button"
                    data-slide="next"
                  >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                  </a>
                </div> */}


                <div className="d-flex flex-column">
                  <div className="mt-10">
                    <h1>Technology Partners</h1>
                  </div>




                  <div className="d-flex mt-9">
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


              <footer className="d-flex gap-4  login-left-footer justify-content-between p-0 rounded-bottom ">
                <div>
                  <div className="mt-4">
                    {/* <Linkedin className="w-6 h-6 pl-2 text-black cursor-pointer"/> */}
                    <img
                      src="/media/bg/facebook.svg"
                      alt="Partner Logo"
                      // className="partner-image"
                      className="ml-0"

                    />  <img
                      src="/media/bg/youtube.svg"
                      alt="Partner Logo"
                      // className="partner-image"
                      className="ml-0"

                    />  <img
                      src="/media/bg/linkedin.svg"
                      alt="Partner Logo"
                      // className="partner-image"
                      className="ml-0"

                    />  <img
                      src="/media/bg/instagram.svg"
                      alt="Partner Logo"
                      // className="partner-image"
                      className="ml-0"

                    />  <img
                      src="/media/bg/mail.svg"
                      alt="Partner Logo"
                      // className="partner-image"
                      className="ml-0"

                    />

                    {/* <Facebook  className="w-6 h-6 pl-2 text-black cursor-pointer"/> */}
                    {/* <Instagram className="w-4 h-4 pl-2text-black cursor-pointer"/> */}
                    {/* <Youtube className="w-6 h-6 pl-2text-black cursor-pointer"/> */}
                  </div>
                </div>
                <div>
                  <p className="mt-5 pr-2">2025 © HRMS By Dynasoft Cloud</p>
                </div>


              </footer>




            </div>
            {/* right end */}

          </div>



        </div>

        {/* left side */}


      </div>

    </>
  );
}

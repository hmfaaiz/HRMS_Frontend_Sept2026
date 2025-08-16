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
        className=""
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

        <div className="grid md:grid-cols-6">
       
            {/* Left Login Input */}
            <div className="col-span-2 m-0 p-5  h-screen" >

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


            <div className="col-span-4 p-5  opacity-97 hidden md:block h-screen" >
              {/*  style={{ display: window.innerWidth < 768 ? 'none' : 'flex' }} */}
              <div className="bg-white p-5 m-0 rounded-top">
   

                <Carousel interval={3000}>
                  {[1, 2, 3, 4].map((item, index) => (
                    <Carousel.Item key={index}>
                      <a
                        href="https://dynasoftcloud.com/contact-us.php"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none' }}
                      >
                        <div
                          className="d-flex flex-column rounded"
                          style={{
                            height: '63vh',
                            backgroundImage: `url(${toAbsoluteUrl(`/media/bg/Slider/Slider${index + 1}.webp`)})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                          }}
                        ></div>
                      </a>
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
                  {/* <div className="mt-10">
                    <h1>Technology Partners</h1>
                  </div> */}

                  <h5 className="mt-8 text-black font-bold text-base sm:text-lg py-1">
                    Technology Partners
                  </h5>


                  <div className="d-flex mt-6 mb-8">
                    <Marquee
                      speed={40}
                      gradient={false}
                      pauseOnHover={true}
                    >
                      <img
                        src="/media/bg/Marquee/Marquee1.png"
            
                        style={{ height: 50, marginRight: 30 }}
                      />
                      <img
                        src="/media/bg/Marquee/Marquee2.png"
                   
                        style={{ height: 50, marginRight: 30 }}
                      />   <img
                        src="/media/bg/Marquee/Marquee3.png"
                   
                        style={{ height: 50, marginRight: 30 }}
                      />   <img
                        src="/media/bg/Marquee/Marquee4.png"
                    
                        style={{ height: 50, marginRight: 30 }}
                      />   <img
                        src="/media/bg/Marquee/Marquee5.png"
                   
                        style={{ height: 50, marginRight: 30 }}
                      />   <img
                        src="/media/bg/Marquee/Marquee6.png"
                     
                        style={{ height: 50, marginRight: 30 }}
                      />
                      <img
                        src="/media/bg/Marquee/Marquee7.png"
                      
                        style={{ height: 50, marginRight: 30 }}
                      />
                      <img
                        src="/media/bg/Marquee/Marquee1.png"
                   
                        style={{ height: 50, marginRight: 30 }}
                      />
                      <img
                        src="/media/bg/Marquee/Marquee2.png"
                    
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
                    <a href="https://pk.linkedin.com/company/dynasoftcloud" target="_blank" rel="noopener noreferrer">
                      <img
                        src="/media/bg/SM-Linkedin.svg"

                        // className="partner-image"
                        className="ml-2 w-5 h-5"

                      />
                    </a>
                    <a href="https://www.facebook.com/dynasoftcloud" target="_blank" rel="noopener noreferrer">
                      <img
                        src="/media/bg/SM-Facebook.svg"
                        className="ml-2 w-5 h-5"
                        alt="Facebook"
                      />
                    </a>

                    <a href="https://www.instagram.com/dynasoftcloud/" target="_blank" rel="noopener noreferrer">
                      <img
                        src="/media/bg/SM-Instagram.svg"

                        // className="partner-image"
                        className="ml-2 w-5 h-5"

                      />

                    </a>


                    <a href="https://www.youtube.com/@DynasoftCloud" target="_blank" rel="noopener noreferrer">
                      <img
                        src="/media/bg/SM-YouTube.svg"

                        // className="partner-image"
                        className="ml-2 w-5 h-5"

                      />
                    </a>

                  </div>
                </div>
                <div>
                  <p className="mt-5 pr-2 text-black mr-2">2025 &copy; HRMS By Dynasoft Cloud</p>
                </div>


              </footer>




            </div>
            {/* right end */}

          </div>



      




      </div >

    </>
  );
}

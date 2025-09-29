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
import ResetLinkPassword from "./ResetLinkPassword";


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

        <div className="grid lg:grid-cols-6">
       
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
                <ContentRoute
                  path="/auth/reset-link-password/:Id"
                  component={ResetLinkPassword}
                />
                <Redirect from="/auth" exact={true} to="/auth/login" />
                <Redirect to="/auth/login" />
              </Switch>

            </div>


            {/* Right  */}


            <div className="col-span-4 p-5  opacity-97 hidden lg:block h-screen" >
            
              <div className="bg-white p-5 m-0 rounded-top h-[93%]">
   

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
                            height: '62.5vh',
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


              <footer className="flex bg-tsecondary justify-between rounded-bottom h-[7%]">
             
                  <div className=" flex gap-3 items-center pl-4 ">
                    {/* <Linkedin className="w-6 h-6 pl-2 text-black cursor-pointer"/> */}
                    <a href="https://pk.linkedin.com/company/dynasoftcloud" target="_blank" rel="noopener noreferrer">
                      <img
                        src="/media/bg/SM-Linkedin.svg"

                        // className="partner-image"
                        className=" w-5 h-5"

                      />
                    </a>
                    <a href="https://www.facebook.com/dynasoftcloud" target="_blank" rel="noopener noreferrer">
                      <img
                        src="/media/bg/SM-Facebook.svg"
                        className=" w-5 h-5"
                        alt="Facebook"
                      />
                    </a>

                    <a href="https://www.instagram.com/dynasoftcloud/" target="_blank" rel="noopener noreferrer">
                      <img
                        src="/media/bg/SM-Instagram.svg"

                        // className="partner-image"
                        className=" w-5 h-5"

                      />

                    </a>


                    <a href="https://www.youtube.com/@DynasoftCloud" target="_blank" rel="noopener noreferrer">
                      <img
                        src="/media/bg/SM-YouTube.svg"

                        // className="partner-image"
                        className=" w-5 h-5"

                      />
                    </a>

                  </div>
               
                <div className="flex items-center mt-5 mr-5 ">
                  <p className="  text-black ">2025 &copy; HRMS By Dynasoft Cloud</p>
                </div>


              </footer>




            </div>
            {/* right end */}

          </div>



      




      </div >

    </>
  );
}

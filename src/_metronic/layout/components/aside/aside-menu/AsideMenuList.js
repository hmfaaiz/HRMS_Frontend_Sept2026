/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, {  useState, useRef } from "react";
import { useLocation } from "react-router";
import {  checkIsActive } from "../../../../_helpers";
import { shallowEqual, useSelector } from "react-redux";
import {
  Navbar,
  Nav,
  NavDropdown,
  
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navigation_menu.css";

export function AsideMenuList({ layoutProps }) {
  const auth = useSelector(({ auth }) => auth, shallowEqual);
  const UserAccess = auth?.userAccess;
  const user = auth?.user;
  const Settings = auth?.userAccess?.Settings;

  const [isVisible, setIsVisible] = useState(true);
  const menuRef = useRef(null);
  // Hide menu when clicked outside


  // Toggle visibility of the menu
  const toggleMenuVisibility = () => {
    setIsVisible((prevState) => !prevState);
  };

  const isDashboardAccess = Settings?.some((obj) =>
    Object.values(obj).includes("read-all-vehicles-dashboard")
  );

  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu &&
          "menu-item-active"} menu-item-open menu-item-not-hightlighted`
      : "";
  };


  const res = Object.values(UserAccess).flatMap((items) => items);
  const portalRoutesLength = res.filter(
    (e) => e?.isResourceShow && e.portalType === 2
  ).length;
  const HRMSRoutesLength = res.filter(
    (e) => e?.isResourceShow && e.portalType === 1
  ).length;

  const isEmployeePortalStored =
    localStorage.getItem("isEmployeePortal") === "true";

  const isEmployeePortal = isEmployeePortalStored
    ? portalRoutesLength > 0
      ? "2"
      : "1"
    : HRMSRoutesLength > 0
    ? "1"
    : "2";

  return (
    <>
      {/* begin::Menu Nav */}

      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {isDashboardAccess && (
          <>
            <li
              className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
              aria-haspopup="true"
            >
              {/* <NavLink className="menu-link" to="/dashboard">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                  />
                </span>
                <span className="menu-text">Dashboard</span>
              </NavLink> */}
            </li>
          </>
        )}

        {/* {Object.keys(UserAccess).map((res) => {
          return <AsideparentList element={res} key={res} />;
        })} */}
      </ul>

      <div
        className="bg-light"
        style={{
          position: "fixed",
          width: "100%",
          marginTop: "45px",
          display: "flex",
        }}
      >
        <Navbar
          style={{ width: "100%" }}
          className="navbar"
          bg="light"
          expand="lg"
          variant="dark"
        >
          {/* <Navbar.Brand href="#home">MyApp</Navbar.Brand> */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown
                title="Dashboard"
                id="basic-nav-dropdown"
                className="custom-nav-dropdown"
              >
                <NavDropdown.Item href="/dashboard">Dashboard</NavDropdown.Item>
              </NavDropdown>
              {UserAccess &&
                Object.keys(UserAccess)?.map((res) => {
                  return (
                    UserAccess[res]
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .some(
                        (item) =>
                          item.isResourceShow &&
                          item?.portalType == isEmployeePortal
                      ) && (
                      <>
                        <NavDropdown
                          className="custom-nav-dropdown"
                          title={res.replace(/_/g, " ")}
                          id="basic-nav-dropdown"
                        >
                          {UserAccess[res].map((ce) => {
                            return (
                              ce.isResourceShow &&
                              ce?.portalType == isEmployeePortal && (
                                <NavDropdown.Item href={`/${ce.url}`}>
                                  {ce.name}
                                </NavDropdown.Item>
                              )
                            );
                          })}
                        </NavDropdown>
                      </>
                    )
                  );
                })}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        
      </div>
      {/* end::Menu Nav */}
    </>
  );
}

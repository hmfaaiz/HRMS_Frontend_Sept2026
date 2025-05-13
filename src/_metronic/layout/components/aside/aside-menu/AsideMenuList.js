/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import { useHistory } from "react-router-dom";
import AsideparentList from "./AsideParentList";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navigation_menu.css";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

export function AsideMenuList({ layoutProps }) {
  const history = useHistory();
  const auth = useSelector(({ auth }) => auth, shallowEqual);
  const UserAccess = auth?.userAccess;
  const user = auth?.user;
  const Settings = auth?.userAccess?.Settings;

  const [isVisible, setIsVisible] = useState(true);
  const menuRef = useRef(null);
  // Hide menu when clicked outside

  // Hide menu when it loses focus
  const handleBlur = () => {
    setIsVisible(false);
  };

  // Show menu on focus
  const handleFocus = () => {
    setIsVisible(true);
  };
  // Toggle visibility of the menu
  const toggleMenuVisibility = () => {
    setIsVisible((prevState) => !prevState);
  };

  const isDashboardAccess = Settings?.some((obj) =>
    Object.values(obj).includes("read-all-vehicles-dashboard")
  );
  const isReadALLRolesAccess = Settings?.some((obj) =>
    Object.values(obj).includes("read-all-roles-master-data")
  );

  // if (!isReadALLRolesAccess) {
  //   delete UserAccess.Settings;
  // }

  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu &&
          "menu-item-active"} menu-item-open menu-item-not-hightlighted`
      : "";
  };

  function fnHideMenu() {
    alert("0");
    const menu_css = (document.getElementById("dv_submenu").style =
      "display:none");
    //menu_css.insertRule(stl, 0);
  }

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

  const handleSwitch = () => {
    let val = localStorage.getItem("isEmployeePortal") === "true";
    localStorage.setItem("isEmployeePortal", (!val).toString());

    history.push("/dashboard"); // ✅ Navigate to /dashboard
  };
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
        {portalRoutesLength > 0 &&
          HRMSRoutesLength > 0 &&
          user?.employeeIdMapping && (
            <div>
              <span className="mr-16">
                <button
                  onClick={handleSwitch}
                  className="btn btn-light-primary font-weight-bold"
                >
                  <span className="ml-2">
                    {" "}
                    <ExitToAppIcon />{" "}
                    {isEmployeePortalStored
                      ? "Switch to HRMS"
                      : "Switch to Portal"}
                  </span>
                </button>
              </span>
            </div>
          )}
      </div>
      {/* end::Menu Nav */}
    </>
  );
}

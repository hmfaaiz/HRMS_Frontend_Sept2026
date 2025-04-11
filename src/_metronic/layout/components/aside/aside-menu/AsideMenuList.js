/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import AsideparentList from "./AsideParentList";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navigation_menu.css";

export function AsideMenuList({ layoutProps }) {
  const auth = useSelector(({ auth }) => auth, shallowEqual);
  const UserAccess = auth?.userAccess;
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

      <div style={{ position: "fixed", width: "100%", marginTop: "45px" }}>
        <Navbar className="navbar" bg="light" expand="lg" variant="dark">
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
                      .some((item) => item.isResourceShow) && (
                      <>
                        <NavDropdown
                          className="custom-nav-dropdown"
                          title={res.replace(/_/g, " ")}
                          id="basic-nav-dropdown"
                        >
                          {UserAccess[res].map((ce) => {
                            return (
                              ce.isResourceShow && (
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

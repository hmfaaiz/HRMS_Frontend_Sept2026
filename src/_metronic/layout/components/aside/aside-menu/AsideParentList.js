import React, { useEffect, useState, useMemo, useRef } from "react";
import { NavLink } from "react-router-dom";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import { useLocation } from "react-router";
import AsideMenuItem from "./AsideMenuItems";
import SVG from "react-inlinesvg";
import { shallowEqual, useSelector } from "react-redux";

export default function AsideparentList(props) {
  const auth = useSelector(({ auth }) => auth, shallowEqual);
  const UserAccess = auth?.userAccess;
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu &&
      "menu-item-active"} menu-item-open menu-item-not-hightlighted`
      : "";
  };

  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef(null);
  // Hide menu when clicked outside

  // Function to handle the blur event
  const handleBlur = (event) => {
    setIsVisible(false);
    console.log("2")

  };

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };
  
  return (
    <>
      {
        UserAccess[props.element].sort((a, b) => a.sortOrder - b.sortOrder).some(item => item.isResourceShow) && (<li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/props.element",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle"

            to={`/${props.element.replace("_", " ")}`}>
            {/* <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Box2.svg")} />
            </span> */}
            <span className="menu-text"

            > {props.element.replaceAll("_", " ")}</span>
            <i className="menu-arrow"

            />
          </NavLink>
          <div id="dvSubMenu" className="menu-submenu"
            tabIndex="0" // Makes the div focusable
            style={{ display: isVisible ? 'block' : 'none' }} // Toggle visibility
            onBlur={handleBlur}
            onClick={toggleVisibility}
          >
            <ul className="menu-subnav" style={{width:"280px"}}>
              {/* <ul className="menu-subnav"> */}

                {UserAccess[props.element].map((ce) => {
                  return <AsideMenuItem element={ce} key={ce.resourceId} />;
                })}
              {/* </ul> */}
            </ul>
          </div>
        </li>)
      }

    </>
  );
}

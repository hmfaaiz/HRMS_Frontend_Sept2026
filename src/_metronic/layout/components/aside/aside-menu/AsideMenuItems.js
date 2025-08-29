import React from "react";
import { checkIsActive } from "../../../../_helpers";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";

export default function AsideMenuItem(props) {
  // console.log("Asidemenu item", props)
  // console.log("Props Aside menu", props.element.isResourceShow)
  const {
    element: { isResourceShow },
  } = props;
  
  //console.log("isResourceShow", isResourceShow)
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu &&
      "menu-item-active"} menu-item-open menu-item-not-hightlighted`
      : "";
  };

  return (
    <>
      {isResourceShow && (
        <li
          className={`menu-item ${getMenuItemActive("/react-bootstrap/alert")}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to={`/${props.element.url}`}>
            <i className="menu-bullet menu-bullet-dot">
              <span />
            </i>
            <span className="menu-text">{props.element.name} </span>
          </NavLink>
        </li>
      )}
    </>
  );
}

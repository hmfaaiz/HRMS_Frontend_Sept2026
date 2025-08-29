import React, { useEffect } from "react"
import { NavLink } from "react-router-dom"
import { useLocation } from "react-router"
import SVG from "react-inlinesvg"
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers"
import { shallowEqual, useSelector } from "react-redux"
import { map } from "lodash"

export function UserMenuItem() {
  const user = useSelector(({ auth }) => auth, shallowEqual)

  useEffect(() => {
    return () => {}
  }, [user])

  console.log("Auth User", user)
  const location = useLocation()
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu &&
          "menu-item-active"} menu-item-open menu-item-not-hightlighted`
      : ""
  }
  return (
    <li
      className={`menu-item menu-item-submenu ${getMenuItemActive(
        "/google-material",
        true
      )}`}
      aria-haspopup="true"
      data-menu-toggle="hover"
    >
      <NavLink className="menu-link menu-toggle" to="/google-material">
        <span className="svg-icon menu-icon">
          <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Cap-2.svg")} />
        </span>
        <span className="menu-text">User Managment</span>
        <i className="menu-arrow" />
      </NavLink>
      <div className="menu-submenu ">
        <i className="menu-arrow" />
        <ul className="menu-subnav">
          <li className="menu-item  menu-item-parent" aria-haspopup="true">
            <span className="menu-link">
              <span className="menu-text">Material UI</span>
            </span>
          </li>

          {/* Inputs */}
          {/*begin::2 Level*/}
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/google-material/inputs",
              true
            )}`}
            aria-haspopup="true"
            data-menu-toggle="hover"
          >
            <NavLink
              className="menu-link menu-toggle"
              to="/google-material/inputs"
            >
              <i className="menu-bullet menu-bullet-dot">
                <span />
              </i>
              <span className="menu-text">Resource</span>
              <i className="menu-arrow" />
            </NavLink>
            <div className="menu-submenu ">
              <i className="menu-arrow" />
              <ul className="menu-subnav">
                {/*begin::3 Level*/}
                {/* {userAccess.map((e) => (
                  <li
                    className={`menu-item  ${getMenuItemActive(
                      "/google-material/inputs/autocomplete"
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to={e.slug}>
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">{e.name}</span>
                    </NavLink>
                  </li>
                ))} */}

                {/*end::3 Level*/}
              </ul>
            </div>
          </li>
          {/*end::2 Level*/}
        </ul>
      </div>
    </li>
  )
}

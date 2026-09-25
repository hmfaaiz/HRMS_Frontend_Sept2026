/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo } from "react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { useSelector, shallowEqual } from "react-redux"
import objectPath from "object-path"
import { useHtmlClassService } from "../../_core/MetronicLayout"
import { UserProfileDropdown } from "./dropdowns/UserProfileDropdown"

export function QuickUserToggler({ isCollapsed }) {
  const { user } = useSelector((state) => state.auth, shallowEqual)
  const uiService = useHtmlClassService()
  const layoutProps = useMemo(() => {
    return {
      offcanvas:
        objectPath.get(uiService.config, "extras.user.layout") === "offcanvas",
    }
  }, [uiService])

  return (
    <>
      {layoutProps.offcanvas && (
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="quick-user-tooltip">View</Tooltip>}
        >
          <div className={`sidebar-link w-full ${isCollapsed ? "justify-center px-0" : ""}`}
               style={{ minHeight: 36, padding: isCollapsed ? "7px 0" : "7px 10px", gap: 10 }}
               id="kt_quick_user_toggle"
          >
            <>
              <span className="symbol symbol-35 symbol-light-success flex-shrink-0">
                <span className="symbol-label font-size-h5 font-weight-bold">
                  {user.fullname[0]}
                </span>
              </span>
              {!isCollapsed && (
                <>
                  <span className="text-white font-normal d-none d-md-inline" style={{ fontSize: "11.25px", fontWeight: 500 }}>
                    Hi,
                  </span>
                  <span className="text-white font-weight-bolder d-none d-md-inline" style={{ fontSize: "11.25px", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.fullname}
                  </span>
                </>
              )}
            </>
          </div>
        </OverlayTrigger>
      )}

      {!layoutProps.offcanvas && <UserProfileDropdown isCollapsed={isCollapsed} />}
    </>
  )
}

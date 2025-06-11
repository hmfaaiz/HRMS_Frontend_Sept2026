import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import objectPath from "object-path";
import { useHtmlClassService } from "../../../_core/MetronicLayout";
import { toAbsoluteUrl } from "../../../../_helpers";
import { DropdownTopbarItemToggler } from "../../../../_partials/dropdowns";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";

export function UserProfileDropdown() {
  const history = useHistory();
  const auth = useSelector(({ auth }) => auth, shallowEqual);
  const UserAccess = auth?.userAccess;
  const user = auth?.user;

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

  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      light:
        objectPath.get(uiService.config, "extras.user.dropdown.style") ===
        "light",
    };
  }, [uiService]);

  return (
    <Dropdown drop="down" alignRight>
      <Dropdown.Toggle
        as={DropdownTopbarItemToggler}
        id="dropdown-toggle-user-profile"
      >
        <div className={"w-auto d-flex align-items-center btn-lg px-2"}>
          <span className="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">
            Hi,
          </span>{" "}
          <span className="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3">
            {user?.EmployeeMapping?.fullName
              ? user?.EmployeeMapping?.fullName
              : user?.email}
            {" - "}({user?.role?.name})
          </span>
          <span className="symbol symbol-45 symbol-light-success rounded-circle overflow-hidden">
            <span>
              <img
                width={36}
                height={36}
                src={
                  user?.EmployeeMapping?.profile_image
                    ? user?.EmployeeMapping?.profile_image
                    : "/media/users/user.svg"
                }
                alt="User"
              />
            </span>
          </span>
          {portalRoutesLength > 0 &&
            HRMSRoutesLength > 0 &&
            user?.employeeIdMapping && (
              <span>
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="products-edit-tooltip">
                      Switch Application
                    </Tooltip>
                  }
                >
                  <button
                    onClick={handleSwitch}
                    className="btn"
                    style={{ border: "none" }}
                  >
                    <img
                      width={36}
                      height={36}
                      src={toAbsoluteUrl(
                        "/media/users/Profile-Switch-Icon.png"
                      )}
                      alt="User"
                    />
                  </button>
                </OverlayTrigger>
              </span>
            )}
          <span className="ml-3">
            <Link
              to="/password/reset-password"
              className="btn btn-light-primary font-weight-bold"
            >
              <LockOpenIcon />
              <span className="ml-3">Reset Password</span>
            </Link>
          </span>
          <span className="ml-3">
            <Link
              to="/logout"
              className="btn btn-light-primary font-weight-bold"
            >
              <ExitToAppIcon />
              <span className="ml-3">Sign Out</span>
            </Link>
          </span>
        </div>
      </Dropdown.Toggle>
    </Dropdown>
  );
}

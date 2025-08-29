import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import objectPath from "object-path";
import { useHtmlClassService } from "../../../_core/MetronicLayout";
import { toAbsoluteUrl } from "../../../../_helpers";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { ArrowLeftRight, ChevronDown } from "lucide-react";

export function UserProfileDropdown() {
  const history = useHistory();
  const dropdownRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

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
    history.push("/dashboard");
    setIsOpen(false);
  };

  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      light:
        objectPath.get(uiService.config, "extras.user.dropdown.style") ===
        "light",
    };
  }, [uiService]);

  // 🔽 Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative text-white" ref={dropdownRef}>
      <div
        className="flex items-center gap-2 py-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="hidden md:inline text-sm">Hi,</span>
        <span className="hidden md:inline font-bold text-sm">
          {user?.EmployeeMapping?.fullName || user?.email}
        </span>
        <span className="hidden md:inline text-sm">({user?.role?.name})</span>
        <div className="w-10 h-10 overflow-hidden rounded-md border-none">
          <img
            src={
              user?.EmployeeMapping?.profile_image
                ? user?.EmployeeMapping?.profile_image
                : "/media/users/user.svg"
            }
            alt="User"
            className="w-full h-full object-cover bg-primary"
          />
        </div>
        <ChevronDown className="w-4 h-4" />
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-md shadow-lg z-50">
          <div className="py-2 text-sm">
            {portalRoutesLength > 0 &&
              HRMSRoutesLength > 0 &&
              user?.employeeIdMapping && (
                <button
                  onClick={handleSwitch}
                  className="w-full flex items-center border-none px-4 py-2 bg-transparent hover:text-[#0093dd]"
                >
                  <ArrowLeftRight className="w-4 h-4 mr-2" />
                  Switch Application
                </button>
              )}

            <Link
              to="/password/reset-password"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center px-4 py-2 hover:bg-gray-100"
            >
              <LockOpenIcon fontSize="small" className="mr-2" />
              Reset Password
            </Link>

            <Link
              to="/logout"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center px-4 py-2 hover:bg-gray-100"
            >
              <ExitToAppIcon fontSize="small" className="mr-2" />
              Sign Out
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

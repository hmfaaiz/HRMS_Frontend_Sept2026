import React, { useMemo, useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Link, useHistory } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import objectPath from "object-path";
import { useHtmlClassService } from "../../../_core/MetronicLayout";
import { toAbsoluteUrl } from "../../../../_helpers";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { ArrowLeftRight, ChevronUp } from "lucide-react";

const SIDEBAR_EXPANDED_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 64;

export function UserProfileDropdown({ isCollapsed }) {
  const history = useHistory();
  const dropdownRef = useRef();
  const portalRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ bottom: 0, left: 0 });

  const auth = useSelector(({ auth }) => auth, shallowEqual);
  const UserAccess = auth?.userAccess;
  const user = auth?.user;

  const res = Object.values(UserAccess || {}).flatMap((items) => items);
  const portalRoutesLength = res.filter(
    (e) => e?.isResourceShow && e.portalType === 2
  ).length;
  const HRMSRoutesLength = res.filter(
    (e) => e?.isResourceShow && e.portalType === 1
  ).length;

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

  const toggleOpen = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const left = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH + 8 : SIDEBAR_EXPANDED_WIDTH + 8;
      const bottom = window.innerHeight - rect.bottom;
      setMenuPos({ bottom, left });
    }
    setIsOpen((prev) => !prev);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      const inTrigger = dropdownRef.current && dropdownRef.current.contains(event.target);
      const inPortal = portalRef.current && portalRef.current.contains(event.target);
      if (!inTrigger && !inPortal) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative text-white w-full ${isCollapsed ? "flex justify-center" : ""}`} ref={dropdownRef}>
      <div
        className={`flex items-center w-full cursor-pointer hover:bg-black/10 transition-colors rounded-lg ${isCollapsed ? 'p-1 justify-center' : 'p-2'}`}
        onClick={toggleOpen}
      >
        <div className="w-10 h-10 flex-shrink-0 overflow-hidden rounded-md border-none">
          <img
            src={
              user?.EmployeeMapping?.profile_image
                ? user?.EmployeeMapping?.profile_image
                : "/media/users/user.svg"
            }
            alt="User"
            className="w-full h-full object-cover bg-primary"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = toAbsoluteUrl("/media/users/profileImage.png");
            }}
          />
        </div>
        {!isCollapsed && (
          <>
            <div className="flex flex-col flex-1 overflow-hidden px-3 text-left">
              <span className="text-sm font-bold truncate text-white">
                Hi, {user?.EmployeeMapping?.fullName || user?.email}
              </span>
              <span className="text-xs text-white/70 truncate">
                {user?.role?.name || "User"}
              </span>
            </div>
            <ChevronUp className="w-4 h-4 text-white/70 flex-shrink-0 ml-1" />
          </>
        )}
      </div>

      {isOpen &&
        ReactDOM.createPortal(
          <div
            ref={portalRef}
            className="fixed bg-white text-black rounded-lg shadow-xl z-[999999] min-w-[220px] py-2 text-sm border border-gray-100"
            style={{
              bottom: `${menuPos.bottom}px`,
              left: `${menuPos.left}px`,
            }}
          >
            {portalRoutesLength > 0 &&
              HRMSRoutesLength > 0 &&
              user?.employeeIdMapping && (
                <button
                  onClick={handleSwitch}
                  className="w-full flex items-center border-none px-4 py-2.5 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-[#0093dd] transition-colors cursor-pointer text-left font-medium"
                >
                  <ArrowLeftRight className="w-4 h-4 mr-2.5 text-gray-500" />
                  Switch Application
                </button>
              )}

            <Link
              to="/password/reset-password"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center px-4 py-2.5 hover:bg-gray-100 text-gray-700 hover:text-[#0093dd] transition-colors font-medium text-decoration-none"
            >
              <LockOpenIcon fontSize="small" className="mr-2.5 text-gray-500" />
              Change Password
            </Link>

            <Link
              to="/logout"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center px-4 py-2.5 hover:bg-gray-100 text-red-600 transition-colors font-medium text-decoration-none"
            >
              <ExitToAppIcon fontSize="small" className="mr-2.5 text-red-500" />
              Sign Out
            </Link>
          </div>,
          document.body
        )}
    </div>
  );
}

/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, LayoutDashboard } from "lucide-react";
import { useLocation } from "react-router";
import { checkIsActive } from "../../../../_helpers";
import { shallowEqual, useSelector } from "react-redux";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./navigation_menu.css";
import { Header } from "../../header/Header";
import { Link } from "react-router-dom";
export function AsideMenuList({ layoutProps }) {
  const auth = useSelector(({ auth }) => auth, shallowEqual);
  const UserAccess = auth?.userAccess;
  const menu= auth?.menu;

  const user = auth?.user;
  const Settings = auth?.userAccess?.Settings;
 
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef(null);
  const dropdownContainerRef = useRef(null);
  // Hide menu when clicked outside

  const [dropdownOpen, setDropdownOpen] = useState(null);

  const handleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
    closeSubMenu()
  };

  // Toggle visibility of the menu
  const toggleMenuVisibility = () => {
    setIsVisible((prevState) => !prevState);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target)
      ) {
        setDropdownOpen(null);
      }
    }
    if (dropdownOpen !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

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


const [openSubMenu, setOpenSubMenu] = useState({});

const toggleSubMenu = (parentKey, childHeading) => {
  setOpenSubMenu((prev) => ({
    ...prev,
    [parentKey]: {
      // Close all siblings under the same parent except the clicked one
      [childHeading]: !prev[parentKey]?.[childHeading],
    },
  }));
};
const closeSubMenu = (parentKey, childHeading) => {

 setOpenSubMenu({})
};


  return (
    <div style={{ zIndex: "999" }} className="sticky top-0 w-full bg-[#0093dd]">
      <Header
        isEmployeePortal={isEmployeePortal}
        company={user?.Company}
        toggleMenuVisibility={toggleMenuVisibility}
      />
      {isEmployeePortal === "1" && (
        <div
          className="w-full flex container-fluid"
          style={{ display: "flex", width: "100%" }}
          ref={dropdownContainerRef}
        >
          <nav className="w-full flex items-center justify-between py-1">
            <div className="flex-1">
              <div
                className={`lg:flex ${isVisible ? "block" : "hidden"} w-full`}
              >
                <ul className="flex flex-col items-start lg:items-end lg:flex-row lg:space-x-6 list-none mb-1">
                  <li className="relative group">
                    <Link
                      className="px-3 py-2 font-bold bg-tprimarydark flex justify-center items-center text-white text-sm rounded-xl"
                      to="/dashboard"
                    >
                      <LayoutDashboard className="w-4 h-4 stroke-2 rounded-md inline-block text-white" />
                      <span className="ml-2">Dashboard</span>
                    </Link>
                  </li>
                </ul>
                {/* <ul className="flex flex-col justify-start items-start lg:items-end lg:justify-end w-full text-sm lg:flex-row lg:space-x-6 list-none mb-1">
                  {UserAccess &&
                    Object.keys(UserAccess)?.map((res, idx) => {
                      const hasVisible = UserAccess[res]
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .some(
                          (item) =>
                            item.isResourceShow && item?.portalType == "1"
                        );
                      if (!hasVisible) return null;
                      return (
                        <li className="relative group" key={res}>
                          <button
                            className="p-0 bg-transparent border-none font-bold text-white focus:outline-none capitalize flex items-center"
                            onClick={() => handleDropdown(idx)}
                          >
                            {res.replace(/_/g, " ")}
                            <ChevronDown
                              className={`ml-1 w-4 h-4 stroke-2 transition-transform duration-200 ${
                                dropdownOpen === idx ? "rotate-180" : "rotate-0"
                              }`}
                            />
                          </button>
                       
                          <div
                            className={`absolute right-0 mt-3 min-w-56 bg-white border rounded shadow-lg transition z-50 ${
                              dropdownOpen === idx ? "block" : "hidden"
                            }`}
                          >
                            {UserAccess[res].map((ce) =>
                              ce.isResourceShow &&
                              ce?.portalType == isEmployeePortal ? (
                                <a
                                  key={ce.url}
                                  href={`/${ce.url}`}
                                  className="block px-4 py-2 hover:bg-gray-100"
                                >
                                  {ce.name}
                                </a>
                              ) : null
                            )}






                          </div>
                        </li>
                      );
                    })}
                </ul> */}



{/* child sorting issue  */}

 {/* <ul className="flex flex-col justify-start items-start lg:items-end lg:justify-start lg:p-2 w-full text-sm lg:flex-row lg:space-x-6 list-none mb-1 bg-red-500 ">
  {menu &&
    Object.keys(menu).map((parentKey, idx) => {
      const parentItems = menu[parentKey];

      const hasVisible = Object.values(parentItems).some((childGroup) =>
        childGroup.some((item) => item.isResourceShow && item?.portalType == 1)
      );
      if (!hasVisible) return null;

      return (
        <li className="relative" key={parentKey}>
          <button
            className="p-0 bg-transparent border-none font-bold text-white focus:outline-none capitalize flex items-center"
            onClick={() => handleDropdown(idx)}
          >
            {parentKey.replace(/_/g, " ")}
            <ChevronDown
              className={`ml-1 w-4 h-4 stroke-2 transition-transform duration-200 ${
                dropdownOpen === idx ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

     
          <div
            className={`absolute left-0 mt-3 min-w-56 bg-white border rounded shadow-lg transition z-50 ${
              dropdownOpen === idx ? "block" : "hidden"
            }`}
          >
            {Object.keys(parentItems)
              .sort()
              .map((childHeading) => {
                const visibleItems = parentItems[childHeading].filter(
                  (item) => item.isResourceShow && item?.portalType == Number(isEmployeePortal)
                );
                if (visibleItems.length === 0) return null;

                const hasChild = visibleItems.length > 0;

                return (
                  <div key={childHeading} className="relative">
                 
                    <div
                      className="px-4 py-2 font-semibold text-gray-700 uppercase text-xs cursor-pointer flex justify-between items-center"
                      onClick={() => toggleSubMenu(parentKey, childHeading)}
                    >
                      {childHeading.replace(/_/g, " ")}
                      {hasChild && (
          
                        <ChevronRight className="h-3 w-3"/> 
                      )}
                    </div>

                    {hasChild && openSubMenu[parentKey]?.[childHeading] && (
                      <div className="absolute top-0 left-full mt-0 min-w-56 bg-white border rounded shadow-lg">
                        {visibleItems
                          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                          .map((item) => (
                            <a
                              key={item.url}
                              href={`/${item.url}`}
                              className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
                            >
                              {item.name}
                            </a>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </li>
      );
    })}
</ul> */}


<ul className="flex flex-col justify-start items-start lg:items-end lg:justify-start lg:p-2 w-full text-sm lg:flex-row lg:space-x-6 list-none mb-1 ">
  {menu &&
    Object.keys(menu).map((parentKey, idx) => {
      const parentItems = menu[parentKey];

      const hasVisible = Object.values(parentItems).some((childGroup) =>
        childGroup.some((item) => item.isResourceShow && item?.portalType == 1)
      );
      if (!hasVisible) return null;

      return (
        <li className="relative" key={parentKey}>
          <button
            className="p-0 bg-transparent border-none font-bold text-white focus:outline-none capitalize flex items-center"
            // onClick={() => handleDropdown(idx)}
               onMouseEnter={() => handleDropdown(idx)}
          >
            {parentKey.replace(/_/g, " ")}
            <ChevronDown
              className={`ml-1 w-4 h-4 stroke-2 transition-transform duration-200 ${
                dropdownOpen === idx ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

     
          <div
            className={`absolute left-0 mt-3 min-w-56 bg-white border rounded shadow-lg transition z-50 ${
              dropdownOpen === idx ? "block" : "hidden"
            }`}
          >
            {Object.keys(parentItems)
              .map((childHeading) => {
                const visibleItems = parentItems[childHeading].filter(
                  (item) => item.isResourceShow && item?.portalType == Number(isEmployeePortal)
                );
                if (visibleItems.length === 0) return null;

                const hasChild = visibleItems.length > 0;

                return (
                  <div key={childHeading} className="relative">
                 
                    <div
                      className="px-4 py-2 font-semibold text-gray-700 uppercase text-xs cursor-pointer flex justify-between items-center"
                      // onClick={() => toggleSubMenu(parentKey, childHeading)}

                      onMouseEnter={() => toggleSubMenu(parentKey, childHeading, true)}
                      // onMouseLeave={() => toggleSubMenu(parentKey, childHeading, false)}
                      >
                      {childHeading.replace(/_/g, " ")}
                      {hasChild && (
          
                        <ChevronRight className="h-3 w-3"/> 
                      )}
                    </div>

                    {hasChild && openSubMenu[parentKey]?.[childHeading] && (
                      <div className="absolute top-0 left-full mt-0 min-w-56 bg-white border rounded shadow-lg">
                        {visibleItems
                          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                          .map((item) => (
                            <a
                              key={item.url}
                              href={`/${item.url}`}
                              className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
                            >
                              {item.name}
                            </a>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </li>
      );
    })}
</ul>



                
              </div>
            </div>
          </nav>
        </div>
      )}
      {/* end::Menu Nav */}
    </div>
  );
}

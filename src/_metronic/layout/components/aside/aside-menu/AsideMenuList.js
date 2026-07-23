/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, LayoutDashboard, ChevronLeft, ChevronRight as ChevronRightIcon, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useLocation } from "react-router";
import { checkIsActive } from "../../../../_helpers";
import { shallowEqual, useSelector } from "react-redux";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./navigation_menu.css";
import { Header } from "../../header/Header";
import { Link } from "react-router-dom";
import ReactDOM from 'react-dom';

export function AsideMenuList({ layoutProps }) {
  const auth = useSelector(({ auth }) => auth, shallowEqual);
  const UserAccess = auth?.userAccess;
  const menu = auth?.menu;

  const user = auth?.user;
  const Settings = auth?.userAccess?.Settings;

  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef(null);
  const dropdownContainerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // State for scroll position
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [itemWidth, setItemWidth] = useState(0);

  // Hide menu when clicked outside
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownPortalRef = useRef(null);
  const subMenuPortalRef = useRef(null);

  const handleDropdown = (index, event) => {
    if (event && event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
    setDropdownOpen(dropdownOpen === index ? null : index);
    closeSubMenu()
  };

  // Toggle visibility of the menu
  const toggleMenuVisibility = () => {
    setIsVisible((prevState) => !prevState);
  };

  // Check scroll position and update arrow visibility
  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Calculate item width
  const calculateItemWidth = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const firstItem = container.querySelector('.menu-item');
      if (firstItem) {
        const width = firstItem.offsetWidth + 24; // width + gap (space-x-6 = 24px)
        setItemWidth(width);
      }
    }
  };

  // Scroll functions - scroll by 8 items
  const scrollLeft = () => {
    if (scrollContainerRef.current && itemWidth > 0) {
      scrollContainerRef.current.scrollBy({ left: -(itemWidth * 8), behavior: 'smooth' });
    } else {
      scrollContainerRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current && itemWidth > 0) {
      scrollContainerRef.current.scrollBy({ left: itemWidth * 8, behavior: 'smooth' });
    } else {
      scrollContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateScrollButtons);
      setTimeout(() => {
        updateScrollButtons();
        calculateItemWidth();
      }, 100);
      window.addEventListener('resize', () => {
        updateScrollButtons();
        calculateItemWidth();
      });

      return () => {
        scrollContainer.removeEventListener('scroll', updateScrollButtons);
        window.removeEventListener('resize', updateScrollButtons);
      };
    }
  }, [menu]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      const clickedInsideMain = dropdownContainerRef.current &&
        dropdownContainerRef.current.contains(event.target);
      const clickedInsideDropdownPortal = dropdownPortalRef.current &&
        dropdownPortalRef.current.contains(event.target);
      const clickedInsideSubMenuPortal = subMenuPortalRef.current &&
        subMenuPortalRef.current.contains(event.target);

      if (!clickedInsideMain && !clickedInsideDropdownPortal && !clickedInsideSubMenuPortal) {
        setDropdownOpen(null);
        setOpenSubMenu({});
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
  const [subMenuPosition, setSubMenuPosition] = useState({ top: 0, left: 0 });

  const toggleSubMenu = (parentKey, childHeading, event) => {
    if (event && event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      setSubMenuPosition({
        top: rect.top + window.scrollY,
        left: rect.right + window.scrollX + 5
      });
    }
    setOpenSubMenu((prev) => {
      // Close all other submenus
      const newState = {};
      // If clicking the same item, toggle it
      if (prev[parentKey]?.[childHeading]) {
        return {};
      }
      // Open the clicked submenu
      return {
        [parentKey]: {
          [childHeading]: true
        }
      };
    });
  };

  const closeSubMenu = () => {
    setOpenSubMenu({});
  };

  // Update scroll buttons when menu changes
  useEffect(() => {
    setTimeout(() => {
      updateScrollButtons();
      calculateItemWidth();
    }, 200);
  }, [menu, isEmployeePortal, isVisible]);

  // Get visible menu items
  const getVisibleMenuItems = () => {
    if (!menu) return [];
    const visibleItems = [];
    Object.keys(menu).forEach((parentKey) => {
      const parentItems = menu[parentKey];
      const hasVisible = Object.values(parentItems).some((childGroup) =>
        childGroup.some((item) => item.isResourceShow && item?.portalType == 1)
      );
      if (hasVisible) {
        visibleItems.push(parentKey);
      }
    });
    return visibleItems;
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
          style={{ display: "flex", width: "100%", position: "relative" }}
          ref={dropdownContainerRef}
        >
          <nav className="w-full flex items-center py-1 px-2" style={{ position: 'relative' }}>

            <div className="flex-shrink-0 mr-4" style={{ flexShrink: 0 }}>
              <a
                className="px-3 py-2 font-bold bg-tprimarydark flex justify-center items-center text-white text-sm rounded-xl whitespace-nowrap"
                href="/dashboard"
              >
                <LayoutDashboard className="w-4 h-4 stroke-2 rounded-md inline-block text-white" />
                <span className="ml-2">Dashboard</span>
              </a>
            </div>

            <div className="flex items-center w-full" style={{ position: 'relative' }}>
              {/* Left Arrow */}
              {canScrollLeft && (
                <button
                  onClick={scrollLeft}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-30 bg-white hover:bg-gray-100 rounded-full shadow-lg p-1 ml-1 transition-all duration-200"
                  style={{
                    width: '25px',
                    height: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e5e7eb',
                    marginRight: '8px' // Right side margin
                  }}
                >
                  <ChevronsLeft size={16} className="w-4 h-4 text-gray-700" />
                </button>
              )}

              {/* Scrollable Menu Items */}
              <div
                className="overflow-x-auto scroll-smooth ml-1"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  paddingLeft: canScrollLeft ? '45px' : '0', // Increased from 35px to 45px
                  paddingRight: canScrollRight ? '45px' : '0', // Increased from 35px to 45px
                  overflowY: 'visible',
                  width: itemWidth > 0 ? `${itemWidth * 8}px` : 'auto',
                  maxWidth: '100%',
                  flex: '0 0 auto'
                }}
                ref={scrollContainerRef}
              >
                <style>{`
                  .menu-scroll-container::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>

                <ul className="flex flex-row items-center space-x-6 list-none mb-1 whitespace-nowrap" style={{ overflow: 'visible' }}>
                  {menu &&
                    Object.keys(menu).map((parentKey, idx) => {
                      const parentItems = menu[parentKey];

                      const hasVisible = Object.values(parentItems).some((childGroup) =>
                        childGroup.some((item) => item.isResourceShow && item?.portalType == 1)
                      );
                      if (!hasVisible) return null;

                      return (
                        <li className="relative menu-item" key={parentKey} style={{ position: 'relative', flexShrink: 0 }}>
                          <button
                            className="p-0 bg-transparent border-none font-bold text-white focus:outline-none capitalize flex items-center whitespace-nowrap hover:text-gray-200 transition-colors text-sm"
                            onClick={(e) => handleDropdown(idx, e)}
                            onMouseEnter={(e) => handleDropdown(idx, e)}
                          >
                            {parentKey.replace(/_/g, " ")}
                            <ChevronDown
                              className={`ml-1 w-4 h-4 stroke-2 transition-transform duration-200 ${dropdownOpen === idx ? "rotate-180" : "rotate-0"
                                }`}
                            />
                          </button>
                        </li>
                      );
                    })}
                </ul>

                {canScrollRight && (
                  <button
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-30 bg-white hover:bg-gray-100 rounded-full shadow-lg p-1 mr-1 transition-all duration-200"
                    style={{
                      width: '25px',
                      height: '25px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <ChevronsRight size={16} className="w-4 h-4 text-gray-700" />
                  </button>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* Dropdown Portal - Rendered outside the overflow container */}
      {dropdownOpen !== null && menu && Object.keys(menu).map((parentKey, idx) => {
        if (idx !== dropdownOpen) return null;
        const parentItems = menu[parentKey];

        return ReactDOM.createPortal(
          <div
            ref={dropdownPortalRef}
            className="bg-white border rounded shadow-lg"
            style={{
              position: 'fixed',
              top: dropdownPosition.top + 'px',
              left: dropdownPosition.left + 'px',
              zIndex: 99999,
              minWidth: '200px',
            }}
            onMouseLeave={() => {
              setTimeout(() => {
                if (!document.querySelector('.sub-menu-open')) {
                  setOpenSubMenu({});
                }
              }, 200);
            }}
          >
            {Object.keys(parentItems)
              .map((childHeading) => {
                const visibleItems = [...parentItems[childHeading]].filter(
                  (item) => item.isResourceShow && item?.portalType == Number(isEmployeePortal)
                );

                if (visibleItems.length === 0) return null;

                const hasChild = visibleItems.length > 0;

                return (
                  <div key={childHeading} className="relative" style={{ position: 'relative' }}>
                    <div
                      className="px-4 py-2 font-semibold text-gray-700 uppercase text-xs cursor-pointer flex justify-between items-center hover:bg-gray-50"
                      onClick={(e) => {
                        if (hasChild) {
                          toggleSubMenu(parentKey, childHeading, e);
                        }
                      }}
                      onMouseEnter={(e) => {
                        if (hasChild) {
                          toggleSubMenu(parentKey, childHeading, e);
                        }
                      }}
                    >
                      <span>{childHeading.replace(/_/g, " ")}</span>
                      {hasChild && (
                        <ChevronRight className="h-3 w-3 ml-2" />
                      )}
                    </div>
                  </div>
                );
              })}
          </div>,
          document.body
        );
      })}

      {/* Sub-menu Portal */}
      {openSubMenu && Object.keys(openSubMenu).map((parentKey) => {
        return Object.keys(openSubMenu[parentKey]).map((childHeading) => {
          if (!openSubMenu[parentKey][childHeading]) return null;

          const parentItems = menu[parentKey];
          const visibleItems = parentItems[childHeading].filter(
            (item) => item.isResourceShow && item?.portalType == Number(isEmployeePortal)
          );

          if (visibleItems.length === 0) return null;

          return ReactDOM.createPortal(
            <div
              ref={subMenuPortalRef}
              className="bg-white border rounded shadow-lg sub-menu-open"
              style={{
                position: 'fixed',
                top: subMenuPosition.top + 'px',
                left: subMenuPosition.left + 'px',
                zIndex: 999999,
                minWidth: '200px',
              }}
              onMouseLeave={() => {
                setTimeout(() => setOpenSubMenu({}), 150);
              }}
            >
              {visibleItems
                .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                .map((item) => (
                  <a
                    key={item.url}
                    href={`/${item.url}`}
                    className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap text-sm"
                  >
                    {item.name}
                  </a>
                ))}
            </div>,
            document.body
          );
        });
      })}
      {/* end::Menu Nav */}
    </div>
  );
}
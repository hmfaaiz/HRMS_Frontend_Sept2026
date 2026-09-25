/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  LayoutDashboard,
  ChevronRight,
  ChevronLeft,
  CalendarDays,
  Palmtree,
  Banknote,
  Plane,
  Receipt,
  BriefcaseBusiness,
  TrendingUpDown,
  UserRoundX,
  HeartHandshake,
  PanelsTopLeft,
  FolderCheck,
  Settings,
  Users,
  FileText,
  Layers,
  ChevronDown,
  ChevronUp,
  Building2,
  UserCheck,
  ClipboardList,
  BarChart3,
  Shield,
  Package,
  Truck,
  DollarSign,
  Target,
  BookOpen,
  Wrench,
  NotebookTabs,
  Luggage,
  BanknoteArrowUp,
  Minus,
  SquareArrowOutUpRight,
  CircleArrowOutUpRight,
  CircleArrowOutUpLeft,
} from "lucide-react";
import { useLocation } from "react-router";
import { checkIsActive } from "../../../../_helpers";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import * as dashboardActions from "../../../../../app/modules/Dashboard/_redux/dashboardActions";
import "./navigation_menu.css";
import { Header } from "../../header/Header";
import { Topbar } from "../../header/Topbar";
import ReactDOM from "react-dom";

// Icon map for dynamic menu parent keys from backend
const ICON_MAP = {
  // Attendance
  Attendance: CalendarDays,
  "Attendance Management": CalendarDays,
  // Leave
  Leave: Palmtree,
  // Payroll
  Payroll: Banknote,
  // Travel
  Travel: Plane,
  // Reimbursement
  Reimbursement: Receipt,
  "Reimbursement Claim": Receipt,
  // Recruitment
  Recruitment: BriefcaseBusiness,
  "Job Requisition Vacancy": BriefcaseBusiness,
  "Interview Recommendations": BriefcaseBusiness,
  // Appraisal
  Appraisal: TrendingUpDown,
  "Appraisal Evaluation": TrendingUpDown,
  // Separation / Resignation
  Resignation: UserRoundX,
  Separation: UserRoundX,
  // Help Desk
  "Help Desk": HeartHandshake,
  Task: HeartHandshake,
  // Project Management
  "Project Management": PanelsTopLeft,
  // Documents
  Documents: FolderCheck,
  "Company Documents": FolderCheck,
  company_doc_portal: FolderCheck,
  // Budget
  "Manpower Budget": BanknoteArrowUp,
  Budget: BanknoteArrowUp,
  // Employee
  Employee: Users,
  "Employee Task": ClipboardList,
  // Settings
  Settings: Settings,
  // Roster
  Roster: NotebookTabs,
  "Attendance Roster": NotebookTabs,
  // Loan
  Loan: DollarSign,
  // Reports
  Reports: BarChart3,
  // Compliance
  Compliance: Shield,
  // Inventory
  Inventory: Package,
  // Logistics
  Logistics: Truck,
  // Goals
  Goals: Target,
  // Training
  Training: BookOpen,
  // Maintenance
  Maintenance: Wrench,
  // Organization
  Organization: Building2,
  // Fleet
  Fleet: Truck,
};

const getIcon = (key) => {
  // Direct match first
  if (ICON_MAP[key]) return ICON_MAP[key];
  // Case-insensitive partial match
  const lower = key.toLowerCase();
  for (const [mapKey, Icon] of Object.entries(ICON_MAP)) {
    if (lower.includes(mapKey.toLowerCase()) || mapKey.toLowerCase().includes(lower)) {
      return Icon;
    }
  }
  return Layers; // fallback
};

const SIDEBAR_EXPANDED_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 64;

export function AsideMenuList({ layoutProps }) {
  const auth = useSelector(({ auth }) => auth, shallowEqual);
  const UserAccess = auth?.userAccess;
  const menu = auth?.menu;
  const user = auth?.user;
  const Settings_access = auth?.userAccess?.Settings;

  const [isBelowLg, setIsBelowLg] = useState(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );
  const [userCollapsed, setUserCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const small = window.innerWidth < 1024;
      setIsBelowLg(small);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isCollapsed = isBelowLg || userCollapsed;

  // Fly-out dropdown state (which parent is open)
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownPortalRef = useRef(null);
  const sidebarRef = useRef(null);

  // Sub-menu fly-out state
  const [openSubMenu, setOpenSubMenu] = useState({});
  const [subMenuPosition, setSubMenuPosition] = useState({ top: 0, left: 0 });
  const subMenuPortalRef = useRef(null);

  // Shared close timer ref — cancelled whenever any hover begins
  const closeTimerRef = useRef(null);
  const isMouseInFlyout = useRef(false);
  const isMouseInSubMenu = useRef(false);

  const cancelCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = (delay = 120) => {
    cancelCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      if (!isMouseInFlyout.current && !isMouseInSubMenu.current) {
        setDropdownOpen(null);
        setOpenSubMenu({});
      }
    }, delay);
  };

  const location = useLocation();

  // Portal/access logic (unchanged from original)
  const res = Object.values(UserAccess || {}).flatMap((items) =>
    Array.isArray(items) ? items : []
  );
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
      : portalRoutesLength > 0
        ? "2"
        : "1";

  const isDashboardAccess = Settings_access?.some((obj) =>
    Object.values(obj).includes("read-all-vehicles-dashboard")
  );

  const isAIChatbotPage = window.location.pathname.includes("/ask/ai-chatbot");

  const dispatch = useDispatch();

  // Portal 2 menu items matching Associated Modules ordering and logic
  const moduleRights = useSelector((state) => state?.dashboard?.moduleRights, shallowEqual);
  const portalInfo = useSelector((state) => state?.dashboard?.portalInfo, shallowEqual);

  useEffect(() => {
    if (isEmployeePortal === "2") {
      if (!moduleRights || moduleRights.length === 0) {
        dispatch(dashboardActions.fetchModuleRights());
      }
      if (!portalInfo) {
        dispatch(dashboardActions.getEmployeePortalInfo(() => { }, "1"));
      }
    }
  }, [dispatch, isEmployeePortal, moduleRights, portalInfo]);

  const employeeProfileWorkflowItem = UserAccess?.["Employee"]?.find(
    (el) => el?.componentName === "ReadAllEmployeeProfileWorkflow" && el?.isResourceShow && el?.portalType == 2
  );
  const attendanceRequest = UserAccess?.["Attendance"]?.find(
    (el) => el?.componentName === "ReadAllAttendanceRequest" && el?.isResourceShow && el?.portalType == 2
  );
  const leaveRequest = UserAccess?.["Leave"]?.find(
    (el) => el?.componentName === "ReadAllLeaveRequest" && el?.isResourceShow && el?.portalType == 2
  );
  const loanRequest = UserAccess?.["Payroll"]?.find(
    (el) => el?.componentName === "ReadAllLoanRequest" && el?.isResourceShow && el?.portalType == 2
  );
  const AttendanceRosterRequest = UserAccess?.["Attendance Management"]?.find(
    (el) => el?.componentName === "ReadAllAttendanceRosterRequest" && el?.isResourceShow && el?.portalType == 2
  );
  const TravelRequest = UserAccess?.["Travel"]?.find(
    (el) => el?.componentName === "ReadAllTravelRequest" && el?.isResourceShow && el?.portalType == 2
  );
  const claimRequest = UserAccess?.["Payroll"]?.find(
    (el) => el?.componentName === "ReadAllReimbursementClaimRequest" && el?.isResourceShow && el?.portalType == 2
  );
  const jobRequest = UserAccess?.["Job Requisition Vacancy"]?.find(
    (el) => el?.componentName === "ReadAllRequisitionJobVacancy" && el?.isResourceShow && el?.portalType == 2
  );
  const appraisalGoalSetup = UserAccess?.["Appraisal"]?.find(
    (el) => el?.componentName === "ReadAllEmployeeGoalSetup" && el?.isResourceShow && el?.portalType == 2
  );
  const resignRequest = UserAccess?.["Resignation"]?.find(
    (el) => el?.componentName === "ReadAllResignation" && el?.isResourceShow && el?.portalType == 2
  );
  const taskCreation = UserAccess?.["Help Desk"]?.find(
    (el) => el?.componentName === "ReadAllFacilitatorTicketCreation" && el?.isResourceShow && el?.portalType == 2
  );
  const ticketCreation = UserAccess?.["Task"]?.find(
    (el) => el?.componentName === "ReadAllTicketSetup" && el?.isResourceShow && el?.portalType == 2
  );
  const docSection = UserAccess?.["company_doc_portal"]?.find(
    (el) => el?.componentName === "ReadAllCompanyDocPortal" && el?.isResourceShow && el?.portalType == 2
  );
  const portalDepartmentWiseBudget = UserAccess?.["Manpower Budget"]?.find(
    (el) => el?.componentName === "ReadAllPortalDepartmentWiseBudget" && el?.isResourceShow && el?.portalType == 2
  );

  const portal2MenuItems = useMemo(() => {
    return [
      {
        name: "Employee Profile Request",
        link: "/employee_profile_workflow/read-all-employee-profile-workflow",
        icon: Users,
        show: !!employeeProfileWorkflowItem,
      },
      {
        name: "Attendance Request",
        link: "/attendance_request/read-all-attendance-request",
        icon: CalendarDays,
        show: moduleRights?.find((e) => e?.value == 3)?.allow && !!attendanceRequest,
      },
      {
        name: "Leave Request",
        link: "/leave-request/read-all-leave-request",
        icon: Palmtree,
        show: moduleRights?.find((e) => e?.value == 2)?.allow && !!leaveRequest,
      },
      {
        name: "Loan Request",
        link: "/loan_request/read-all-loan-request",
        icon: DollarSign,
        show: moduleRights?.find((e) => e?.value == 4)?.allow && !!loanRequest,
      },
      {
        name: "Roster Request",
        link: "/attendance_roster_request/read-all-attendance-roster-request",
        icon: NotebookTabs,
        show: moduleRights?.find((e) => e?.value == 3)?.allow && !!AttendanceRosterRequest,
      },
      {
        name: "Travel Request",
        link: "/travel_request/read-all-travel-request",
        icon: Luggage,
        show: moduleRights?.find((e) => e?.value == 4)?.allow && !!TravelRequest,
      },
      {
        name: "Reimbursement Request",
        link: "/reimbursement_claim_request/read-all-reimbursement-claim-request",
        icon: Receipt,
        show: moduleRights?.find((e) => e?.value == 4)?.allow && !!claimRequest,
      },
      {
        name: "Recruitment Request",
        link: "/requisition_job_vacancy/read-all-requisition-job-vacancy",
        icon: BriefcaseBusiness,
        show: moduleRights?.find((e) => e?.value == 5)?.allow && !!jobRequest,
      },
      {
        name: "Appraisal Feedback",
        link: "/appraisal_evaluation/read-all-appraisal-evaluation",
        icon: TrendingUpDown,
        show: moduleRights?.find((e) => e?.value == 6)?.allow && !!appraisalGoalSetup,
      },
      {
        name: "Resignation Request",
        link: "/employee_resignation/read-all-resignation",
        icon: UserRoundX,
        show:
          moduleRights?.find((e) => e?.value == "separation")?.allow &&
          !!resignRequest &&
          portalInfo?.allowResignationRequest,
      },
      {
        name: "Help Desk Task",
        link: "/portal_ticket_creation/read-all-facilitator-ticket-creation",
        icon: HeartHandshake,
        show: moduleRights?.find((e) => e?.value == 7)?.allow && !!taskCreation,
      },
      {
        name: "Project Management",
        link: "/ticket_setup_portal/read-all-ticket-setup",
        icon: PanelsTopLeft,
        show: moduleRights?.find((e) => e?.value == 7)?.allow && !!ticketCreation,
      },
      {
        name: "Employee Documents",
        link: "/company_doc_portal/read-all-company-doc-portal",
        icon: FolderCheck,
        show: moduleRights?.find((e) => e?.value == 1)?.allow && !!docSection,
      },
      {
        name: "Budget Request",
        link: "/portal_department_wise_budget/read-all-portal-department-wise-budget",
        icon: BanknoteArrowUp,
        show: moduleRights?.find((e) => e?.value == 8)?.allow && !!portalDepartmentWiseBudget,
      },
    ];
  }, [
    moduleRights,
    portalInfo,
    employeeProfileWorkflowItem,
    attendanceRequest,
    leaveRequest,
    loanRequest,
    AttendanceRosterRequest,
    TravelRequest,
    claimRequest,
    jobRequest,
    appraisalGoalSetup,
    resignRequest,
    taskCreation,
    ticketCreation,
    docSection,
    portalDepartmentWiseBudget,
  ]);

  const getMenuItemActive = useCallback(
    (url) => {
      return checkIsActive(location, url) ? "sidebar-item-active" : "";
    },
    [location]
  );

  // ─── Open dropdown fly-out ───────────────────────────────────────────────
  const handleParentHover = (parentKey, event) => {
    if (!event?.currentTarget) return;
    // Cancel any pending close — we are hovering a new item
    cancelCloseTimer();
    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.top,
      left: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH + 4 : SIDEBAR_EXPANDED_WIDTH + 4,
    });
    setDropdownOpen(parentKey);
    setOpenSubMenu({});
    isMouseInFlyout.current = false;
    isMouseInSubMenu.current = false;
  };

  const handleParentLeave = () => {
    // Schedule close — will be cancelled if mouse enters the flyout portal
    scheduleClose(120);
  };

  // ─── Sub-menu fly-out ────────────────────────────────────────────────────
  const toggleSubMenu = (parentKey, childHeading, event) => {
    if (!event?.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setSubMenuPosition({
      top: rect.top,
      left: rect.right + 4,
    });
    setOpenSubMenu((prev) => {
      if (prev[parentKey]?.[childHeading]) return {};
      return { [parentKey]: { [childHeading]: true } };
    });
  };

  // Close everything when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const inSidebar = sidebarRef.current?.contains(e.target);
      const inDropdown = dropdownPortalRef.current?.contains(e.target);
      const inSubMenu = subMenuPortalRef.current?.contains(e.target);
      if (!inSidebar && !inDropdown && !inSubMenu) {
        setDropdownOpen(null);
        setOpenSubMenu({});
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Re-sync sidebar width CSS variable
  const sidebarWidth = isCollapsed
    ? SIDEBAR_COLLAPSED_WIDTH
    : SIDEBAR_EXPANDED_WIDTH;

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      `${sidebarWidth}px`
    );
  }, [sidebarWidth]);

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Sidebar panel ─────────────────────────────────── */}
      <aside
        ref={sidebarRef}
        className="sidebar-panel"
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
        }}
      >
        {/* Brand / Header row */}
        <div className="sidebar-brand">
          <Header
            isEmployeePortal={isEmployeePortal}
            company={user?.Company}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Scrollable nav list */}
        <nav className="sidebar-nav">
          {isEmployeePortal === "1" ? (
            <ul className="sidebar-menu-list">
              {/* Dashboard */}
              <li className={`sidebar-item ${getMenuItemActive("/dashboard")}`}>
                <a href="/dashboard" className="sidebar-link">
                  <span className="sidebar-icon">
                    <LayoutDashboard size={20} />
                  </span>
                  {!isCollapsed && (
                    <span className="sidebar-label">Dashboard</span>
                  )}
                </a>
                {isCollapsed && (
                  <div className="sidebar-tooltip">Dashboard</div>
                )}
              </li>

              {/* Dynamic menu items */}
              {menu &&
                Object.keys(menu).map((parentKey) => {
                  const parentItems = menu[parentKey];
                  const hasVisible = Object.values(parentItems).some(
                    (childGroup) =>
                      childGroup.some(
                        (item) =>
                          item.isResourceShow && item?.portalType == 1
                      )
                  );
                  if (!hasVisible) return null;

                  const Icon = getIcon(parentKey);
                  const isOpen = dropdownOpen === parentKey;

                  return (
                    <li
                      key={parentKey}
                      className={`sidebar-item ${isOpen ? "sidebar-item-open" : ""}`}
                      onMouseEnter={(e) => handleParentHover(parentKey, e)}
                      onMouseLeave={handleParentLeave}
                    >
                      <div className="sidebar-link sidebar-link-parent">
                        <span className="sidebar-icon">
                          <Icon size={20} />
                        </span>
                        {!isCollapsed && (
                          <>
                            <span className="sidebar-label">
                              {parentKey.replace(/_/g, " ")}
                            </span>
                            <ChevronRight
                              size={14}
                              className="sidebar-chevron ml-auto"
                            />
                          </>
                        )}
                      </div>
                      {isCollapsed && (
                        <div className="sidebar-tooltip">
                          {parentKey.replace(/_/g, " ")}
                        </div>
                      )}
                    </li>
                  );
                })}
            </ul>
          ) : (
            <ul className="sidebar-menu-list">
              {/* Dashboard for Portal 2 */}
              <li className={`sidebar-item ${getMenuItemActive("/dashboard")}`}>
                <a href="/dashboard" className="sidebar-link">
                  <span className="sidebar-icon">
                    <LayoutDashboard size={20} />
                  </span>
                  {!isCollapsed && (
                    <span className="sidebar-label">Dashboard</span>
                  )}
                </a>
                {isCollapsed && (
                  <div className="sidebar-tooltip">Dashboard</div>
                )}
              </li>

              {/* Direct registered items for Portal 2 */}
              {portal2MenuItems
                .filter((item) => item.show)
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.name}
                      className={`sidebar-item ${getMenuItemActive(item.link)}`}
                    >
                      <a href={item.link} className="sidebar-link">
                        <span className="sidebar-icon">
                          <Icon size={20} />
                        </span>
                        {!isCollapsed && (
                          <span className="sidebar-label">{item.name}</span>
                        )}
                      </a>
                      {isCollapsed && (
                        <div className="sidebar-tooltip">{item.name}</div>
                      )}
                    </li>
                  );
                })}
            </ul>
          )}
        </nav>

        {/* Bottom Actions: AI Assistant & Topbar */}
        <div className="sidebar-bottom-actions flex flex-col gap-2 p-2 border-t border-white/10 mt-auto">
          {user?.allowAIChatbot && !isAIChatbotPage ? (
            <div className="flex justify-center">
              <button
                style={{ border: "1.5px solid #0093dd" }}
                onClick={() => window.open("/ask/ai-chatbot/new", "_blank")}
                className={`text-tprimary bg-white rounded-3xl text-sm shadow-[0_0_10px_#FFFFFF] flex items-center justify-center transition-all ${isCollapsed ? "p-2 w-10 h-10" : "px-3 py-1.5 w-full gap-1"
                  }`}
                title="AI Assistant"
              >
                {!isCollapsed && <span>AI Assistant</span>}
                <Minus
                  className="w-4 h-4 rotate-90 text-tprimary hidden md:block"
                />
                <SquareArrowOutUpRight className="w-3.5 h-3.5 text-tprimary" />
              </button>
            </div>
          ) : null}

          <div className={`flex items-center justify-center ${isCollapsed ? "w-10 h-10 mx-auto" : "w-full"}`}>
            <Topbar isCollapsed={isCollapsed} />
          </div>
        </div>

        {/* Toggle collapse button */}
        {!isBelowLg && (
          <button
            className={`sidebar-toggle-btn ${isCollapsed ? "justify-center" : "justify-between"}`}
            onClick={() => {
              setUserCollapsed((v) => !v);
              setDropdownOpen(null);
              setOpenSubMenu({});
            }}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {!isCollapsed && <span className="text-[#a3e0ff] text-xs font-medium">Collapse</span>}
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}
      </aside>

      {/* ── Fly-out dropdown portal (Level 1: child groups) ── */}
      {dropdownOpen !== null &&
        menu &&
        (() => {
          const parentItems = menu[dropdownOpen];
          if (!parentItems) return null;

          const visibleGroups = Object.keys(parentItems).filter((heading) =>
            parentItems[heading].some(
              (item) =>
                item.isResourceShow &&
                item?.portalType == Number(isEmployeePortal)
            )
          );
          if (visibleGroups.length === 0) return null;

          return ReactDOM.createPortal(
            <div
              ref={dropdownPortalRef}
              className="flyout-dropdown"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
              }}
              onMouseEnter={() => {
                cancelCloseTimer();
                isMouseInFlyout.current = true;
              }}
              onMouseLeave={() => {
                isMouseInFlyout.current = false;
                scheduleClose(120);
              }}
            >

              {visibleGroups.map((childHeading) => {
                const visibleItems = parentItems[childHeading].filter(
                  (item) =>
                    item.isResourceShow &&
                    item?.portalType == Number(isEmployeePortal)
                );
                const isSubOpen =
                  openSubMenu[dropdownOpen]?.[childHeading] === true;

                return (
                  <div
                    key={childHeading}
                    className={`flyout-group ${isSubOpen ? "flyout-group-open" : ""}`}
                    onMouseEnter={(e) =>
                      toggleSubMenu(dropdownOpen, childHeading, e)
                    }
                  >
                    <div className="flyout-group-header">
                      <span>{childHeading.replace(/_/g, " ")}</span>
                      <ChevronRight size={13} className="flyout-chevron" />
                    </div>
                  </div>
                );
              })}
            </div>,
            document.body
          );
        })()}

      {/* ── Sub-menu portal (Level 2: actual links) ─────── */}
      {Object.keys(openSubMenu).map((parentKey) =>
        Object.keys(openSubMenu[parentKey]).map((childHeading) => {
          if (!openSubMenu[parentKey][childHeading]) return null;
          const parentItems = menu?.[parentKey];
          if (!parentItems) return null;

          const visibleItems = (parentItems[childHeading] || [])
            .filter(
              (item) =>
                item.isResourceShow &&
                item?.portalType == Number(isEmployeePortal)
            )
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

          if (visibleItems.length === 0) return null;

          return ReactDOM.createPortal(
            <div
              key={`${parentKey}-${childHeading}`}
              ref={subMenuPortalRef}
              className="flyout-submenu"
              style={{
                top: subMenuPosition.top,
                left: subMenuPosition.left,
              }}
              onMouseEnter={() => {
                cancelCloseTimer();
                isMouseInSubMenu.current = true;
              }}
              onMouseLeave={() => {
                isMouseInSubMenu.current = false;
                scheduleClose(120);
              }}
            >

              {visibleItems.map((item) => (
                <a
                  key={item.url}
                  href={`/${item.url}`}
                  className={`flyout-link ${getMenuItemActive(`/${item.url}`)}`}
                >
                  {item.name}
                </a>
              ))}
            </div>,
            document.body
          );
        })
      )}
    </>
  );
}
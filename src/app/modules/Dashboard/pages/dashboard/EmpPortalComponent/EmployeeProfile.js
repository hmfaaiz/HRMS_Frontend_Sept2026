import React, { useEffect, useState } from "react";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { ChevronDown, LayoutGrid, Maximize2, UsersRound } from "lucide-react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as action from "../../../_redux/dashboardActions";
import useWindowSize from "../../../../../utils/useWindowSize";
import { AttendanceMarking } from "./AttendanceMarking";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { Link } from "react-router-dom";
// import { MenuOption } from "./MenuOption"; // COMMENTED OUT: Associated Modules section hidden — uncomment to restore

/* ─── helpers ─────────────────────────────────────────────────── */
const renderInfoGrid = (data, fields) => (
  <div className="grid grid-cols-2 text-sm text-black gap-y-2 mt-2">
    {fields.map(([label, value], idx) => (
      <div key={idx} className="contents">
        <div className="font-medium">{label}</div>
        <div className="break-words">{value || "N/A"}</div>
      </div>
    ))}
  </div>
);

/** Reusable accordion panel */
const AccordionPanel = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "8px",
        overflow: "hidden",
        marginBottom: "6px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          borderBottom: open ? "1px solid #e5e7eb" : "none",
          transition: "border-bottom 0.2s",
        }}
      >
        <span style={{ fontWeight: 600, fontSize: "14px", color: "#111827" }}>
          {title}
        </span>
        <ChevronDown
          style={{
            width: 16,
            height: 16,
            color: "#6b7280",
            transition: "transform 0.25s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Body — animated */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.28s ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div style={{ padding: "10px 16px 14px" }}>{children}</div>
        </div>
      </div>
    </div>
  );
};

/* ─── main component ───────────────────────────────────────────── */
const EmployeeProfile = ({
  isAttMarkShow,
  updateCompactView,
  isCompactView,
  team,
  setAttModalData,
  handleDetailViewChange,
  isDashboard = false,
  detailViewType,
  isTeamExists,
}) => {
  const [profileInfo, setProfileInfo] = useState(false);
  const { width } = useWindowSize();
  const dispatch = useDispatch();

  const { role, employeeId } = useSelector(
    (state) => ({
      role: state?.auth?.user?.role,
      employeeId: state?.auth?.user?.employeeIdMapping,
    }),
    shallowEqual,
  );

  const { allAlertTask, portal_ticket_creation } = useSelector((state) => {
    return {
      allAlertTask: state.dashboard.allAlertTask,
      portal_ticket_creation: state?.auth?.userAccess.portal_ticket_creation,
    };
  }, shallowEqual);

  useEffect(() => {
    let data = JSON.parse(sessionStorage.getItem("profile_info"));
    if (data?.profileInfo?.Id != employeeId) {
      dispatch(action.getEmployeeProfileInfo(setProfileInfo));
    } else {
      setProfileInfo(data);
    }
    dispatch(action.fetchAllAlertTasks());
  }, []);

  const getOptions = (role) => {
    const options = [];
    options.push({ label: "Self View", value: 1 });
    if (role?.isSupervisor) options.push({ label: "Manager View", value: 2 });
    if (role?.isMgt) options.push({ label: "Management View", value: 3 });
    return options;
  };

  const showTaskReminder =
    isDashboard &&
    portal_ticket_creation?.length > 0 &&
    allAlertTask?.rows?.length > 0;

  return (
    <>
      {/* ── Profile Header card ── */}
      {/* COMMENTED OUT: Previously shown on all pages (including non-dashboard with hidden xl:block).
          Now only rendered when isDashboard=true.
          To restore the old behaviour, remove the isDashboard wrapper and use the original className below:
          className={isDashboard ? "p-3 rounded-lg bg-white w-full relative" : "p-3 rounded-lg bg-white w-full relative hidden xl:block"} */}
      {isDashboard && (
        <div
          className="p-3 rounded-lg bg-white w-full relative"
          style={{ marginBottom: "6px" }}
        >
          {/* Top-right compact/detail toggle icons */}
          {isAttMarkShow && (
            <div className="absolute top-2 right-2 flex gap-1">
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="compact-view-tooltip">Compact View</Tooltip>}
              >
                <button
                  onClick={() => updateCompactView()}
                  className={`p-1 rounded-sm transition-colors duration-200 w-7 h-7 border-none flex items-center justify-center ${isCompactView
                      ? "bg-tprimary text-white"
                      : "bg-gray-300 text-black hover:bg-gray-400"
                    }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="detail-view-tooltip">Detail View</Tooltip>}
              >
                <button
                  onClick={() => updateCompactView()}
                  className={`p-1 rounded-sm transition-colors duration-200 w-7 h-7 border-none flex items-center justify-center ${!isCompactView
                      ? "bg-tprimary text-white"
                      : "bg-gray-300 text-black hover:bg-gray-400"
                    }`}
                >
                  <Maximize2 className="w-4" />
                </button>
              </OverlayTrigger>
            </div>
          )}

          {/* Avatar + name block */}
          <div className="d-flex align-items-center mt-2">
            <img
              src={
                profileInfo?.profileInfo?.profile_image ||
                toAbsoluteUrl("/media/users/profileImage.png")
              }
              alt="Profile"
              width={120}
              className="rounded-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = toAbsoluteUrl("/media/users/profileImage.png");
              }}
            />
            <div className="text-black mx-5 mt-5 relative">
              <h5 className="font-weight-boldest text-black">
                {[
                  profileInfo?.profileInfo?.firstName,
                  profileInfo?.profileInfo?.middleName,
                  profileInfo?.profileInfo?.lastName,
                ]
                  .filter(Boolean)
                  .join(" ")}
              </h5>
              <p className="text-sm m-0">
                {profileInfo?.profileInfo?.department?.deptName || ""}
              </p>
              <p className="text-sm m-0">
                {profileInfo?.profileInfo?.designation?.formName || ""}
              </p>
            </div>
          </div>

          {/* View selector */}
          {isAttMarkShow && !isCompactView && (
            <div className="flex justify-end">
              <div className="w-40">
                <SearchSelect
                  isDisabled={!role?.isMgt || !role?.isSupervisor}
                  options={getOptions(role)}
                  value={
                    getOptions(role)?.find((el) => el?.value == detailViewType) || {
                      label: "As Self",
                      value: 1,
                    }
                  }
                  onChange={(e) => handleDetailViewChange(e)}
                />
              </div>
            </div>
          )}

          {isAttMarkShow && <AttendanceMarking />}
        </div>
      )}

      {/* ── Detail / Compact branch ── */}
      {!isCompactView ? (
        <>
          {/* ── Accordion: Employee Details ── */}
          {/* COMMENTED OUT: Previously shown on all pages (including non-dashboard).
              Now only rendered when isDashboard=true.
              To restore the old behaviour, remove the isDashboard wrapper, change defaultOpen back to {width >= 1280},
              and restore the original className on the wrapper div:
              className={isDashboard ? "w-full" : "w-full hidden xl:block"} */}
          {isDashboard && (
            profileInfo?.profileInfo ? (
              <div className="w-full">
                {/* defaultOpen={false} = collapsed by default. Previously was defaultOpen={width >= 1280} */}
                <AccordionPanel title="Employee Details" defaultOpen={false}>
                  {renderInfoGrid(profileInfo?.profileInfo, [
                    [
                      "Reporting To",
                      profileInfo?.profileInfo?.ReportTo
                        ? `${profileInfo?.profileInfo?.ReportTo?.firstName || ""} ${profileInfo?.profileInfo?.ReportTo?.middleName || ""
                          } ${profileInfo?.profileInfo?.ReportTo?.lastName || ""}`.trim()
                        : null,
                    ],
                    ["Grade", profileInfo?.profileInfo?.grade?.formName],
                    ["Employee Type", profileInfo?.profileInfo?.employeeType?.formName],
                    ["Employee Status", profileInfo?.profileInfo?.employeeStatus?.formName],
                  ])}

                  {renderInfoGrid(profileInfo?.profileInfo, [
                    ["Location", profileInfo?.profileInfo?.location?.formName],
                    ["Date of Joining", profileInfo?.profileInfo?.dateOfJoining],
                    ["Date of Confirmation", profileInfo?.profileInfo?.dateOfConfirmation],
                  ])}
                </AccordionPanel>
              </div>
            ) : (
              <div className="px-5 py-2 rounded-lg bg-white w-full">
                <p className="text-sm text-red-500">Employee Data Not Exists</p>
              </div>
            )
          )}

          {/* ── Associated Modules (MenuOption) ── */}
          {/* COMMENTED OUT: Hidden as per request. Uncomment the line below to restore the Associated Modules section. */}
          {/* <MenuOption isDashboard={isDashboard} /> */}

          {/* ── Accordion: Task Reminder ── */}
          {showTaskReminder && (
            <AccordionPanel title="Task Reminder" defaultOpen={true}>
              <h6 className="font-bold mb-2 text-primary underline" style={{ fontSize: "13px" }}>
                <Link to="/portal_ticket_creation/read-all-facilitator-ticket-creation">
                  View All
                </Link>
              </h6>

              {/* Header Row */}
              <div className="grid grid-cols-3 gap-2 font-semibold border-b pb-1 mb-2 text-gray-700 text-xs">
                <span className="truncate">Ticket Code</span>
                <span className="truncate">Ticket Description</span>
                <span className="truncate">Due Date</span>
              </div>

              {/* Data Rows */}
              {allAlertTask.rows.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-2 border-b py-2 text-gray-800 text-xs"
                >
                  <span className="truncate font-medium">
                    {item.ticketCode || "N/A"}
                  </span>
                  <span
                    className="truncate font-medium pointer"
                    title={item.ticketDescription}
                  >
                    {item.ticketDescription
                      ? item.ticketDescription.length > 15
                        ? item.ticketDescription.substring(0, 15) + "..."
                        : item.ticketDescription
                      : "N/A"}
                  </span>
                  <span className="truncate">{item.dueDate || "N/A"}</span>
                </div>
              ))}
            </AccordionPanel>
          )}
        </>
      ) : isTeamExists ? (
        <TeamCardCompact team={team} setAttModalData={setAttModalData} />
      ) : null}
    </>
  );
};

export default EmployeeProfile;

/* ─── TeamCardCompact ──────────────────────────────────────────── */
const TeamCardCompact = ({ team, setAttModalData }) => {
  const { allAlertTask, portal_ticket_creation } = useSelector((state) => {
    return {
      allAlertTask: state.dashboard.allAlertTask,
      portal_ticket_creation: state?.auth?.userAccess.portal_ticket_creation,
    };
  }, shallowEqual);

  return (
    <>
      <div className="bg-white rounded-lg px-3 py-6 space-y-3 relative w-full row-span-2 h-fit">
        <div className="p-3">
          <UsersRound strokeWidth={0.5} className="w-24 h-24 text-tprimary" />
        </div>
        <div className="p-3 flex justify-between items-center mt-3">
          <span className="text-tprimary font-bold text-base sm:text-xl py-1 flex items-center truncate line-clamp-1">
            Team Members
          </span>
          <span className="text-tprimary text-base sm:text-2xl font-extrabold py-1 flex items-center truncate line-clamp-1">
            {team?.length}
          </span>
        </div>

        <div className="p-3 flex gap-14 justify-start items-center mt-3">
          <span
            onClick={() =>
              setAttModalData(
                team?.filter((e) => {
                  const attendance = e?.t_attendances?.[0];
                  return (
                    attendance &&
                    (attendance?.timeIn !== "" || attendance?.timeOut !== "")
                  );
                }),
              )
            }
            className="text-white rounded-full cursor-pointer bg-tgreen px-5 py-3 text-md font-semibold text-center"
          >
            Present{" "}
            {team?.filter((e) => {
              const attendance = e?.t_attendances?.[0];
              return (
                attendance &&
                (attendance?.timeIn !== "" || attendance?.timeOut !== "")
              );
            })?.length || 0}
          </span>
          <span
            onClick={() =>
              setAttModalData(
                team?.filter((e) => {
                  const attendance = e?.t_attendances?.[0];
                  return (
                    !attendance ||
                    (attendance?.timeIn === "" && attendance?.timeOut === "")
                  );
                }),
              )
            }
            className="text-white rounded-full bg-tred cursor-pointer px-5 py-3 text-md font-semibold text-center"
          >
            Absents{" "}
            {team?.filter((e) => {
              const attendance = e?.t_attendances?.[0];
              return (
                !attendance ||
                (attendance?.timeIn === "" && attendance?.timeOut === "")
              );
            })?.length || 0}
          </span>
        </div>
      </div>

      {portal_ticket_creation?.length > 0 && allAlertTask?.rows?.length > 0 && (
        <AccordionPanel title="Task Reminder" defaultOpen={true}>
          <h6 className="font-bold mb-2 text-primary underline" style={{ fontSize: "13px" }}>
            <Link to="/portal_ticket_creation/read-all-facilitator-ticket-creation">
              View All
            </Link>
          </h6>

          {/* Header Row */}
          <div className="grid grid-cols-3 gap-2 font-semibold border-b pb-1 mb-2 text-gray-700 text-xs">
            <span className="truncate">Ticket Code</span>
            <span className="truncate">Ticket Description</span>
            <span className="truncate">Due Date</span>
          </div>

          {/* Data Rows */}
          {allAlertTask.rows.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-2 border-b py-2 text-gray-800 text-xs"
            >
              <span className="truncate font-medium">
                {item.ticketCode || "N/A"}
              </span>
              <span
                className="truncate font-medium pointer"
                title={item.ticketDescription}
              >
                {item.ticketDescription
                  ? item.ticketDescription.length > 15
                    ? item.ticketDescription.substring(0, 15) + "..."
                    : item.ticketDescription
                  : "N/A"}
              </span>
              <span className="truncate">{item.dueDate || "N/A"}</span>
            </div>
          ))}
        </AccordionPanel>
      )}
    </>
  );
};

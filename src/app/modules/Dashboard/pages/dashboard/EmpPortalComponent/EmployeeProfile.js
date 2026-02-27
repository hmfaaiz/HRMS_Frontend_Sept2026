import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { ChevronUp, LayoutGrid, List, StarIcon } from "lucide-react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as action from "../../../_redux/dashboardActions";
import useWindowSize from "../../../../../utils/useWindowSize";
import { AttendanceMarking } from "./AttendanceMarking";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

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

const EmployeeProfile = ({
  isAttMarkShow,
  updateCompactView,
  isCompactView,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { width } = useWindowSize();
  const dispatch = useDispatch();
  const { profileInfo } = useSelector(
    (state) => ({
      profileInfo: state?.dashboard?.profileInfo,
    }),
    shallowEqual,
  );

  useEffect(() => {
    dispatch(action.getEmployeeProfileInfo());
  }, []);

  useEffect(() => {
    if (width >= 1280) {
      // Large screen → always open
      setIsOpen(true);
    } else {
      // Small screen → always closed
      setIsOpen(false);
    }
  }, [width]);

  return (
    <>
      {/* Profile Header */}
      <div className="p-3 rounded-lg bg-white w-full relative">
        {/* Top right icons */}
        {isAttMarkShow && (
          <div className="absolute top-2 right-2 flex gap-1">
            <OverlayTrigger
              overlay={
                <Tooltip id="products-edit-tooltip">Compact View</Tooltip>
              }
            >
              <button
                onClick={() => updateCompactView()}
                className={`p-1 rounded-sm transition-colors duration-200 w-7 h-7 border-none flex items-center justify-center ${
                  isCompactView
                    ? "bg-tprimary text-white"
                    : "bg-gray-300 text-black hover:bg-gray-400"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </OverlayTrigger>
            <OverlayTrigger
              overlay={
                <Tooltip id="products-edit-tooltip">Detail View</Tooltip>
              }
            >
              <button
                onClick={() => updateCompactView()}
                className={`p-1 rounded-sm transition-colors duration-200 w-7 h-7 border-none flex items-center justify-center ${
                  !isCompactView
                    ? "bg-tprimary text-white"
                    : "bg-gray-300 text-black hover:bg-gray-400"
                }`}
              >
                <List className="w-4" />
              </button>
            </OverlayTrigger>
          </div>
        )}

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
        {isAttMarkShow && <AttendanceMarking />}
      </div>

      {/* Employee Details */}
      <div className="px-5 py-2 rounded-lg bg-white w-full">
        {profileInfo?.profileInfo ? (
          <>
            <div className="flex flex-row justify-between items-center">
              <h5 className="font-weight-bolder m-0 py-1">Employee Details</h5>
              {width < 1280 && (
                <ChevronUp
                  onClick={() => setIsOpen((prev) => !prev)}
                  className={`w-5 h-5 font-bold cursor-pointer ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </div>

            {/* Office Information */}
            {isOpen && (
              <>
                {/* <h6 className="font-bold mb-0 text-primary my-2 mt-4">
                  Office Information
                </h6> */}
                {renderInfoGrid(profileInfo?.profileInfo, [
                  // ["Company", profileInfo?.profileInfo?.company?.name],
                  // ["Subsidiary", profileInfo?.profileInfo?.subsidiary?.name],
                  [
                    "Reporting To",
                    profileInfo?.profileInfo?.ReportTo
                      ? `${profileInfo?.profileInfo?.ReportTo?.firstName ||
                          ""} ${profileInfo?.profileInfo?.ReportTo
                          ?.middleName || ""} ${profileInfo?.profileInfo
                          ?.ReportTo?.lastName || ""}`.trim()
                      : null,
                  ],
                  ["Grade", profileInfo?.profileInfo?.grade?.formName],
                  // ["Payroll Group", profileInfo?.profileInfo?.payrollGroup?.formName],
                  // ["Team", profileInfo?.profileInfo?.team?.formName],
                  [
                    "Employee Type",
                    profileInfo?.profileInfo?.employeeType?.formName,
                  ],
                  [
                    "Employee Status",
                    profileInfo?.profileInfo?.employeeStatus?.formName,
                  ],
                  [
                    "Default Shift",
                    profileInfo?.profileInfo?.defaultShift?.name,
                  ],
                ])}

                {/* Personal Information */}
                {/* <h6 className="font-bold mb-0 text-primary my-2 mt-6">
                  Personal Information
                </h6> */}
                {renderInfoGrid(profileInfo?.profileInfo, [
                  // ["Country", profileInfo?.profileInfo?.country?.name],
                  // ["City", profileInfo?.profileInfo?.city?.name],
                  ["Location", profileInfo?.profileInfo?.location?.formName],
                  // ["Region", profileInfo?.profileInfo?.region?.formName],
                  // ["Gender", profileInfo?.profileInfo?.gender],
                  ["Date of Joining", profileInfo?.profileInfo?.dateOfJoining],
                  [
                    "Date of Confirmation",
                    profileInfo?.profileInfo?.dateOfConfirmation,
                  ],
                  // [
                  //   "Date of Birth",
                  //   formatDate(profileInfo?.profileInfo?.dateOfBirth, "dd-MMM-yyyy"),
                  // ],
                  ["ID Card No", profileInfo?.profileInfo?.nic_no],
                  // ["Official Email", profileInfo?.profileInfo?.email_official],
                  // ["Cell No", profileInfo?.profileInfo?.phone_cell],
                  // ["Phone (Home)", profileInfo?.profileInfo?.phone_home],
                  // ["Passport No", profileInfo?.profileInfo?.passportNo],
                ])}
              </>
            )}
          </>
        ) : (
          <p className="text-sm text-red-500">Employee Data Not Exists</p>
        )}
      </div>

      {/* Emergency Contact */}
      {isOpen && (
        <div className="w-full text-sm px-3 py-2 bg-white rounded-lg">
          <h6 className="font-bold mb-0 text-primary my-2">
            Emergency Contact
          </h6>
          {profileInfo?.contactInfo?.length > 0 ? (
            renderInfoGrid(profileInfo?.contactInfo[0], [
              ["Name", profileInfo?.contactInfo[0]?.relation_name],
              ["Relation", profileInfo?.contactInfo[0]?.relation_text],
              ["Contact No", profileInfo?.contactInfo[0]?.contactNo],
            ])
          ) : (
            <p className="text-sm mb-0">No Contact Info Found</p>
          )}
        </div>
      )}
    </>
  );
};

export default EmployeeProfile;

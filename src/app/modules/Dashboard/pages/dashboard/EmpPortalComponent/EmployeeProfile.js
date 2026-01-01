import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { ChevronUp, StarIcon } from "lucide-react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as action from "../../../_redux/dashboardActions";
import useWindowSize from "../../../../../utils/useWindowSize";
import { AttendanceMarking } from "./AttendanceMarking";
import { Link } from "react-router-dom";
import { JobRequestion } from "./JobRequestion";
import { ResignationRequest } from "./EmployeeSeparation";
import { AppraisalEvaluation } from "./AppraisalEvaluation";
import { CompanyDocument } from "./CompanyDocument";
const formatDate = (date, fmt) => (date ? format(new Date(date), fmt) : "N/A");

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


const renderStars = (ratingScale) => {
  const rating = ratingScale / 2;
  return [1, 2, 3, 4, 5].map((i) => (
    <StarIcon
      key={i}
      size={13}
      className={
        rating >= i
          ? "text-yellow-500 fill-yellow-500"
          : rating >= i - 0.5
          ? "text-yellow-400 fill-yellow-400"
          : "text-gray-300"
      }
    />
  ));
};

const EmployeeProfile = ({ isAttMarkShow }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { width } = useWindowSize();
  const dispatch = useDispatch();
  const { user, data, contactInfo, skillsInfo, leave } = useSelector(
    (state) => ({
      user: state?.auth?.user,
      data: state?.dashboard?.profileInfo,
      contactInfo: state?.dashboard?.contactInfo,
      skillsInfo: state?.dashboard?.skillsInfo,
      leave: state?.auth?.userAccess["Leave Request"],
    }),
    shallowEqual
  );

  useEffect(() => {
    if (user?.employeeIdMapping) {
      dispatch(action.fetchProfileInfo(user.employeeIdMapping));
      dispatch(action.fetchContactInfo(user.employeeIdMapping));
      dispatch(action.fetchSkillsInfo(user.employeeIdMapping));
    }
  }, [user?.employeeIdMapping, dispatch]);

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
      <div className="p-3 rounded-lg bg-white w-full">
        <div className="d-flex align-items-center">
          <img
            src={
              data?.profile_image ||
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
          <div className="text-black mx-5">
            <h5 className="font-weight-boldest text-black">
              {[data?.firstName, data?.middleName, data?.lastName]
                .filter(Boolean)
                .join(" ")}
            </h5>
            <p className="text-sm m-0">{data?.department?.deptName || ""}</p>
            <p className="text-sm m-0">{data?.designation?.formName || ""}</p>
          </div>
        </div>
        {isAttMarkShow &&
          leave?.find(
            (el) => el?.componentName === "CreateLeaveRequest" && el?.isAccess
          ) && <AttendanceMarking />}
      </div>

      {/* Employee Details */}
      <div className="px-5 py-2 rounded-lg bg-white w-full">
        {data ? (
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
                {renderInfoGrid(data, [
                  // ["Company", data?.company?.name],
                  // ["Subsidiary", data?.subsidiary?.name],
                  [
                    "Reporting To",
                    data?.ReportTo
                      ? `${data?.ReportTo?.firstName || ""} ${data?.ReportTo
                          ?.middleName || ""} ${data?.ReportTo?.lastName ||
                          ""}`.trim()
                      : null,
                  ],
                  ["Grade", data?.grade?.formName],
                  // ["Payroll Group", data?.payrollGroup?.formName],
                  // ["Team", data?.team?.formName],
                  ["Employee Type", data?.employeeType?.formName],
                  ["Employee Status", data?.employeeStatus?.formName],
                  ["Default Shift", data?.defaultShift?.name],
                ])}

                {/* Personal Information */}
                {/* <h6 className="font-bold mb-0 text-primary my-2 mt-6">
                  Personal Information
                </h6> */}
                {renderInfoGrid(data, [
                  // ["Country", data?.country?.name],
                  // ["City", data?.city?.name],
                  ["Location", data?.location?.formName],
                  // ["Region", data?.region?.formName],
                  // ["Gender", data?.gender],
                  ["Date of Joining", data?.dateOfJoining],
                  ["Date of Confirmation", data?.dateOfConfirmation],
                  // [
                  //   "Date of Birth",
                  //   formatDate(data?.dateOfBirth, "dd-MMM-yyyy"),
                  // ],
                  ["ID Card No", data?.nic_no],
                  // ["Official Email", data?.email_official],
                  // ["Cell No", data?.phone_cell],
                  // ["Phone (Home)", data?.phone_home],
                  // ["Passport No", data?.passportNo],
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
          {contactInfo?.length > 0 ? (
            renderInfoGrid(contactInfo[0], [
              ["Name", contactInfo[0]?.relation_name],
              ["Relation", contactInfo[0]?.relation_text],
              ["Contact No", contactInfo[0]?.contactNo],
            ])
          ) : (
            <p className="text-sm mb-0">No Contact Info Found</p>
          )}
        </div>
      )}

      {/* Skills */}
      {isOpen && (
        // <div className="w-full text-sm px-3 py-2 bg-white rounded-lg">
        //   <h6 className="font-bold mb-0 text-primary my-2">Skills</h6>
        //   {skillsInfo?.length > 0 ? (
        //     skillsInfo.map((item, index) => (
        //       <div key={index} className="grid grid-cols-12 gap-1 text-black">
        //         <p className="text-sm mb-0 col-span-3">{item.skill}</p>
        //         <p className="col-span-3">{renderStars(item?.ratingScale)}</p>
        //       </div>
        //     ))
        //   ) : (
        //     <p className="text-sm mb-0">No Skills Found</p>
        //   )}
        // </div>
        <>
          {" "}
          <ResignationRequest />
          <AppraisalEvaluation />
          <JobRequestion />
          <CompanyDocument />
        </>
      )}

      {/* Requisition */}
      {/* {isOpen && requisition_job_vacancy?.length > 0 && (
  <div className="w-full text-sm px-3 py-2 bg-white rounded-lg">
    <h6 className="font-bold mb-0 text-primary my-2">
      Job Requisition Form
    </h6>

    {requisition_job_vacancy?.length > 0 ? (
        <div className="font-size-xs text-black font-bold">
       <p className="m-0 underline">
       <Link to={"/requisition_job_vacancy/read-all-requisition-job-vacancy"}>
                        Request Job Vacancy{" "}
        </Link>
     </p>
     </div>
    ) : (
      <p className="text-sm mb-0">No Request for Job Vacancy Found</p>
    )}
  </div>
)} */}
    </>
  );
};

export default EmployeeProfile;

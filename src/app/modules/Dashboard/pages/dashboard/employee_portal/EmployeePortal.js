import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import * as action from "../../../_redux/dashboardActions";
import { EmployeeLoanDetail } from "../EmpPortalComponent/LoanDetailTable";
import { LeaveBalanceDetail } from "../EmpPortalComponent/LeaveBalanceDetail";
import EmployeeProfile from "../EmpPortalComponent/EmployeeProfile";
import { ReportingEmpTable } from "../EmpPortalComponent/ReportingEmpTable";
import { AttendanceSummary } from "../EmpPortalComponent/AttendanceSummary";
import { HolidayTable } from "../EmpPortalComponent/HolidayCalendar";
import { PendingRequestSelf } from "../EmpPortalComponent/PendingRequest";
import AttendanceBarChart from "../EmpPortalComponent/AttendanceBarChart";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import { JobRequestion } from "../EmpPortalComponent/JobRequestion";
import { CompanyDocument } from "../EmpPortalComponent/CompanyDocument";
import { ResignationRequest } from "../EmpPortalComponent/EmployeeSeparation";
import { AppraisalEvaluation } from "../EmpPortalComponent/AppraisalEvaluation";
import { HelpDesk } from "../EmpPortalComponent/HelpDesk";
import { ProjectManagement } from "../EmpPortalComponent/ProjectManagement";
import {
  Banknote,
  Bell,
  BriefcaseBusiness,
  ChevronRight,
  FileUser,
  FolderCheck,
  TrendingUpDown,
  UserCheck,
  UserRoundX,
  PanelsTopLeft,
  HeartHandshake,
} from "lucide-react";
import TableModel from "../../../../Task_Dashboard/pages/form-setup/form-data/TableModel";

export const EmployeePortal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [attModalData, setAttModalData] = useState(null);
  const [isCompactView, setIsCompactView] = useState(false);
  const dispatch = useDispatch();

  const { announcement, portalInfo, moduleRights } = useSelector(
    (state) => ({
      portalInfo: state?.dashboard?.portalInfo,
      announcement: state?.dashboard?.announcement,
      moduleRights: state?.dashboard?.moduleRights,
    }),
    shallowEqual,
  );

  useEffect(() => {
    dispatch(action.fetchAnnouncementData());
    dispatch(action.getEmployeePortalInfo(setIsLoading));
    dispatch(action.fetchModuleRights());
    dispatch(action.updateAndSetPortalDashboardView({}, setIsCompactView));
  }, []);

  return (
    <>
      {!isLoading && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* Sidebar: EmployeeSelection and EmployeeProfile */}
          <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
            <div className="xl:hidden block">
              <EmployeePortalMenu
                announcement={announcement}
                isAnouncement={true}
                name="Dashboard"
              />
            </div>
            <EmployeeProfile
              team={portalInfo?.reportingEmployee}
              setAttModalData={setAttModalData}
              updateCompactView={() => {
                dispatch(
                  action.updateAndSetPortalDashboardView(
                    { isUpdateView: true },
                    setIsCompactView,
                  ),
                );
              }}
              isCompactView={isCompactView}
              isAttMarkShow={true}
            />
          </div>
          {/* Main Content: Dashboard, PendingRequestSelf, ReportingEmpTable, My Details, AttendanceSummary, LeaveApplicationTable, EmployeeLoanDetail */}
          <>
            {isCompactView ? (
              <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4">
                <div className="hidden xl:block">
                  <EmployeePortalMenu
                    announcement={announcement}
                    isAnouncement={true}
                    name="Dashboard"
                  />
                </div>
                <CompactView
                  moduleRights={moduleRights}
                  portalInfo={portalInfo}
                  attModalData={attModalData}
                  setAttModalData={setAttModalData}
                />
              </div>
            ) : (
              <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4">
                <div className="hidden xl:block">
                  <EmployeePortalMenu
                    announcement={announcement}
                    isAnouncement={true}
                    name="Dashboard"
                  />
                </div>
                <DetailView
                  portalInfo={portalInfo}
                  moduleRights={moduleRights}
                />
              </div>
            )}
          </>
        </div>
      )}
      {isLoading && (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
    </>
  );
};

const DetailView = ({ portalInfo, moduleRights }) => {
  return (
    <>
      {portalInfo?.reportingEmployee &&
        portalInfo?.reportingEmployee?.length > 0 && (
          <>
            <div className="flex flex-col lg:flex-row gap-4">
              <PendingRequestSelf
                leaveApprovalCount={portalInfo?.leaveApproval || 0}
                attendanceApprovalCount={portalInfo?.attApproval || 0}
                loanApprovalCount={portalInfo?.loanApproval || 0}
                resignationApprovalCount={portalInfo?.resignApproval || 0}
                moduleRights={moduleRights}
              />
              <ReportingEmpTable
                empAuthorityList={
                  portalInfo?.reportingEmployee?.length > 0
                    ? portalInfo?.reportingEmployee
                    : []
                }
              />
            </div>
            <EmployeePortalMenu name="My Details" />
          </>
        )}
      {moduleRights?.find((e) => e?.value == 3)?.allow ||
      moduleRights?.find((e) => e?.value == 2)?.allow ||
      moduleRights?.find((e) => e?.value == 4)?.allow ? (
        <div className="flex flex-col md:flex-row gap-4">
          {moduleRights?.find((e) => e?.value == 3)?.allow ? (
            <AttendanceSummary
              attendanceSummary={portalInfo?.attendanceSummary}
            />
          ) : null}
          {moduleRights?.find((e) => e?.value == 2)?.allow ? (
            <LeaveBalanceDetail leaveBalances={portalInfo?.leaveBalance} />
          ) : null}
          {moduleRights?.find((e) => e?.value == 4)?.allow ? (
            <EmployeeLoanDetail
              entities={
                portalInfo?.loanRequest?.length > 0
                  ? portalInfo?.loanRequest
                  : []
              }
            />
          ) : null}
        </div>
      ) : null}
      {moduleRights?.find((e) => e?.value == "separation")?.allow ||
      moduleRights?.find((e) => e?.value == 6)?.allow ||
      moduleRights?.find((e) => e?.value == 5)?.allow ? (
        <div className="flex flex-col md:flex-row gap-4">
          {moduleRights?.find((e) => e?.value == "separation")?.allow ? (
            <ResignationRequest />
          ) : null}
          {moduleRights?.find((e) => e?.value == 6)?.allow ? (
            <AppraisalEvaluation />
          ) : null}
          {moduleRights?.find((e) => e?.value == 5)?.allow ? (
            <JobRequestion />
          ) : null}
        </div>
      ) : null}
      {moduleRights?.find((e) => e?.value == 1)?.allow ||
      moduleRights?.find((e) => e?.value == 7)?.allow ? (
        <div className="flex flex-col md:flex-row gap-4">
          {moduleRights?.find((e) => e?.value == 1)?.allow ? (
            <CompanyDocument />
          ) : null}
          {moduleRights?.find((e) => e?.value == 7)?.allow ? (
            <HelpDesk />
          ) : null}
          {moduleRights?.find((e) => e?.value == 7)?.allow ? (
            <ProjectManagement />
          ) : null}
        </div>
      ) : null}

      {moduleRights?.find((e) => e?.value == 3)?.allow ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AttendanceBarChart data={portalInfo?.attendanceDetail} />
          <HolidayTable
            entities={
              portalInfo?.holidays?.length > 0 ? portalInfo?.holidays : []
            }
          />
        </div>
      ) : null}
    </>
  );
};

const CompactView = ({
  portalInfo,
  moduleRights,
  attModalData,
  setAttModalData,
}) => {
  const {
    leave,
    attendance,
    loan,
    resignation,
    requisition_job_vacancy,
    appraisalEval,
    company_doc_portal,
    portal_ticket_creation,
    ticket_setup_portal,
  } = useSelector(
    (state) => ({
      leave: state?.auth?.userAccess["Leave"],
      attendance: state?.auth?.userAccess["Attendance"],
      loan: state?.auth?.userAccess["Payroll"],
      resignation: state?.auth?.userAccess["Resignation"],
      requisition_job_vacancy: state?.auth?.userAccess.requisition_job_vacancy,
      appraisalEval: state?.auth?.userAccess["appraisal_evaluation"],
      company_doc_portal: state?.auth?.userAccess.company_doc_portal,
      portal_ticket_creation: state?.auth?.userAccess.portal_ticket_creation,
      ticket_setup_portal: state?.auth?.userAccess["ticket_setup_portal"],
    }),
    shallowEqual,
  );

  const isLeaveRequest = leave?.find(
    (el) => el?.componentName === "ReadAllLeaveRequest" && el?.isResourceShow,
  );
  const isAttRequest = attendance?.find(
    (el) =>
      el?.componentName === "ReadAllAttendanceRequest" && el?.isResourceShow,
  );

  const isLoanRequest = loan?.find(
    (el) => el?.componentName === "ReadAllLoanRequest" && el?.isResourceShow,
  );

  const isAccessForResignationRequest = resignation?.find(
    (el) => el?.componentName === "ReadAllResignation" && el?.isResourceShow,
  );

  const isAccessForJobReq = requisition_job_vacancy?.find(
    (el) => el?.componentName === "ReadRequisitionJobVacancy" && el?.isAccess,
  );

  const isAppraisalEvaluation = appraisalEval?.find(
    (el) =>
      el?.componentName === "ReadAllAppraisalEvaluation" && el?.isResourceShow,
  );

  const isCompanyDocPortal = company_doc_portal?.find(
    (el) =>
      el?.componentName === "ReadAllCompanyDocPortal" && el?.isResourceShow,
  );

  const isHelpDesk = portal_ticket_creation?.find(
    (el) =>
      el?.componentName === "ReadFacilitatorTicketCreation" && el?.isAccess,
  );

  const isProjectManagement = ticket_setup_portal?.find(
    (el) => el?.componentName === "ReadTicketSetup" && el?.isAccess,
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 ">
      {/* Attendance Request */}
      {moduleRights?.find((e) => e?.value == 3)?.allow && isAttRequest ? (
        <CompactViewCard
          Icon={UserCheck}
          name={"Attendance"}
          count={portalInfo?.attApproval}
          link={"/attendance_request/read-all-attendance-request"}
        />
      ) : null}
      {/* Leave Request */}
      {moduleRights?.find((e) => e?.value == 2)?.allow && isLeaveRequest ? (
        <CompactViewCard
          Icon={UserRoundX}
          name={"Leave"}
          count={portalInfo?.leaveApproval}
          link={"/leave-request/read-all-leave-request"}
        />
      ) : null}
      {/* Loan Request */}
      {moduleRights?.find((e) => e?.value == 4)?.allow && isLoanRequest ? (
        <CompactViewCard
          Icon={Banknote}
          name={"Loan"}
          count={portalInfo?.loanApproval}
          link={"/loan_request/read-all-loan-request"}
        />
      ) : null}
      {/* Seperation Request  */}
      {moduleRights?.find((e) => e?.value == "separation")?.allow &&
      isAccessForResignationRequest ? (
        <CompactViewCard
          Icon={FileUser}
          name={"Resignation"}
          count={portalInfo?.resignApproval}
          link={"/employee_resignation/read-all-resignation"}
        />
      ) : null}
      {/* Appraisal Evaluation */}
      {moduleRights?.find((e) => e?.value == 6)?.allow &&
      isAppraisalEvaluation ? (
        <CompactViewCard
          Icon={TrendingUpDown}
          name={"Appraisal"}
          count={portalInfo?.appraisalEvaluationPending}
          link={"/appraisal_evaluation/read-all-appraisal-evaluation"}
        />
      ) : null}
      {/* Help Desk  */}
      {moduleRights?.find((e) => e?.value == 7)?.allow && isHelpDesk ? (
        <CompactViewCard
          Icon={HeartHandshake}
          name={"Help Desk"}
          count={portalInfo?.helpDeskPendingTask}
          link={"/portal_ticket_creation/read-all-facilitator-ticket-creation"}
        />
      ) : null}
      {/* /// Project Management  */}
      {moduleRights?.find((e) => e?.value == 7)?.allow &&
      isProjectManagement ? (
        <CompactViewCard
          Icon={PanelsTopLeft}
          name={"Project Management"}
          count={portalInfo?.projectManagementPendingTask}
          link={"/ticket_setup_portal/read-all-ticket-setup"}
        />
      ) : null}

      {/* /// Job Requisition */}
      {moduleRights?.find((e) => e?.value == 5)?.allow && isAccessForJobReq ? (
        <CompactViewCard
          Icon={BriefcaseBusiness}
          name={"Job Requestion"}
          showCount={false}
          count={0}
          link={"/requisition_job_vacancy/read-all-requisition-job-vacancy"}
        />
      ) : null}
      {/* Document Portal */}
      {moduleRights?.find((e) => e?.value == 1)?.allow && isCompanyDocPortal ? (
        <CompactViewCard
          Icon={FolderCheck}
          name={"Documents"}
          showCount={false}
          count={0}
          link={"/company_doc_portal/read-all-company-doc-portal"}
        />
      ) : null}

      <TableModel
        show={!!attModalData}
        onHide={() => setAttModalData(null)}
        heading={"Team Members"}
        data={{
          result: (attModalData || []).map((el) => ({
            Id: el?.employeeId || el?.employeeCode,
            code: el?.employeeCode,
            name: `${el?.firstName || ""} ${el?.middleName ||
              ""} ${el?.lastName || ""}`.trim(),
            designation: el?.designation?.formName,
            check_In: el?.t_attendances?.[0]?.timeIn || "-",
            check_Out: el?.t_attendances?.[0]?.timeOut || "-",
            status: el?.t_attendances?.[0]?.status || "-",
          })),
        }}
      />
    </div>
  );
};

const CompactViewCard = ({ Icon, name, link, count, showCount = true }) => {
  return (
    <div className="bg-white rounded-lg px-3 py-7 flex items-center space-x-3 justify-between h-fit relative w-full">
      {/* Left section: Icon and label */}
      <div className="p-3">
        <Icon className="w-12 h-12 text-tprimary" />
        <div>
          <a key={name} href={link}>
            <h3 className="mt-1 text-black font-bold text-base sm:text-lg py-1 flex items-center truncate line-clamp-1">
              {name}
              <ChevronRight className="w-5 h-5 ml-1" />
            </h3>
          </a>
        </div>
      </div>

      {/* Right section: value box with Bell icon */}
      {showCount ? (
        <div className="relative bg-tsecondary w-20 h-20 p-3 rounded-lg flex items-center justify-center">
          {/* Bell icon at top-left */}
          {count > 0 ? (
            <Bell className="absolute -top-2 bg-tprimary rounded-full p-1 -left-2 w-5 h-5 text-tsecondary" />
          ) : null}
          <h4 className="text-black font-bold text-base sm:text-xl">
            {count > 0 ? count : "00"}
          </h4>
        </div>
      ) : null}
    </div>
  );
};

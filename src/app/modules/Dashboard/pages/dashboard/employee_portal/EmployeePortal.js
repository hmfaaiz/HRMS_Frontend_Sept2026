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
import { ReimbursementDetail } from "../EmpPortalComponent/ReimbursementDetail";
import { AttendanceRosterDetail } from "../EmpPortalComponent/AttendanceRosterDetail";
import { TravelRequestPortalDetail } from "../EmpPortalComponent/TravelRequestPortalDetail";
import {
  Banknote,
  Bell,
  BriefcaseBusiness,
  ChevronRight,
  FileUser,
  FolderCheck,
  Receipt,
  TrendingUpDown,
  UserCheck,
  UserRoundX,
  PanelsTopLeft,
  HeartHandshake,
  NotebookTabs,
  Luggage,
  HandCoins,
} from "lucide-react";
import TableModel from "../../../../Task_Dashboard/pages/form-setup/form-data/TableModel";
import { LoanDetailMgt } from "../EmpPortalComponent/LoanDetailMgt";
import { AttendanceSummaryMgt } from "../EmpPortalComponent/AttendanceSummaryMgt";
import { LeaveBalanceDetailMgt } from "../EmpPortalComponent/LeaveBalanceDetailMgt";

export const EmployeePortal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [attModalData, setAttModalData] = useState(null);
  const [isCompactView, setIsCompactView] = useState(false);
  const [detailViewType, setDetailViewType] = useState("1");
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
    dispatch(action.getEmployeePortalInfo(setIsLoading, detailViewType));
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
              detailViewType={detailViewType}
              handleDetailViewChange={(e) => {
                setDetailViewType(e?.value);
                dispatch(action.getEmployeePortalInfo(setIsLoading, e?.value));
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
                  detailViewType={detailViewType}
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

const DetailView = ({ portalInfo, moduleRights, detailViewType }) => {
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
                rosterApproval={portalInfo?.rosterApproval || 0}
                tadaApproval={portalInfo?.tadaApproval || 0}
                reimbApproval={portalInfo?.reimbApproval || 0}
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
            <EmployeePortalMenu
              name={
                detailViewType == 1
                  ? "My Details"
                  : detailViewType == 2
                  ? "Department Details"
                  : "Company Details"
              }
            />
          </>
        )}
      {moduleRights?.find((e) => e?.value == 3)?.allow ||
      moduleRights?.find((e) => e?.value == 2)?.allow ||
      moduleRights?.find((e) => e?.value == 4)?.allow ? (
        <div className="flex flex-col md:flex-row gap-4">
          {moduleRights?.find((e) => e?.value == 3)?.allow ? (
            detailViewType == 1 ? (
              <AttendanceSummary
                attendanceSummary={portalInfo?.attendanceSummary}
              />
            ) : (
              <AttendanceSummaryMgt
                attendanceSummary={portalInfo?.attendanceSummary?.[0] || {}}
              />
            )
          ) : null}
          {moduleRights?.find((e) => e?.value == 2)?.allow ? (
            detailViewType == 1 ? (
              <LeaveBalanceDetail leaveBalances={portalInfo?.leaveBalance} />
            ) : (
              <LeaveBalanceDetailMgt
                leaveBalances={portalInfo?.leaveBalance?.[0] || {}}
              />
            )
          ) : null}
          {moduleRights?.find((e) => e?.value == 4)?.allow ? (
            detailViewType == 1 ? (
              <EmployeeLoanDetail
                entities={
                  portalInfo?.loanRequest?.length > 0
                    ? portalInfo?.loanRequest
                    : []
                }
              />
            ) : (
              <LoanDetailMgt
                entities={
                  portalInfo?.loanRequest?.length > 0
                    ? portalInfo?.loanRequest
                    : []
                }
              />
            )
          ) : null}
        </div>
      ) : null}
      <div className="flex flex-col md:flex-row gap-4">
        {moduleRights?.find((e) => e?.value == 4)?.allow ? (
          <>
            <AttendanceRosterDetail />
            <TravelRequestPortalDetail />
            <ReimbursementDetail />
          </>
        ) : null}
      </div>
      {moduleRights?.find((e) => e?.value == "separation")?.allow ||
      moduleRights?.find((e) => e?.value == 6)?.allow ||
      moduleRights?.find((e) => e?.value == 5)?.allow ? (
        <div className="flex flex-col md:flex-row gap-4">
          {moduleRights?.find((e) => e?.value == 5)?.allow ? (
            <JobRequestion />
          ) : null}
          {moduleRights?.find((e) => e?.value == 6)?.allow ? (
            <AppraisalEvaluation />
          ) : null}
          {moduleRights?.find((e) => e?.value == "separation")?.allow ? (
            <ResignationRequest
              isDisabled={
                portalInfo?.allowResignationRequest === 0 ||
                portalInfo?.allowResignationRequest === false
              }
            />
          ) : null}
        </div>
      ) : null}
      {moduleRights?.find((e) => e?.value == 1)?.allow ||
      moduleRights?.find((e) => e?.value == 7)?.allow ? (
        <div className="flex flex-col md:flex-row gap-4">
          {moduleRights?.find((e) => e?.value == 7)?.allow ? (
            <HelpDesk />
          ) : null}
          {moduleRights?.find((e) => e?.value == 7)?.allow ? (
            <ProjectManagement />
          ) : null}
          {moduleRights?.find((e) => e?.value == 1)?.allow ? (
            <CompanyDocument />
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
    reimbursement_claim,
    roster,
  } = useSelector(
    (state) => ({
      leave: state?.auth?.userAccess["Leave"],
      attendance: state?.auth?.userAccess["Attendance"],
      roster: state?.auth?.userAccess["Attendance Management"],
      loan: state?.auth?.userAccess["Payroll"],
      resignation: state?.auth?.userAccess["Resignation"],
      requisition_job_vacancy: state?.auth?.userAccess.requisition_job_vacancy,
      appraisalEval: state?.auth?.userAccess["appraisal_evaluation"],
      company_doc_portal: state?.auth?.userAccess.company_doc_portal,
      portal_ticket_creation: state?.auth?.userAccess.portal_ticket_creation,
      ticket_setup_portal: state?.auth?.userAccess["ticket_setup_portal"],
      reimbursement_claim: state?.auth?.userAccess["Payroll"],
    }),
    shallowEqual,
  );
  /// leave
  const isLeaveRequest = leave?.find(
    (el) =>
      el?.componentName === "ReadAllLeaveRequest" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );
  const isLeaveApproval = leave?.find(
    (el) =>
      el?.componentName === "ReadAllLeaveApproval" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );
  /// attendance
  const isAttRequest = attendance?.find(
    (el) =>
      el?.componentName === "ReadAllAttendanceRequest" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );
  const isAttApproval = attendance?.find(
    (el) =>
      el?.componentName === "ReadAllAttendanceApproval" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );
  /// loan
  const isLoanRequest = loan?.find(
    (el) =>
      el?.componentName === "ReadAllLoanRequest" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );
  const isLoanApproval = loan?.find(
    (el) =>
      el?.componentName === "ReadAllLoanApproval" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );
  /// roster
  const isRostRequest = roster?.find(
    (el) =>
      el?.componentName === "ReadAllAttendanceRosterRequest" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );
  const isRostApproval = roster?.find(
    (el) =>
      el?.componentName === "ReadAllAttendanceRosterApproval" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );
  /// tada
  const istadaRequest = roster?.find(
    (el) =>
      el?.componentName === "ReadAllAttendanceRosterRequest" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );
  const istadaApproval = roster?.find(
    (el) =>
      el?.componentName === "ReadAllAttendanceRosterApproval" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );
  /// reimbursement_claim
  const isreimbRequest = reimbursement_claim?.find(
    (el) =>
      el?.componentName === "ReadAllReimbursementClaimRequest" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );
  const isreimbApproval = reimbursement_claim?.find(
    (el) =>
      el?.componentName === "ReadAllReimbursementClaimApproval" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );
  /// job
  const isAccessForJobReq = requisition_job_vacancy?.find(
    (el) =>
      el?.componentName === "ReadRequisitionJobVacancy" &&
      el?.isAccess &&
      el?.portalType == 2,
  );
  /// appriasl
  const isAppraisalEvaluation = appraisalEval?.find(
    (el) =>
      el?.componentName === "ReadAllAppraisalEvaluation" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );
  /// resignation
  const isAccessForResignationRequest = resignation?.find(
    (el) =>
      el?.componentName === "ReadAllResignation" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );
  const isAccessForResignationApproval = resignation?.find(
    (el) =>
      el?.componentName === "ReadAllResignationApproval" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );
  /// task
  const isHelpDesk = portal_ticket_creation?.find(
    (el) =>
      el?.componentName === "ReadFacilitatorTicketCreation" &&
      el?.isAccess &&
      el?.portalType == 2,
  );
  /// prject
  const isProjectManagement = ticket_setup_portal?.find(
    (el) =>
      el?.componentName === "ReadTicketSetup" &&
      el?.isAccess &&
      el?.portalType == 2,
  );
  /// doc
  const isCompanyDocPortal = company_doc_portal?.find(
    (el) =>
      el?.componentName === "ReadAllCompanyDocPortal" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 ">
      {/* Attendance Request */}
      {moduleRights?.find((e) => e?.value == 3)?.allow && isAttRequest ? (
        <CompactViewCard
          Icon={UserCheck}
          name={"Attendance"}
          countLink={
            isAttApproval
              ? "/attendance_approval/read-all-attendance-approval"
              : false
          }
          count={portalInfo?.attApproval}
          link={"/attendance_request/read-all-attendance-request"}
        />
      ) : null}
      {/* Leave Request */}
      {moduleRights?.find((e) => e?.value == 2)?.allow && isLeaveRequest ? (
        <CompactViewCard
          Icon={UserRoundX}
          name={"Leave"}
          countLink={
            isLeaveApproval ? "/leave-approval/read-all-leave-approval" : false
          }
          count={portalInfo?.leaveApproval}
          link={"/leave-request/read-all-leave-request"}
        />
      ) : null}
      {/* Loan Request */}
      {moduleRights?.find((e) => e?.value == 4)?.allow && isLoanRequest ? (
        <CompactViewCard
          Icon={Banknote}
          name={"Loan"}
          countLink={
            isLoanApproval ? "/loan_approval/read-all-loan-approval" : false
          }
          count={portalInfo?.loanApproval}
          link={"/loan_request/read-all-loan-request"}
        />
      ) : null}
      {/* Roster Claim */}
      {moduleRights?.find((e) => e?.value == 4)?.allow && isRostRequest ? (
        <CompactViewCard
          Icon={NotebookTabs}
          name={"Roster"}
          count={portalInfo?.rosterApproval}
          countLink={
            isRostApproval
              ? "/attendance_roster_approval/read-all-attendance-roster-approval"
              : false
          }
          link={"/attendance_roster_request/read-all-attendance-roster-request"}
        />
      ) : null}
      {/* tada */}
      {moduleRights?.find((e) => e?.value == 4)?.allow && istadaRequest ? (
        <CompactViewCard
          Icon={Luggage}
          name={"Travel"}
          count={portalInfo?.tadaApproval}
          countLink={
            istadaApproval
              ? // ? "/reimbursement_claim_approval/read-all-reimbursement-claim-approval"
                "/"
              : false
          }
          link={
            // "/reimbursement_claim_request/read-all-reimbursement-claim-request"
            "/"
          }
        />
      ) : null}
      {/* Reimbursement Claim */}
      {moduleRights?.find((e) => e?.value == 4)?.allow && isreimbRequest ? (
        <CompactViewCard
          Icon={Receipt}
          name={"Reimbursement"}
          count={portalInfo?.reimbApproval}
          countLink={
            isreimbApproval
              ? "/reimbursement_claim_approval/read-all-reimbursement-claim-approval"
              : false
          }
          link={
            "/reimbursement_claim_request/read-all-reimbursement-claim-request"
          }
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
      {/* Seperation Request  */}
      {moduleRights?.find((e) => e?.value == "separation")?.allow &&
      isAccessForResignationRequest ? (
        <CompactViewCard
          Icon={FileUser}
          name={"Resignation"}
          count={portalInfo?.resignApproval}
          countLink={
            isAccessForResignationApproval
              ? "/resignation_approval/read-all-resignation-approval"
              : false
          }
          link={
            portalInfo?.allowResignationRequest === 0 ||
            portalInfo?.allowResignationRequest === false
              ? "/resignation_approval/read-all-resignation-approval" // disabled ---- go to approval
              : "/employee_resignation/read-all-resignation" // enabled ---- go to submission
          }
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
      {/* Help Desk  */}
      {moduleRights?.find((e) => e?.value == 7)?.allow && isHelpDesk ? (
        <CompactViewCard
          Icon={HeartHandshake}
          name={"Task Assignment"}
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

const CompactViewCard = ({
  Icon,
  name,
  link,
  count,
  showCount = true,
  countLink,
}) => {
  return (
    <div className="bg-white/60 rounded-lg px-3 py-5 flex items-center space-x-3 justify-between h-fit relative w-full hover:bg-white/100">
      {/* Left section: Icon and label */}
      <div className="p-3">
        <Icon strokeWidth={1} className="w-12 h-12 text-tprimary" />
        <div>
          <a key={name} href={link}>
            <h3 className="mt-1 text-tprimary font-bold text-base sm:text-lg py-1 flex items-center truncate line-clamp-1">
              {name}
              <ChevronRight className="w-5 h-5 ml-1" />
            </h3>
          </a>
        </div>
      </div>

      {/* Right section: value box with Bell icon */}
      {showCount ? (
        <a
          href={countLink || link}
          className="relative bg-tprimary w-20 h-20 p-3 rounded-lg flex items-center justify-center"
        >
          {/* Bell icon at top-left */}
          {count > 0 ? (
            <Bell className="absolute -top-2 btn-danger rounded-full p-1.5 -left-2 w-6 h-6 text-tsecondary" />
          ) : null}
          <h4 className="text-white font-bold text-base sm:text-xl">
            {count > 0 ? count : "0"}
          </h4>
        </a>
      ) : null}
    </div>
  );
};

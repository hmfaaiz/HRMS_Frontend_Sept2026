import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import * as action from "../../../_redux/dashboardActions";
import { fetchLeaveApprovalApplication } from "../../../../LeaveApproval/redux/formAction";
import {
  attendanceApprovalFilter,
  leaveApprovalFilter,
  loanApprovalFilter,
} from "../EmpUIHelper";
import { fetchAttendanceApprovalApplication } from "../../../../AttendanceApproval/redux/formAction";
import { EmployeeLoanDetail } from "../EmpPortalComponent/LoanDetailTable";
import { LeaveBalanceDetail } from "../EmpPortalComponent/LeaveBalanceDetail";
import EmployeeProfile from "../EmpPortalComponent/EmployeeProfile";
import { ReportingEmpTable } from "../EmpPortalComponent/ReportingEmpTable";
import {
  fetchAttendance,
  fetchAttendanceSheetConsolidated,
} from "../../../../AttendanceRequest/_redux/formActions";
import { AttendanceSummary } from "../EmpPortalComponent/AttendanceSummary";
import { HolidayTable } from "../EmpPortalComponent/HolidayCalendar";
import { fetchLoanApprovalApplication } from "../../../../LoanApproval/redux/formAction";
import { PendingRequestSelf } from "../EmpPortalComponent/PendingRequest";
import AttendanceBarChart from "../EmpPortalComponent/AttendanceBarChart";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import { JobRequestion } from "../EmpPortalComponent/JobRequestion";
import { CompanyDocument } from "../EmpPortalComponent/CompanyDocument";
import { ResignationRequest } from "../EmpPortalComponent/EmployeeSeparation";
import { AppraisalEvaluation } from "../EmpPortalComponent/AppraisalEvaluation";
import { fetchResignationApprovalApplication } from "../../../../ResignationApproval/redux/formAction";
import { HelpDesk } from "../EmpPortalComponent/HelpDesk";
import { ProjectManagement } from "../EmpPortalComponent/ProjectManagement";

export const EmployeePortal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const {
    user,
    leaveBalances,
    leaveApprovalCount,
    attendanceApprovalCount,
    resignationApprovalCount,
    loanList,
    payrollData,
    reportingEmployee,
    attendanceSummary,
    holidayList,
    loanApprovalCount,
    attRecord,
    announcement,
  } = useSelector(
    (state) => ({
      employeeList: state?.dashboard?.employeeList,
      leaveBalances: state?.dashboard?.leaveBalances,
      announcement: state?.dashboard?.announcement,
      user: state?.auth?.user,
      leaveApprovalCount: state.leave_approval.entities,
      resignationApprovalCount: state.resignation_approval.entities,
      attendanceApprovalCount: state.attendance_approval?.entities,
      loanApprovalCount: state.loan_approval?.entities,
      loanList: state.dashboard?.loanList,
      holidayList: state.dashboard?.holidayList,
      leaveRequest: state?.leave_request?.entities,
      // contactInfo: state?.dashboard?.contactInfo,
      // skillsInfo: state?.dashboard?.skillsInfo,
      payrollData: state?.dashboard?.payrollData,
      reportingEmployee: state?.dashboard?.reportingEmployee,
      attendanceSummary: state?.attendance_request?.attendanceSummary,
      attRecord: state?.attendance_request?.entities,
    }),
    shallowEqual,
  );

  /// fetch pending request info
  useEffect(() => {
    if (user?.employeeIdMapping) {
      dispatch(
        fetchLeaveApprovalApplication(
          leaveApprovalFilter,
          user?.employeeIdMapping,
        ),
      );
      dispatch(
        fetchAttendanceApprovalApplication(
          attendanceApprovalFilter,
          user?.employeeIdMapping,
        ),
      );
      dispatch(
        fetchLoanApprovalApplication(
          loanApprovalFilter,
          user?.employeeIdMapping,
        ),
      );
      dispatch(
        fetchResignationApprovalApplication(
          loanApprovalFilter,
          user?.employeeIdMapping,
        ),
      );
    }
  }, [user?.employeeIdMapping]);

  // First useEffect: Fetch basic data when selectedEmp changes
  useEffect(() => {
    dispatch(action.fetchLeaveBalances(user?.employeeIdMapping));
    // dispatch(action.fetchContactInfo(user?.employeeIdMapping));
    // dispatch(action.fetchSkillsInfo(user?.employeeIdMapping));
    dispatch(action.getPayrollMonth(user?.employeeIdMapping));
    dispatch(action.fetchReportingEmployee(user?.employeeIdMapping));
    dispatch(action.fetchLoanDetail(user?.employeeIdMapping));
    dispatch(action.fetchHolidayDetail(user?.employeeIdMapping));
  }, [user?.employeeIdMapping]);

  // Second useEffect: Fetch leave & attendance when payrollData and selectedEmp are both available
  useEffect(() => {
    if (user?.employeeIdMapping && payrollData) {
      dispatch(
        fetchAttendanceSheetConsolidated({
          employeeId: user?.employeeIdMapping,
          from: payrollData.startDate,
          to: payrollData.endDate,
        }),
      );
      dispatch(
        fetchAttendance({
          pageSize: 50,
          pageNumber: 1,
          sortOrder: "asc",
          filter: {
            employeeId: user?.employeeIdMapping,
            from: payrollData.startDate,
            to: payrollData.endDate,
          },
        }),
      );
    }
    setIsLoading(false);
  }, [user?.employeeIdMapping, payrollData]);

  useEffect(() => {
    dispatch(action.fetchAnnouncementData());
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
            <EmployeeProfile isAttMarkShow={true} />
          </div>
          {/* Main Content: Dashboard, PendingRequestSelf, ReportingEmpTable, My Details, AttendanceSummary, LeaveApplicationTable, EmployeeLoanDetail */}
          <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4">
            <div className="hidden xl:block">
              <EmployeePortalMenu
                announcement={announcement}
                isAnouncement={true}
                name="Dashboard"
              />
            </div>
            {reportingEmployee && reportingEmployee?.length > 0 && (
              <>
                <div className="flex flex-col lg:flex-row gap-4">
                  <PendingRequestSelf
                    leaveApprovalCount={leaveApprovalCount?.length || 0}
                    attendanceApprovalCount={
                      attendanceApprovalCount?.length || 0
                    }
                    loanApprovalCount={loanApprovalCount?.length || 0}
                    resignationApprovalCount={
                      resignationApprovalCount?.length || 0
                    }
                  />
                  <ReportingEmpTable
                    empAuthorityList={
                      reportingEmployee?.length > 0 ? reportingEmployee : []
                    }
                  />
                </div>
                <EmployeePortalMenu name="My Details" />
              </>
            )}
            <div className="flex flex-col md:flex-row gap-4">
              <AttendanceSummary attendanceSummary={attendanceSummary} />
              <LeaveBalanceDetail leaveBalances={leaveBalances} />
              <EmployeeLoanDetail
                entities={loanList?.length > 0 ? loanList : []}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <ResignationRequest />
              <AppraisalEvaluation />
              <JobRequestion />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <CompanyDocument />
                 <HelpDesk />
              <ProjectManagement />
            </div>
      

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AttendanceBarChart data={attRecord} />
              <HolidayTable
                entities={holidayList?.length > 0 ? holidayList : []}
              />
            </div>
          </div>
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

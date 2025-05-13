import React, { useEffect, useMemo } from "react";
import { useFormUIContext } from "../EmpUIContext";
import { EmployeeSelection } from "../EmpPortalComponent/EmplyeeSelection";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getEmployeeHierarchy } from "../../../_redux/dashboardActions";
import * as action from "../../../_redux/dashboardActions";
import { LeaveBalanceTable } from "../EmpPortalComponent/LeaveBalanceTable";
import { fetchLeaveApprovalApplication } from "../../../../LeaveApproval/redux/formAction";
import {
  attendanceApprovalFilter,
  leaveApprovalFilter,
  leaveDetailFilter,
  loanDetailFilter,
} from "../EmpUIHelper";
import { fetchAttendanceApprovalApplication } from "../../../../AttendanceApproval/redux/formAction";
import { fetchEmployeeLoanRequest } from "../../../../Employee_Loan_Request/_redux/redux-Actions";
import { EmployeeLoanDetail } from "../EmpPortalComponent/LoanDetailTable";
import { fetchLeaveApplication } from "../../../../LeaveRequest/_redux/formActions";
import { LeaveApplicationTable } from "../EmpPortalComponent/LeaveApplicationTable";
import EmployeeProfile from "../EmpPortalComponent/EmployeeProfile";
import { EmployeeExtendedInfo } from "../EmpPortalComponent/EmployeeExtendedInfo";
import { ReportingEmpTable } from "../EmpPortalComponent/ReportingEmpTable";
export const EmployeePortal = () => {
  const formUIContext = useFormUIContext();
  const dispatch = useDispatch();
  const formUIProps = useMemo(() => {
    return {
      currentLevel: formUIContext?.currentLevel,
      selectedEmp: formUIContext?.selectedEmp,
      setCurrentLevel: formUIContext?.setCurrentLevel,
      setSelectedEmp: formUIContext?.setSelectedEmp,
      logedInEmp: formUIContext?.logedInEmp,
      setLogedInEmp: formUIContext?.setLogedInEmp,
    };
  }, [formUIContext]);

  const {
    employeeList,
    levelList,
    user,
    logedInEmpoyee,
    leaveBalances,
    leaveApprovalCount,
    attendanceApprovalCount,
    loanRequest,
    leaveRequest,
    profileInfo,
    contactInfo,
    experienceInfo,
    academicInfo,
    skillsInfo,
    payrollData,
    reportingEmployee,
  } = useSelector(
    (state) => ({
      employeeList: state?.dashboard?.employeeList,
      levelList: state?.dashboard?.levelList,
      leaveBalances: state?.dashboard?.leaveBalances,
      logedInEmpoyee: state?.dashboard?.logedInEmpoyee,
      user: state?.auth?.user,
      leaveApprovalCount: state.leave_approval.entities,
      attendanceApprovalCount: state.attendance_approval?.entities,
      loanRequest: state.employee_loan_request?.entities,
      leaveRequest: state?.leave_request?.entities,
      profileInfo: state?.dashboard?.profileInfo,
      contactInfo: state?.dashboard?.contactInfo,
      experienceInfo: state?.dashboard?.experienceInfo,
      academicInfo: state?.dashboard?.academicInfo,
      skillsInfo: state?.dashboard?.skillsInfo,
      payrollData: state?.dashboard?.payrollData,
      reportingEmployee: state?.dashboard?.reportingEmployee,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(getEmployeeHierarchy(formUIProps?.currentLevel));
  }, [formUIProps.currentLevel]);

  useEffect(() => {
    if (
      !formUIProps.selectedEmp?.value &&
      user?.employeeIdMapping &&
      employeeList.length > 0
    ) {
      let findEmp = employeeList.find(
        (e) => e?.value === user?.employeeIdMapping
      );
      formUIProps.setSelectedEmp(findEmp);
      dispatch(action?.getLogedInEmployee());
    }
  }, [formUIProps?.selectedEmp, employeeList]);

  useEffect(() => {
    if (logedInEmpoyee) {
      dispatch(
        fetchLeaveApprovalApplication(leaveApprovalFilter, logedInEmpoyee?.Id)
      );
      dispatch(
        fetchAttendanceApprovalApplication(
          attendanceApprovalFilter,
          logedInEmpoyee?.Id
        )
      );
    }
  }, [logedInEmpoyee]);

  useEffect(() => {
    if (formUIProps?.selectedEmp) {
      dispatch(action?.fetchLeaveBalances(formUIProps?.selectedEmp?.value));
      dispatch(action.fetchProfileInfo(formUIProps?.selectedEmp?.value));
      dispatch(action.fetchAcademicInfo(formUIProps?.selectedEmp?.value));
      dispatch(action.fetchContactInfo(formUIProps?.selectedEmp?.value));
      dispatch(action.fetchExperienceInfo(formUIProps?.selectedEmp?.value));
      dispatch(action.fetchSkillsInfo(formUIProps?.selectedEmp?.value));
      dispatch(action.getPayrollMonth(formUIProps?.selectedEmp?.value));
      dispatch(action.fetchReportingEmployee(formUIProps?.selectedEmp?.value));
      dispatch(
        fetchEmployeeLoanRequest({
          employeeId: formUIProps?.selectedEmp?.value,
          ids: "",
          queryParams: loanDetailFilter,
        })
      );
    }

    if (payrollData && formUIProps?.selectedEmp) {
      dispatch(
        fetchLeaveApplication(
          {
            ...leaveDetailFilter,
            filter: {
              ...leaveDetailFilter?.filter,
              from: payrollData?.startDate,
              to: payrollData?.endDate,
            },
          },
          formUIProps?.selectedEmp?.value
        )
      );
    }
  }, [formUIProps?.selectedEmp]);

  return (
    <>
      <EmployeeSelection
        currentLevel={formUIProps?.currentLevel}
        setCurrentLevel={formUIProps?.setCurrentLevel}
        selectedEmp={formUIProps?.selectedEmp}
        setSelectedEmp={formUIProps?.setSelectedEmp}
        employeeList={employeeList}
        levelList={levelList}
        logedInEmpoyee={logedInEmpoyee}
        leaveApprovalCount={leaveApprovalCount?.length || 0}
        attendanceApprovalCount={attendanceApprovalCount?.length || 0}
      />
      <EmployeeProfile data={profileInfo} />
      <br />
      <hr />
      <ReportingEmpTable
        empAuthorityList={
          reportingEmployee?.length > 0 ? reportingEmployee : []
        }
      />
      <br />
      <hr />
      <LeaveBalanceTable leaveBalances={leaveBalances} />
      <br />
      <hr />
      <LeaveApplicationTable
        entities={leaveRequest?.length > 0 ? leaveRequest : []}
        payrollData={payrollData}
      />
      <br />
      <hr />
      <EmployeeLoanDetail
        entities={loanRequest?.length > 0 ? loanRequest : []}
      />
      <br />
      <hr />
      <EmployeeExtendedInfo
        contactInfo={contactInfo}
        experienceInfo={experienceInfo}
        academicInfo={academicInfo}
        skillsInfo={skillsInfo}
      />
    </>
  );
};
